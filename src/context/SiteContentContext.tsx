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
import type { AboutContent, HeroContent, SiteConfig, SiteContent, Testimonial } from '../types/content'
import { defaultContent } from '../data/defaultContent'
import {
  clearStoredContent,
  cloneDefaultContent,
  loadStoredContent,
  saveStoredContent,
} from '../utils/storage'
import { fetchCloudContent, saveCloudContent } from '../services/contentApi'

interface SiteContentContextValue {
  content: SiteContent
  site: SiteConfig
  properties: Property[]
  hero: HeroContent
  about: AboutContent
  testimonials: Testimonial[]
  getPropertyById: (id: number) => Property | undefined
  updateSite: (site: SiteConfig) => void
  updateHero: (hero: HeroContent) => void
  updateAbout: (about: AboutContent) => void
  updateTestimonials: (testimonials: Testimonial[]) => void
  saveProperty: (property: Property) => void
  deleteProperty: (id: number) => void
  importContent: (content: SiteContent) => void
  resetToDefaults: () => void
  exportContent: () => string
  syncNow: () => Promise<void>
  lastSyncStatus: 'idle' | 'syncing' | 'ok' | 'error'
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

function getInitialContent(): SiteContent {
  return loadStoredContent() ?? cloneDefaultContent()
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(getInitialContent)
  const [lastSyncStatus, setLastSyncStatus] = useState<'idle' | 'syncing' | 'ok' | 'error'>('idle')
  const didHydrateFromCloud = useRef(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    saveStoredContent(content)
  }, [content])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const cloud = await fetchCloudContent()
      if (!cloud || cancelled) return
      setContent(cloud)
      didHydrateFromCloud.current = true
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback((next: SiteContent) => {
    setContent(next)
  }, [])

  const getPropertyById = useCallback(
    (id: number) => content.properties.find((property) => property.id === id),
    [content.properties],
  )

  const updateSite = useCallback(
    (site: SiteConfig) => persist({ ...content, site }),
    [content, persist],
  )

  const updateHero = useCallback(
    (hero: HeroContent) => persist({ ...content, hero }),
    [content, persist],
  )

  const updateAbout = useCallback(
    (about: AboutContent) => persist({ ...content, about }),
    [content, persist],
  )

  const updateTestimonials = useCallback(
    (testimonials: Testimonial[]) => persist({ ...content, testimonials }),
    [content, persist],
  )

  const saveProperty = useCallback(
    (property: Property) => {
      const exists = content.properties.some((item) => item.id === property.id)
      const properties = exists
        ? content.properties.map((item) => (item.id === property.id ? property : item))
        : [...content.properties, property]

      persist({ ...content, properties })
    },
    [content, persist],
  )

  const deleteProperty = useCallback(
    (id: number) => {
      persist({
        ...content,
        properties: content.properties.filter((property) => property.id !== id),
      })
    },
    [content, persist],
  )

  const importContent = useCallback((next: SiteContent) => {
    persist(next)
  }, [persist])

  const resetToDefaults = useCallback(() => {
    clearStoredContent()
    setContent(cloneDefaultContent())
  }, [])

  const exportContent = useCallback(() => JSON.stringify(content, null, 2), [content])

  const syncNow = useCallback(async () => {
    setLastSyncStatus('syncing')
    const ok = await saveCloudContent(content, import.meta.env.VITE_ADMIN_PASSWORD ?? '48698574')
    setLastSyncStatus(ok ? 'ok' : 'error')
  }, [content])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (didHydrateFromCloud.current) {
      // evita re-salvar imediatamente após puxar do cloud
      didHydrateFromCloud.current = false
      return
    }

    void syncNow()
  }, [content, syncNow])

  const value = useMemo(
    () => ({
      content,
      site: content.site,
      properties: content.properties,
      hero: content.hero,
      about: content.about,
      testimonials: content.testimonials,
      getPropertyById,
      updateSite,
      updateHero,
      updateAbout,
      updateTestimonials,
      saveProperty,
      deleteProperty,
      importContent,
      resetToDefaults,
      exportContent,
      syncNow,
      lastSyncStatus,
    }),
    [
      content,
      getPropertyById,
      updateSite,
      updateHero,
      updateAbout,
      updateTestimonials,
      saveProperty,
      deleteProperty,
      importContent,
      resetToDefaults,
      exportContent,
      syncNow,
      lastSyncStatus,
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
