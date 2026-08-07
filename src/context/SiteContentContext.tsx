import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getPublishedProperties, type Property } from '../data/properties'
import type { AboutContent, HeroContent, PropertyOptionsConfig, SiteConfig, SiteContent, Testimonial } from '../types/content'
import { defaultContent } from '../data/defaultContent'
import {
  clearStoredContent,
  cloneDefaultContent,
  loadStoredContent,
  saveStoredContent,
} from '../utils/storage'
import { normalizeSiteContent } from '../utils/contentMerge'
import { cloneContent } from '../utils/contentClone'
import { collectPropertyImageUrls } from '../utils/storagePaths'
import { deleteStorageFiles, fetchCloudContent, fetchCloudDraft, saveCloudContent, saveCloudDraft, clearCloudDraft } from '../services/contentApi'
import { getAdminSyncPassword, isAdminSessionActive } from '../config/admin'
import { isCloudEnabled } from '../lib/supabase'
import { useAdminAuth } from './AdminAuthContext'

const MAX_UNDO = 30

interface SiteContentContextValue {
  /** Conteúdo de trabalho (rascunho no admin). */
  content: SiteContent
  /**
   * Conteúdo já publicado na nuvem — o que visitantes devem ver.
   * Nunca use o rascunho do admin nas páginas públicas.
   */
  publishedContent: SiteContent
  site: SiteConfig
  properties: Property[]
  /** Imóveis visíveis no site público (versão publicada + flag isPublished). */
  publicProperties: Property[]
  propertyOptions: PropertyOptionsConfig
  hero: HeroContent
  about: AboutContent
  testimonials: Testimonial[]
  /** Dados públicos (site, hero, etc.) sempre da versão publicada. */
  publicSite: SiteConfig
  publicHero: HeroContent
  publicAbout: AboutContent
  publicTestimonials: Testimonial[]
  publicPropertyOptions: PropertyOptionsConfig
  isReady: boolean
  canUndo: boolean
  hasUnpublishedChanges: boolean
  getPropertyById: (id: number) => Property | undefined
  /** Busca imóvel apenas na versão publicada e liberada para o site. */
  getPublicPropertyById: (id: number) => Property | undefined
  updateSite: (site: SiteConfig | ((current: SiteConfig) => SiteConfig)) => void
  updateHero: (hero: HeroContent) => void
  updateAbout: (about: AboutContent) => void
  updateTestimonials: (testimonials: Testimonial[]) => void
  updatePropertyOptions: (propertyOptions: PropertyOptionsConfig) => void
  saveProperty: (property: Property) => void
  deleteProperty: (id: number, options?: { permanent?: boolean }) => Promise<void>
  deletePropertyImages: (urls: string[], options?: { permanent?: boolean }) => Promise<void>
  importContent: (content: SiteContent) => void
  resetToDefaults: () => void
  exportContent: () => string
  undo: () => void
  saveDraft: () => Promise<boolean>
  publishChanges: () => Promise<boolean>
  discardDraft: () => Promise<void>
  syncNow: () => Promise<void>
  reloadFromCloud: () => Promise<void>
  lastSyncStatus: 'idle' | 'syncing' | 'ok' | 'error' | 'draft'
  lastSyncError: string | null
  isCloudConfigured: boolean
  isLoadingFromCloud: boolean
  cloudDraftReady: boolean
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

function getBootstrapContent(): SiteContent {
  if (isAdminSessionActive()) {
    const stored = loadStoredContent()
    if (stored) return normalizeSiteContent(stored)
  }
  return cloneDefaultContent()
}

function contentEquals(a: SiteContent, b: SiteContent): boolean {
  return JSON.stringify(normalizeSiteContent(a)) === JSON.stringify(normalizeSiteContent(b))
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth()
  const isCloudConfigured = isCloudEnabled()

  const [content, setContent] = useState<SiteContent>(getBootstrapContent)
  const [publishedContent, setPublishedContent] = useState<SiteContent>(() => cloneDefaultContent())
  const [isReady, setIsReady] = useState(!isCloudConfigured)
  const [canUndo, setCanUndo] = useState(false)
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'syncing' | 'ok' | 'error' | 'draft'>('idle')
  const [lastSyncError, setLastSyncError] = useState<string | null>(null)
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(isCloudConfigured)
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)
  const [cloudDraftReady, setCloudDraftReady] = useState(false)

  const contentRef = useRef(content)
  const publishedRef = useRef<SiteContent>(cloneDefaultContent())
  const undoStack = useRef<SiteContent[]>([])
  const skipUndoPush = useRef(true)
  const didHydrateFromCloud = useRef(false)
  const isHydrating = useRef(false)
  const wasAuthenticated = useRef(isAuthenticated)
  const draftSaveTimer = useRef<number | null>(null)
  const skipCloudDraftSave = useRef(false)

  const setPublishedSnapshot = useCallback((next: SiteContent) => {
    const normalized = cloneContent(normalizeSiteContent(next))
    publishedRef.current = normalized
    setPublishedContent(normalized)
  }, [])

  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    if (!isAdminSessionActive()) return
    const saved = saveStoredContent(content)
    if (!saved) {
      setLastSyncError('Memória do navegador cheia. Use fotos menores ou envie para o armazenamento online.')
    }
    const unpublished = !contentEquals(content, publishedRef.current)
    setHasUnpublishedChanges(unpublished)
    if (unpublished && lastSyncStatus !== 'syncing' && lastSyncStatus !== 'error') {
      setLastSyncStatus('draft')
    }
  }, [content, lastSyncStatus])

  const publishToCloud = useCallback(async (next: SiteContent): Promise<boolean> => {
    if (!isAdminSessionActive()) return false

    setLastSyncStatus('syncing')
    setLastSyncError(null)

    const result = await saveCloudContent(next, getAdminSyncPassword())
    if (result.ok) {
      setPublishedSnapshot(next)
      setHasUnpublishedChanges(false)
      setLastSyncStatus('ok')
      setLastSyncError(null)
      saveStoredContent(normalizeSiteContent(next))
      await clearCloudDraft(getAdminSyncPassword())
      return true
    }

    setLastSyncStatus('error')
    setLastSyncError(result.error)
    return false
  }, [setPublishedSnapshot])

  const pushDraftToCloud = useCallback(async (next: SiteContent): Promise<boolean> => {
    if (!isCloudConfigured || !isAdminSessionActive()) return false
    const result = await saveCloudDraft(next, getAdminSyncPassword())
    if (!result.ok) {
      setLastSyncError(result.error)
      setCloudDraftReady(false)
      return false
    }
    setCloudDraftReady(true)
    if (lastSyncStatus !== 'syncing') {
      setLastSyncError(null)
    }
    return true
  }, [isCloudConfigured, lastSyncStatus])

  useEffect(() => {
    if (!isAuthenticated || !isCloudConfigured) return
    if (!didHydrateFromCloud.current || isHydrating.current || skipCloudDraftSave.current) return
    if (contentEquals(content, publishedRef.current)) return

    if (draftSaveTimer.current) window.clearTimeout(draftSaveTimer.current)
    draftSaveTimer.current = window.setTimeout(() => {
      void pushDraftToCloud(contentRef.current)
    }, 1200)

    return () => {
      if (draftSaveTimer.current) window.clearTimeout(draftSaveTimer.current)
    }
  }, [content, isAuthenticated, isCloudConfigured, pushDraftToCloud])

  const applyContent = useCallback((next: SiteContent, options?: { recordUndo?: boolean }) => {
    const recordUndo = options?.recordUndo ?? true

    if (recordUndo && !skipUndoPush.current) {
      const current = contentRef.current
      if (!contentEquals(current, next)) {
        undoStack.current.push(cloneContent(current))
        if (undoStack.current.length > MAX_UNDO) {
          undoStack.current.shift()
        }
        setCanUndo(true)
      }
    }

    setContent(normalizeSiteContent(next))
  }, [])

  const hydrateFromCloud = useCallback(async () => {
    if (isHydrating.current) return
    isHydrating.current = true
    skipUndoPush.current = true

    if (!isCloudConfigured) {
      setPublishedSnapshot(contentRef.current)
      setIsReady(true)
      setIsLoadingFromCloud(false)
      skipUndoPush.current = false
      isHydrating.current = false
      return
    }

    setIsLoadingFromCloud(true)

    try {
      const { content: cloud, error } = await fetchCloudContent()

      if (error) {
        setLastSyncStatus('error')
        setLastSyncError(
          `Não foi possível carregar dados da nuvem: ${error}. Execute supabase/fix-sync-completo.sql no Supabase.`,
        )
        const bootstrap = getBootstrapContent()
        setContent(bootstrap)
        setPublishedSnapshot(bootstrap)
        return
      }

      const published = cloud ? normalizeSiteContent(cloud) : getBootstrapContent()
      setPublishedSnapshot(published)

      if (isAdminSessionActive()) {
        skipCloudDraftSave.current = true
        const password = getAdminSyncPassword()
        const { content: cloudDraft, error: draftError } = await fetchCloudDraft(password)
        const local = loadStoredContent()
        const localDraft = local ? normalizeSiteContent(local) : null

        if (draftError) {
          setLastSyncError(draftError)
          setCloudDraftReady(false)
        } else {
          setCloudDraftReady(true)
        }

        let next = published
        const cloudHasDraft = Boolean(cloudDraft && !contentEquals(cloudDraft, published))
        const localHasDraft = Boolean(localDraft && !contentEquals(localDraft, published))

        if (cloudHasDraft && cloudDraft) {
          next = cloudDraft
        } else if (localHasDraft && localDraft) {
          next = localDraft
          const uploaded = await saveCloudDraft(localDraft, password)
          setCloudDraftReady(uploaded.ok)
          if (!uploaded.ok) setLastSyncError(uploaded.error)
          else if (!draftError) setLastSyncError(null)
        }

        setContent(next)
        saveStoredContent(next)
        setHasUnpublishedChanges(!contentEquals(next, published))
        setLastSyncStatus(contentEquals(next, published) ? 'ok' : 'draft')
        skipCloudDraftSave.current = false
      } else {
        // Visitantes (e admin deslogado): SEMPRE só a versão publicada.
        setContent(published)
        setHasUnpublishedChanges(false)
        setLastSyncStatus('ok')
        setCloudDraftReady(false)
      }

      didHydrateFromCloud.current = true
      undoStack.current = []
      setCanUndo(false)
    } finally {
      setIsReady(true)
      setIsLoadingFromCloud(false)
      skipUndoPush.current = false
      isHydrating.current = false
    }
  }, [isCloudConfigured, setPublishedSnapshot])

  useEffect(() => {
    void hydrateFromCloud()
  }, [hydrateFromCloud])

  useEffect(() => {
    if (isAuthenticated && !wasAuthenticated.current) {
      void hydrateFromCloud()
    }
    // Ao sair do admin, força o site a voltar à versão publicada (sem rascunho).
    if (!isAuthenticated && wasAuthenticated.current) {
      skipUndoPush.current = true
      skipCloudDraftSave.current = true
      const published = cloneContent(publishedRef.current)
      setContent(published)
      setHasUnpublishedChanges(false)
      setLastSyncStatus('ok')
      setCloudDraftReady(false)
      skipCloudDraftSave.current = false
      skipUndoPush.current = false
    }
    wasAuthenticated.current = isAuthenticated
  }, [isAuthenticated, hydrateFromCloud])

  const persist = useCallback(
    (next: SiteContent) => {
      applyContent(next)
    },
    [applyContent],
  )

  const undo = useCallback(() => {
    const previous = undoStack.current.pop()
    if (!previous) {
      setCanUndo(false)
      return
    }

    skipUndoPush.current = true
    setContent(normalizeSiteContent(previous))
    setCanUndo(undoStack.current.length > 0)
    skipUndoPush.current = false
  }, [])

  const getPropertyById = useCallback(
    (id: number) => content.properties.find((property) => property.id === id),
    [content.properties],
  )

  const publicProperties = useMemo(
    () => getPublishedProperties(publishedContent.properties),
    [publishedContent.properties],
  )

  const getPublicPropertyById = useCallback(
    (id: number) => publicProperties.find((property) => property.id === id),
    [publicProperties],
  )

  const updateSite = useCallback(
    (siteOrFn: SiteConfig | ((current: SiteConfig) => SiteConfig)) => {
      const current = contentRef.current
      const nextSite = typeof siteOrFn === 'function' ? siteOrFn(current.site) : siteOrFn
      persist({ ...current, site: nextSite })
    },
    [persist],
  )

  const updateHero = useCallback(
    (hero: HeroContent) => persist({ ...contentRef.current, hero }),
    [persist],
  )

  const updateAbout = useCallback(
    (about: AboutContent) => persist({ ...contentRef.current, about }),
    [persist],
  )

  const updateTestimonials = useCallback(
    (testimonials: Testimonial[]) => persist({ ...contentRef.current, testimonials }),
    [persist],
  )

  const updatePropertyOptions = useCallback(
    (propertyOptions: PropertyOptionsConfig) => persist({ ...contentRef.current, propertyOptions }),
    [persist],
  )

  const saveProperty = useCallback(
    (property: Property) => {
      const current = contentRef.current
      const exists = current.properties.some((item) => item.id === property.id)
      const properties = exists
        ? current.properties.map((item) => (item.id === property.id ? property : item))
        : [...current.properties, property]

      persist({ ...current, properties })
    },
    [persist],
  )

  const deleteProperty = useCallback(
    async (id: number, options?: { permanent?: boolean }) => {
      const current = contentRef.current
      const property = current.properties.find((item) => item.id === id)
      if (!property) return

      if (options?.permanent) {
        const urls = collectPropertyImageUrls(property)
        if (urls.length > 0) {
          const result = await deleteStorageFiles(urls)
          if (!result.ok) {
            throw new Error(result.error)
          }
        }
      }

      persist({
        ...current,
        properties: current.properties.filter((item) => item.id !== id),
      })
    },
    [persist],
  )

  const deletePropertyImages = useCallback(async (urls: string[], options?: { permanent?: boolean }) => {
    if (options?.permanent && urls.length > 0) {
      const result = await deleteStorageFiles(urls)
      if (!result.ok) {
        throw new Error(result.error)
      }
    }
  }, [])

  const importContent = useCallback(
    (next: SiteContent) => {
      applyContent(next, { recordUndo: true })
    },
    [applyContent],
  )

  const resetToDefaults = useCallback(() => {
    clearStoredContent()
    undoStack.current = []
    setCanUndo(false)
    skipUndoPush.current = true
    const defaults = cloneDefaultContent()
    setContent(defaults)
    skipUndoPush.current = false
    setHasUnpublishedChanges(!contentEquals(defaults, publishedRef.current))
    setLastSyncStatus('draft')
  }, [])

  const exportContent = useCallback(() => JSON.stringify(content, null, 2), [content])

  const saveDraft = useCallback(async () => {
    const next = contentRef.current
    const localOk = saveStoredContent(next)
    if (!localOk) return false
    if (!isCloudConfigured) return true
    return pushDraftToCloud(next)
  }, [isCloudConfigured, pushDraftToCloud])

  const publishChanges = useCallback(async () => {
    return publishToCloud(contentRef.current)
  }, [publishToCloud])

  const discardDraft = useCallback(async () => {
    skipUndoPush.current = true
    skipCloudDraftSave.current = true
    const published = cloneContent(publishedRef.current)
    setContent(published)
    saveStoredContent(published)
    setHasUnpublishedChanges(false)
    setLastSyncStatus('ok')
    undoStack.current = []
    setCanUndo(false)
    if (isCloudConfigured) {
      await clearCloudDraft(getAdminSyncPassword())
    }
    skipCloudDraftSave.current = false
    skipUndoPush.current = false
  }, [isCloudConfigured])

  const syncNow = useCallback(async () => {
    await publishToCloud(contentRef.current)
  }, [publishToCloud])

  const reloadFromCloud = useCallback(async () => {
    skipUndoPush.current = true
    await hydrateFromCloud()
  }, [hydrateFromCloud])

  const value = useMemo(
    () => ({
      content,
      publishedContent,
      site: content.site,
      properties: content.properties,
      publicProperties,
      propertyOptions: content.propertyOptions,
      hero: content.hero,
      about: content.about,
      testimonials: content.testimonials,
      publicSite: publishedContent.site,
      publicHero: publishedContent.hero,
      publicAbout: publishedContent.about,
      publicTestimonials: publishedContent.testimonials,
      publicPropertyOptions: publishedContent.propertyOptions,
      isReady,
      canUndo,
      hasUnpublishedChanges,
      getPropertyById,
      getPublicPropertyById,
      updateSite,
      updateHero,
      updateAbout,
      updateTestimonials,
      updatePropertyOptions,
      saveProperty,
      deleteProperty,
      deletePropertyImages,
      importContent,
      resetToDefaults,
      exportContent,
      undo,
      saveDraft,
      publishChanges,
      discardDraft,
      syncNow,
      reloadFromCloud,
      lastSyncStatus,
      lastSyncError,
      isCloudConfigured,
      isLoadingFromCloud,
      cloudDraftReady,
    }),
    [
      content,
      publishedContent,
      publicProperties,
      isReady,
      canUndo,
      hasUnpublishedChanges,
      getPropertyById,
      getPublicPropertyById,
      updateSite,
      updateHero,
      updateAbout,
      updateTestimonials,
      updatePropertyOptions,
      saveProperty,
      deleteProperty,
      deletePropertyImages,
      importContent,
      resetToDefaults,
      exportContent,
      undo,
      saveDraft,
      publishChanges,
      discardDraft,
      syncNow,
      reloadFromCloud,
      lastSyncStatus,
      lastSyncError,
      isCloudConfigured,
      isLoadingFromCloud,
      cloudDraftReady,
    ],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  const context = useContext(SiteContentContext)
  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentProvider')
  }
  return context
}

export { defaultContent }
