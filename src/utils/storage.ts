import type { SiteContent } from '../types/content'
import { defaultContent } from '../data/defaultContent'
import { normalizeSiteContent } from './contentMerge'

const STORAGE_KEY = 'jairacosta-site-content'

export function loadStoredContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalizeSiteContent(JSON.parse(raw) as SiteContent)
  } catch {
    return null
  }
}

export function saveStoredContent(content: SiteContent): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    return true
  } catch {
    return false
  }
}

export function clearStoredContent() {
  localStorage.removeItem(STORAGE_KEY)
}

export function cloneDefaultContent(): SiteContent {
  return JSON.parse(JSON.stringify(defaultContent)) as SiteContent
}
