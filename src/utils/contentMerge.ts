import type { Property } from '../data/properties'
import type { PropertyOptionsConfig, SiteContent } from '../types/content'
import { defaultPropertyOptions } from '../data/propertyOptions'

function cloneOptions(options: PropertyOptionsConfig): PropertyOptionsConfig {
  return {
    types: options.types.map((item) => ({ ...item })),
    categories: options.categories.map((item) => ({ ...item })),
    buildingTypes: options.buildingTypes.map((item) => ({ ...item })),
    cities: options.cities.map((item) => ({ ...item })),
    amenityPresets: options.amenityPresets.map((item) => ({ ...item })),
  }
}

export function normalizePropertyOptions(options?: Partial<PropertyOptionsConfig>): PropertyOptionsConfig {
  const defaults = cloneOptions(defaultPropertyOptions)

  if (!options) return defaults

  return {
    types: options.types?.length ? options.types : defaults.types,
    categories: options.categories?.length ? options.categories : defaults.categories,
    buildingTypes: options.buildingTypes?.length ? options.buildingTypes : defaults.buildingTypes,
    cities: options.cities?.length ? options.cities : defaults.cities,
    amenityPresets: options.amenityPresets?.length ? options.amenityPresets : defaults.amenityPresets,
  }
}

export function normalizeSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    propertyOptions: normalizePropertyOptions(content.propertyOptions),
    properties: content.properties.map((property) => ({
      ...property,
      images: [...(property.images ?? [])],
      amenities: [...(property.amenities ?? [])],
    })),
  }
}

/** Une dados locais, da nuvem e do estado em memória (prioridade crescente). */
export function mergeSiteContent(
  local: SiteContent | null,
  cloud: SiteContent,
  pending?: SiteContent | null,
): SiteContent {
  const normalizedCloud = normalizeSiteContent(cloud)
  const normalizedLocal = local ? normalizeSiteContent(local) : null
  const normalizedPending = pending ? normalizeSiteContent(pending) : null

  const propertyById = new Map<number, Property>()

  for (const property of normalizedCloud.properties) {
    propertyById.set(property.id, property)
  }
  if (normalizedLocal) {
    for (const property of normalizedLocal.properties) {
      propertyById.set(property.id, property)
    }
  }
  if (normalizedPending) {
    for (const property of normalizedPending.properties) {
      propertyById.set(property.id, property)
    }
  }

  return normalizeSiteContent({
    ...normalizedCloud,
    site: {
      ...normalizedCloud.site,
      ...(normalizedLocal?.site ?? {}),
      ...(normalizedPending?.site ?? {}),
    },
    hero: {
      ...normalizedCloud.hero,
      ...(normalizedLocal?.hero ?? {}),
      ...(normalizedPending?.hero ?? {}),
    },
    about: {
      ...normalizedCloud.about,
      ...(normalizedLocal?.about ?? {}),
      ...(normalizedPending?.about ?? {}),
    },
    testimonials: normalizedPending?.testimonials.length
      ? normalizedPending.testimonials
      : normalizedLocal?.testimonials.length
        ? normalizedLocal.testimonials
        : normalizedCloud.testimonials,
    propertyOptions:
      normalizedPending?.propertyOptions ??
      normalizedLocal?.propertyOptions ??
      normalizedCloud.propertyOptions,
    properties: Array.from(propertyById.values()),
  })
}
