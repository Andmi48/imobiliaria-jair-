import type { SiteContent } from '../types/content'
import { isCloudEnabled, supabase } from '../lib/supabase'
import { normalizeSiteContent } from '../utils/contentMerge'
import { validateContentForCloud } from '../utils/contentSanitize'

function isValidContent(data: unknown): data is SiteContent {
  if (!data || typeof data !== 'object') return false
  const content = data as SiteContent
  return Boolean(content.site && content.properties && content.hero && content.about)
}

export async function fetchCloudContent(): Promise<SiteContent | null> {
  if (!isCloudEnabled() || !supabase) return null

  const { data, error } = await supabase.rpc('get_site_content')

  if (error || !data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return null
  }

  return isValidContent(data) ? normalizeSiteContent(data) : null
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
        'Senha de publicação incorreta ou permissão negada no Supabase. Abra o Supabase → SQL Editor e execute o arquivo supabase/fix-sync-completo.sql',
    }
  }

  return { ok: true }
}

export async function uploadPropertyImage(file: File): Promise<string | null> {
  if (!isCloudEnabled() || !supabase) return null

  const extension = file.name.split('.').pop() || 'jpg'
  const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

  const { error } = await supabase.storage.from('property-images').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return null

  const { data } = supabase.storage.from('property-images').getPublicUrl(filePath)
  return data.publicUrl
}

/** Logo do site — sempre no Supabase (sem base64), com cache bust. */
export async function uploadSiteLogo(file: File): Promise<string> {
  if (!isCloudEnabled() || !supabase) {
    throw new Error('Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel.')
  }

  const extension = (file.name.split('.').pop() || 'png').toLowerCase()
  const filePath = `logos/site-logo.${extension}`

  const { error } = await supabase.storage.from('property-images').upload(filePath, file, {
    cacheControl: '60',
    upsert: true,
  })

  if (error) {
    throw new Error(`Falha ao enviar logo: ${error.message}`)
  }

  const { data } = supabase.storage.from('property-images').getPublicUrl(filePath)
  return `${data.publicUrl}?v=${Date.now()}`
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

export async function uploadPropertyImageWithFallback(file: File): Promise<string> {
  const url = await uploadPropertyImage(file)
  if (url) return url
  return readFileAsDataUrl(file)
}

export async function uploadPropertyImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadPropertyImageWithFallback(file)))
}
