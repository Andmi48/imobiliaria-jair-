import type { SiteContent } from '../types/content'

export interface ContentHistoryEntry {
  id: number
  createdAt: string
}

export function cloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent
}
