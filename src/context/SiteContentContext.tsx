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
import { mergeSiteContent, normalizeSiteContent } from '../utils/contentMerge'
import { fetchCloudContent, saveCloudContent } from '../services/contentApi'
import { getAdminSyncPassword, isAdminSessionActive } from '../config/admin'
import { useAdminAuth } from './AdminAuthContext'

interface SiteContentContextValue {
  content: SiteContent
  site: SiteConfig
  properties: Property[]
  propertyOptions: PropertyOptionsConfig
  hero: HeroContent
  about: AboutContent
  testimonials: Testimonial[]
  getPropertyById: (id: number) => Property | undefined
  updateSite: (site: SiteConfig | ((current: SiteConfig) => SiteConfig)) => void
  updateHero: (hero: HeroContent) => void
  updateAbout: (about: AboutContent) => void
  updateTestimonials: (testimonials: Testimonial[]) => void
  updatePropertyOptions: (propertyOptions: PropertyOptionsConfig) => void
  saveProperty: (property: Property) => void
  deleteProperty: (id: number) => void
  importContent: (content: SiteContent) => void
  resetToDefaults: () => void
  exportContent: () => string
  syncNow: () => Promise<void>
  lastSyncStatus: 'idle' | 'syncing' | 'ok' | 'error'
  lastSyncError: string | null
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

function getInitialContent(): SiteContent {
  if (isAdminSessionActive()) {
    return normalizeSiteContent(loadStoredContent() ?? cloneDefaultContent())
  }
  return cloneDefaultContent()
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth()
  const [content, setContent] = useState<SiteContent>(getInitialContent)
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'syncing' | 'ok' | 'error'>('idle')
  const [lastSyncError, setLastSyncError] = useState<string | null>(null)

  const contentRef = useRef(content)
  const didHydrateFromCloud = useRef(false)
  const isFirstRender = useRef(true)
  const isHydrating = useRef(false)
  const wasAuthenticated = useRef(isAuthenticated)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    if (!isAdminSessionActive()) return

    const saved = saveStoredContent(content)
    if (!saved) {
      setLastSyncStatus('error')
      setLastSyncError(
        'Memória do navegador cheia. Use fotos menores ou envie para o armazenamento online.',
      )
    }
  }, [content])

  const publishToCloud = useCallback(async (next: SiteContent): Promise<boolean> => {
    if (!isAdminSessionActive()) return false

    setLastSyncStatus('syncing')
    setLastSyncError(null)

    const result = await saveCloudContent(next, getAdminSyncPassword())
    if (result.ok) {
      setLastSyncStatus('ok')
      setLastSyncError(null)
      return true
    }

    setLastSyncStatus('error')
    setLastSyncError(result.error)
    return false
  }, [])

  const hydrateFromCloud = useCallback(async () => {
    if (isHydrating.current) return
    isHydrating.current = true

    try {
      const cloud = await fetchCloudContent()
      if (!cloud) return

      if (isAdminSessionActive()) {
        const local = loadStoredContent()
        const merged = mergeSiteContent(local, cloud, contentRef.current)
        setContent(merged)
        didHydrateFromCloud.current = true

        const cloudNormalized = normalizeSiteContent(cloud)
        if (JSON.stringify(merged) !== JSON.stringify(cloudNormalized)) {
          await publishToCloud(merged)
        }
      } else {
        setContent(normalizeSiteContent(cloud))
        didHydrateFromCloud.current = true
      }
    } finally {
      isHydrating.current = false
    }
  }, [publishToCloud])

  useEffect(() => {
    void hydrateFromCloud()
  }, [hydrateFromCloud])

  useEffect(() => {
    if (isAuthenticated && !wasAuthenticated.current) {
      void hydrateFromCloud()
    }
    wasAuthenticated.current = isAuthenticated
  }, [isAuthenticated, hydrateFromCloud])

  const persist = useCallback((next: SiteContent) => {
    setContent(next)
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
    (id: number) => {
      const current = contentRef.current
      persist({
        ...current,
        properties: current.properties.filter((property) => property.id !== id),
      })
    },
    [persist],
  )

  const importContent = useCallback((next: SiteContent) => {
    persist(normalizeSiteContent(next))
  }, [persist])

  const resetToDefaults = useCallback(() => {
    clearStoredContent()
    setContent(cloneDefaultContent())
  }, [])

  const exportContent = useCallback(() => JSON.stringify(content, null, 2), [content])

  const syncNow = useCallback(async () => {
    await publishToCloud(contentRef.current)
  }, [publishToCloud])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (didHydrateFromCloud.current) {
      didHydrateFromCloud.current = false
      return
    }

    if (!isAdminSessionActive()) return

    void syncNow()
  }, [content, syncNow])

  const value = useMemo(
    () => ({
      content,
      site: content.site,
      properties: content.properties,
      propertyOptions: content.propertyOptions,
      hero: content.hero,
      about: content.about,
      testimonials: content.testimonials,
      getPropertyById,
      updateSite,
      updateHero,
      updateAbout,
      updateTestimonials,
      updatePropertyOptions,
      saveProperty,
      deleteProperty,
      importContent,
      resetToDefaults,
      exportContent,
      syncNow,
      lastSyncStatus,
      lastSyncError,
    }),
    [
      content,
      getPropertyById,
      updateSite,
      updateHero,
      updateAbout,
      updateTestimonials,
      updatePropertyOptions,
      saveProperty,
      deleteProperty,
      importContent,
      resetToDefaults,
      exportContent,
      syncNow,
      lastSyncStatus,
      lastSyncError,
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
