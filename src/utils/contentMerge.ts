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
