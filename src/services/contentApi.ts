import type { SiteContent } from '../types/content'
import type { ContentHistoryEntry } from '../utils/contentClone'
import { isCloudEnabled, supabase } from '../lib/supabase'
import { normalizeSiteContent } from '../utils/contentMerge'
import { validateContentForCloud } from '../utils/contentSanitize'
import { getStoragePathFromPublicUrl } from '../utils/storagePaths'
import { applyWatermarkToFile } from '../utils/imageWatermark'

export type ImageUploadOptions = {
  logoUrl?: string
  watermarkText?: string
  /** Logo do site não recebe marca dágua */
  skipWatermark?: boolean
}

function isValidContent(data: unknown): data is SiteContent {
  if (!data || typeof data !== 'object') return false
  const content = data as SiteContent
  return Boolean(content.site && Array.isArray(content.properties) && content.hero && content.about)
}

export async function fetchCloudContent(): Promise<{ content: SiteContent | null; error?: string }> {
  if (!isCloudEnabled() || !supabase) return { content: null }

  const { data, error } = await supabase.rpc('get_site_content')

  if (error) return { content: null, error: error.message }
  if (data == null || typeof data !== 'object' || Object.keys(data).length === 0) {
    return { content: null }
  }

  if (!isValidContent(data)) {
    return { content: null, error: 'Dados do site inválidos na nuvem.' }
  }

  return { content: normalizeSiteContent(data) }
}

export type SaveCloudResult = { ok: true } | { ok: false; error: string }

export async function saveCloudContent(
  content: SiteContent,
  adminPassword: string,
): Promise<SaveCloudResult> {
  if (!isCloudEnabled() || !supabase) {
    return { ok: false, error: 'Supabase não configurado. Verifique as variáveis na Vercel.' }
  }

  const validationError = validateContentForCloud(content)
  if (validationError) {
    return { ok: false, error: validationError }
  }

  const { data, error } = await supabase.rpc('save_site_content', {
    content: normalizeSiteContent(content),
    admin_password: adminPassword,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  if (data !== true) {
    return {
      ok: false,
      error:
        'Senha de publicação incorreta ou permissão negada no Supabase. Execute supabase/fix-sync-completo.sql e supabase/content-history.sql.',
    }
  }

  return { ok: true }
}

export async function fetchContentHistory(): Promise<ContentHistoryEntry[]> {
  if (!isCloudEnabled() || !supabase) return []

  const { data, error } = await supabase.rpc('list_site_content_history')

  if (error || !Array.isArray(data)) return []

  return data.map((row: { id: number; created_at: string }) => ({
    id: Number(row.id),
    createdAt: row.created_at,
  }))
}

export async function restoreContentVersion(
  historyId: number,
  adminPassword: string,
): Promise<SaveCloudResult> {
  if (!isCloudEnabled() || !supabase) {
    return { ok: false, error: 'Supabase não configurado.' }
  }

  const { data, error } = await supabase.rpc('restore_site_content_version', {
    history_id: historyId,
    admin_password: adminPassword,
  })

  if (error) return { ok: false, error: error.message }
  if (data !== true) return { ok: false, error: 'Não foi possível restaurar esta versão.' }

  return { ok: true }
}

async function prepareImageForUpload(file: File, options?: ImageUploadOptions): Promise<File> {
  if (options?.skipWatermark) return file
  return applyWatermarkToFile(file, {
    logoUrl: options?.logoUrl,
    fallbackText: options?.watermarkText,
  })
}

export async function uploadPropertyImage(file: File, options?: ImageUploadOptions): Promise<string | null> {
  if (!isCloudEnabled() || !supabase) return null

  const watermarked = await prepareImageForUpload(file, options)
  const extension = watermarked.name.split('.').pop() || 'jpg'
  const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

  const { error } = await supabase.storage.from('property-images').upload(filePath, watermarked, {
    cacheControl: '3600',
    upsert: false,
    contentType: watermarked.type || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
  })

  if (error) return null

  const { data } = supabase.storage.from('property-images').getPublicUrl(filePath)
  return data.publicUrl
}

/** Logo do site — arquivo original, sem compressão nem conversão. */
export async function uploadSiteLogo(file: File): Promise<string> {
  if (!isCloudEnabled() || !supabase) {
    throw new Error('Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel.')
  }

  const extension = (file.name.split('.').pop() || 'png').toLowerCase()
  const filePath = `logos/site-logo-${Date.now()}.${extension}`

  const { error } = await supabase.storage.from('property-images').upload(filePath, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
  })

  if (error) {
    throw new Error(`Falha ao enviar logo: ${error.message}`)
  }

  const { data } = supabase.storage.from('property-images').getPublicUrl(filePath)
  return data.publicUrl
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Falha ao ler arquivo'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

export async function uploadPropertyImageWithFallback(
  file: File,
  options?: ImageUploadOptions,
): Promise<string> {
  const watermarked = await prepareImageForUpload(file, options)
  const url = await uploadPropertyImage(watermarked, { ...options, skipWatermark: true })
  if (url) return url

  if (isCloudEnabled()) {
    throw new Error('Falha ao enviar imagem para o armazenamento online. Verifique o Supabase Storage.')
  }

  return readFileAsDataUrl(watermarked)
}

export async function uploadPropertyImages(files: File[], options?: ImageUploadOptions): Promise<string[]> {
  return Promise.all(files.map((file) => uploadPropertyImageWithFallback(file, options)))
}

export type DeleteStorageResult = { ok: true; deleted: number } | { ok: false; error: string }

/** Remove arquivos do bucket property-images (URLs públicas do Supabase). */
export async function deleteStorageFiles(urls: string[]): Promise<DeleteStorageResult> {
  if (!isCloudEnabled() || !supabase) {
    return { ok: false, error: 'Supabase não configurado.' }
  }

  const paths = urls
    .map(getStoragePathFromPublicUrl)
    .filter((path): path is string => Boolean(path))

  if (paths.length === 0) {
    return { ok: true, deleted: 0 }
  }

  const { error } = await supabase.storage.from('property-images').remove(paths)

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, deleted: paths.length }
}
