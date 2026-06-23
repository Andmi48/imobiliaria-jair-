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
import type { Property } from '../data/properties'
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
import { deleteStorageFiles, fetchCloudContent, saveCloudContent } from '../services/contentApi'
import { getAdminSyncPassword, isAdminSessionActive } from '../config/admin'
import { isCloudEnabled } from '../lib/supabase'
import { useAdminAuth } from './AdminAuthContext'

const MAX_UNDO = 30

interface SiteContentContextValue {
  content: SiteContent
  site: SiteConfig
  properties: Property[]
  propertyOptions: PropertyOptionsConfig
  hero: HeroContent
  about: AboutContent
  testimonials: Testimonial[]
  isReady: boolean
  canUndo: boolean
  hasUnpublishedChanges: boolean
  getPropertyById: (id: number) => Property | undefined
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
  saveDraft: () => boolean
  publishChanges: () => Promise<boolean>
  discardDraft: () => void
  syncNow: () => Promise<void>
  reloadFromCloud: () => Promise<void>
  lastSyncStatus: 'idle' | 'syncing' | 'ok' | 'error' | 'draft'
  lastSyncError: string | null
  isCloudConfigured: boolean
  isLoadingFromCloud: boolean
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
  const [isReady, setIsReady] = useState(!isCloudConfigured)
  const [canUndo, setCanUndo] = useState(false)
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'syncing' | 'ok' | 'error' | 'draft'>('idle')
  const [lastSyncError, setLastSyncError] = useState<string | null>(null)
  const [isLoadingFromCloud, setIsLoadingFromCloud] = useState(isCloudConfigured)
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)

  const contentRef = useRef(content)
  const publishedRef = useRef<SiteContent>(cloneDefaultContent())
  const undoStack = useRef<SiteContent[]>([])
  const skipUndoPush = useRef(true)
  const didHydrateFromCloud = useRef(false)
  const isHydrating = useRef(false)
  const wasAuthenticated = useRef(isAuthenticated)

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
      publishedRef.current = cloneContent(normalizeSiteContent(next))
      setHasUnpublishedChanges(false)
      setLastSyncStatus('ok')
      setLastSyncError(null)
      return true
    }

    setLastSyncStatus('error')
    setLastSyncError(result.error)
    return false
  }, [])

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
      publishedRef.current = cloneContent(contentRef.current)
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
        publishedRef.current = cloneContent(bootstrap)
        return
      }

      const published = cloud ? normalizeSiteContent(cloud) : getBootstrapContent()
      publishedRef.current = cloneContent(published)

      if (isAdminSessionActive()) {
        const local = loadStoredContent()
        const draft = local ? normalizeSiteContent(local) : published
        setContent(draft)
        setHasUnpublishedChanges(!contentEquals(draft, published))
        setLastSyncStatus(contentEquals(draft, published) ? 'ok' : 'draft')
      } else {
        setContent(published)
        setHasUnpublishedChanges(false)
        setLastSyncStatus('ok')
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
  }, [isCloudConfigured])

  useEffect(() => {
    void hydrateFromCloud()
  }, [hydrateFromCloud])

  useEffect(() => {
    if (isAuthenticated && !wasAuthenticated.current) {
      void hydrateFromCloud()
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

  const saveDraft = useCallback(() => {
    return saveStoredContent(contentRef.current)
  }, [])

  const publishChanges = useCallback(async () => {
    return publishToCloud(contentRef.current)
  }, [publishToCloud])

  const discardDraft = useCallback(() => {
    skipUndoPush.current = true
    const published = cloneContent(publishedRef.current)
    setContent(published)
    saveStoredContent(published)
    setHasUnpublishedChanges(false)
    setLastSyncStatus('ok')
    undoStack.current = []
    setCanUndo(false)
    skipUndoPush.current = false
  }, [])

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
      site: content.site,
      properties: content.properties,
      propertyOptions: content.propertyOptions,
      hero: content.hero,
      about: content.about,
      testimonials: content.testimonials,
      isReady,
      canUndo,
      hasUnpublishedChanges,
      getPropertyById,
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
    }),
    [
      content,
      isReady,
      canUndo,
      hasUnpublishedChanges,
      getPropertyById,
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
