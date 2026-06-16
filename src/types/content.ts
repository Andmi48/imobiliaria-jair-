import type { Property } from '../data/properties'

export interface SiteConfig {
  name: string
  shortName: string
  creci: string
  address: {
    street: string
    city: string
  }
  email: string
  phones: string[]
  whatsapp: string
  social: {
    instagram: string
    linkedin: string
    youtube: string
    tiktok: string
  }
}

export interface HeroContent {
  welcomePrefix: string
  welcomeHighlight: string
  subtitle: string
  backgroundImage: string
  stats: Array<{ value: string; label: string }>
}

export interface AboutContent {
  image: string
  title: string
  titleHighlight: string
  paragraph1: string
  paragraph2: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
}

export interface SiteContent {
  site: SiteConfig
  properties: Property[]
  hero: HeroContent
  about: AboutContent
  testimonials: Testimonial[]
}
