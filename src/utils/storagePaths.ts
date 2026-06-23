const BUCKET_MARKER = '/storage/v1/object/public/property-images/'

/** Extrai o caminho interno do bucket a partir da URL pública do Supabase. */
export function getStoragePathFromPublicUrl(url: string): string | null {
  if (!url || url.startsWith('data:')) return null
  const index = url.indexOf(BUCKET_MARKER)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + BUCKET_MARKER.length).split('?')[0])
}

export function collectPropertyImageUrls(property: {
  image?: string
  images?: string[]
}): string[] {
  const urls = new Set<string>()
  if (property.image?.trim()) urls.add(property.image.trim())
  property.images?.forEach((url) => {
    if (url?.trim()) urls.add(url.trim())
  })
  return [...urls]
}
