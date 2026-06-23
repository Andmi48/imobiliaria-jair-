import type { Property } from '../data/properties'
import type { SiteConfig } from '../types/content'
import { formatPropertyPrice } from './propertyFormat'

export const MAX_BANNER_PHOTOS = 5

export type BannerTemplateId = 'classic' | 'modern' | 'bold' | 'minimal' | 'collage'
export type BannerPaletteId = 'sapphire' | 'emerald' | 'gold' | 'slate' | 'ocean'
export type BannerCorner = 'top-left' | 'top-right'

export const BANNER_TEMPLATES: Array<{
  id: BannerTemplateId
  name: string
  description: string
}> = [
  {
    id: 'classic',
    name: 'Destaque',
    description: 'Foto principal + coluna lateral de fotos + painel organizado',
  },
  {
    id: 'modern',
    name: 'Editorial',
    description: 'Foto em tela cheia à esquerda + painel lateral com texto e descrição',
  },
  {
    id: 'bold',
    name: 'Cinematográfico',
    description: 'Imagem de fundo imersiva com texto sobreposto e preço em destaque',
  },
  {
    id: 'minimal',
    name: 'Galeria',
    description: 'Duas fotos grandes no topo + descrição em duas colunas abaixo',
  },
  {
    id: 'collage',
    name: 'Mosaico Premium',
    description: 'Composição assimétrica de fotos com cartão flutuante de informações',
  },
]

export const BANNER_PALETTES: Array<{
  id: BannerPaletteId
  name: string
  swatch: string[]
  description: string
}> = [
  {
    id: 'sapphire',
    name: 'Safira',
    swatch: ['#0f172a', '#38bdf8', '#fbbf24'],
    description: 'Azul profundo com detalhes dourados',
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    swatch: ['#064e3b', '#34d399', '#a7f3d0'],
    description: 'Verde sofisticado e acolhedor',
  },
  {
    id: 'gold',
    name: 'Ouro Premium',
    swatch: ['#1c1917', '#fbbf24', '#fef3c7'],
    description: 'Elegância escura com ouro',
  },
  {
    id: 'slate',
    name: 'Grafite',
    swatch: ['#1f2937', '#e5e7eb', '#93c5fd'],
    description: 'Neutro atemporal',
  },
  {
    id: 'ocean',
    name: 'Oceano',
    swatch: ['#0c4a6e', '#22d3ee', '#bae6fd'],
    description: 'Azul fresco e convidativo',
  },
]

export interface BannerCustomization {
  paletteId: BannerPaletteId
  logoPosition: BannerCorner
  typePosition: BannerCorner
}

export const DEFAULT_BANNER_CUSTOMIZATION: BannerCustomization = {
  paletteId: 'sapphire',
  logoPosition: 'top-left',
  typePosition: 'top-right',
}

const W = 1080
const H = 1080

type Palette = {
  panelBg: string
  panelBgSoft: string
  titleColor: string
  textColor: string
  mutedColor: string
  accentColor: string
  priceGradientStart: string
  priceGradientEnd: string
  priceText: string
  chipBg: string
  chipText: string
  saleBadge: string
  rentBadge: string
  promoBadge: string
  promoText: string
}

const PALETTES: Record<BannerPaletteId, Palette> = {
  sapphire: {
    panelBg: '#0f172a',
    panelBgSoft: 'rgba(15,23,42,0.88)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.9)',
    mutedColor: 'rgba(255,255,255,0.7)',
    accentColor: '#38bdf8',
    priceGradientStart: '#fde68a',
    priceGradientEnd: '#fbbf24',
    priceText: '#1c1917',
    chipBg: 'rgba(56,189,248,0.2)',
    chipText: '#e0f2fe',
    saleBadge: '#1e40af',
    rentBadge: '#0e7490',
    promoBadge: '#fbbf24',
    promoText: '#1c1917',
  },
  emerald: {
    panelBg: '#064e3b',
    panelBgSoft: 'rgba(6,78,59,0.9)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.92)',
    mutedColor: 'rgba(255,255,255,0.72)',
    accentColor: '#34d399',
    priceGradientStart: '#a7f3d0',
    priceGradientEnd: '#34d399',
    priceText: '#064e3b',
    chipBg: 'rgba(52,211,153,0.22)',
    chipText: '#d1fae5',
    saleBadge: '#047857',
    rentBadge: '#0d9488',
    promoBadge: '#fde68a',
    promoText: '#064e3b',
  },
  gold: {
    panelBg: '#1c1917',
    panelBgSoft: 'rgba(28,25,23,0.92)',
    titleColor: '#fef3c7',
    textColor: 'rgba(254,243,199,0.88)',
    mutedColor: 'rgba(254,243,199,0.62)',
    accentColor: '#fbbf24',
    priceGradientStart: '#fef3c7',
    priceGradientEnd: '#fbbf24',
    priceText: '#1c1917',
    chipBg: 'rgba(251,191,36,0.18)',
    chipText: '#fef3c7',
    saleBadge: '#78350f',
    rentBadge: '#57534e',
    promoBadge: '#fbbf24',
    promoText: '#1c1917',
  },
  slate: {
    panelBg: '#1f2937',
    panelBgSoft: 'rgba(31,41,55,0.9)',
    titleColor: '#f9fafb',
    textColor: 'rgba(249,250,251,0.9)',
    mutedColor: 'rgba(209,213,219,0.78)',
    accentColor: '#93c5fd',
    priceGradientStart: '#eff6ff',
    priceGradientEnd: '#93c5fd',
    priceText: '#1e3a8a',
    chipBg: 'rgba(147,197,253,0.18)',
    chipText: '#eff6ff',
    saleBadge: '#374151',
    rentBadge: '#4b5563',
    promoBadge: '#fde68a',
    promoText: '#1f2937',
  },
  ocean: {
    panelBg: '#0c4a6e',
    panelBgSoft: 'rgba(12,74,110,0.9)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.92)',
    mutedColor: 'rgba(186,230,253,0.82)',
    accentColor: '#22d3ee',
    priceGradientStart: '#cffafe',
    priceGradientEnd: '#22d3ee',
    priceText: '#0c4a6e',
    chipBg: 'rgba(34,211,238,0.2)',
    chipText: '#ecfeff',
    saleBadge: '#0369a1',
    rentBadge: '#0891b2',
    promoBadge: '#fef08a',
    promoText: '#0c4a6e',
  },
}

type RenderContext = {
  photos: HTMLImageElement[]
  property: Property
  site: SiteConfig
  logo: HTMLImageElement | null
  palette: Palette
  customization: BannerCustomization
}

// ─── Utilitários de imagem ───────────────────────────────────────────────────

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Não foi possível processar uma das fotos.'))
    img.src = src
  })
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  if (url.startsWith('data:') || url.startsWith('blob:')) return loadImageElement(url)
  try {
    const response = await fetch(url, { mode: 'cors', credentials: 'omit', cache: 'no-store' })
    if (!response.ok) throw new Error('fetch failed')
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    try {
      return await loadImageElement(objectUrl)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  } catch {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Não foi possível carregar as fotos para o banner.'))
      img.src = url
    })
  }
}

async function loadLogo(site: SiteConfig): Promise<HTMLImageElement | null> {
  if (!site.logoUrl?.trim()) return null
  try {
    return await loadImage(site.logoUrl.trim())
  } catch {
    return null
  }
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  const sx = (img.width - sw) / 2
  const sy = (img.height - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

// ─── Conteúdo do imóvel ──────────────────────────────────────────────────────

function hasPriceDrop(property: Property): boolean {
  return Boolean(
    property.previousPriceValue &&
      property.previousPriceValue > 0 &&
      property.priceValue > 0 &&
      property.previousPriceValue > property.priceValue,
  )
}

function getHighlightLabel(property: Property): string | null {
  if (property.promoHighlight?.trim()) return property.promoHighlight.trim()
  if (hasPriceDrop(property)) return 'Oportunidade'
  return null
}

function getCleanDescription(property: Property, maxLen = 320): string {
  let text = (property.description || '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[✔✓•|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) {
    return `Imóvel em ${property.location}, ${property.city}. Agende sua visita.`
  }

  const titleLower = property.title.toLowerCase()
  if (text.toLowerCase().startsWith(titleLower.slice(0, Math.min(18, titleLower.length)))) {
    text = text.slice(property.title.length).replace(/^[\s,.–-]+/, '').trim()
  }

  const locationChunk = `${property.location} ${property.city}`.toLowerCase()
  if (text.toLowerCase().startsWith(locationChunk.slice(0, 12))) {
    text = text.replace(new RegExp(`^${property.location}[\\s,.•–-]*`, 'i'), '').trim()
  }

  if (text.length > maxLen) {
    const cut = text.slice(0, maxLen)
    const lastSpace = cut.lastIndexOf(' ')
    text = (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + '…'
  }
  return text
}

function getBulletPoints(property: Property): string[] {
  const titleLower = property.title.toLowerCase()

  if (property.amenities?.length) {
    return property.amenities
      .filter((a) => a.trim().length > 1)
      .slice(0, 5)
  }

  const fromDesc = (property.description || '')
    .split(/[✔✓•\n]/)
    .map((s) => s.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim())
    .filter((s) => {
      if (s.length < 3 || s.length > 40) return false
      if (s.toLowerCase().includes(titleLower.slice(0, 12))) return false
      if (/são paulo|vila|bairro/i.test(s) && s.length < 15) return false
      return true
    })

  if (fromDesc.length >= 2) return fromDesc.slice(0, 5)

  const specs: string[] = []
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} quartos`)
  if (property.bathrooms > 0) specs.push(`${property.bathrooms} banheiros`)
  if (property.area > 0) specs.push(`${property.area} m²`)
  if (property.parking > 0) specs.push(`${property.parking} vagas`)
  return specs.slice(0, 5)
}

function getSpecsLine(property: Property): string {
  const parts: string[] = []
  if (property.bedrooms > 0) parts.push(`${property.bedrooms} quartos`)
  parts.push(`${property.bathrooms} banh.`)
  parts.push(`${property.area}m²`)
  if (property.parking > 0) parts.push(`${property.parking} vagas`)
  return parts.join('  •  ')
}

/** Destaques que não repetem título, local ou metragem já exibidos no banner */
function getFeatureHighlights(property: Property, max = 4): string[] {
  const specsPattern = /quarto|dormit|banh|m²|m2|vaga|garagem|suíte/i
  const locationPattern = new RegExp(
    `${property.location}|${property.city}|${property.title}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i',
  )

  return getBulletPoints(property)
    .filter((item) => !specsPattern.test(item) && !locationPattern.test(item))
    .slice(0, max)
}

// ─── Layouts de foto ─────────────────────────────────────────────────────────

/** Destaque: grade equilibrada — principal + laterais grandes + faixa inferior */
function drawClassicPhotoLayout(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = 8

  if (photos.length === 1) {
    drawCoverImage(ctx, photos[0], x, y, w, h)
    return
  }

  if (photos.length === 2) {
    const half = (w - gap) / 2
    drawCoverImage(ctx, photos[0], x, y, half, h)
    drawCoverImage(ctx, photos[1], x + half + gap, y, half, h)
    return
  }

  const stripCount = Math.max(0, photos.length - 3)
  const stripH = stripCount > 0 ? Math.round(h * 0.26) : 0
  const mainH = h - stripH - (stripH > 0 ? gap : 0)

  const mainW = Math.round(w * 0.58) - gap / 2
  drawCoverImage(ctx, photos[0], x, y, mainW, mainH)

  const sideCount = Math.min(photos.length - 1, 2)
  const colX = x + mainW + gap
  const colW = w - mainW - gap
  const cellH = (mainH - gap * (sideCount - 1)) / sideCount

  for (let i = 0; i < sideCount; i++) {
    drawCoverImage(ctx, photos[i + 1], colX, y + i * (cellH + gap), colW, cellH)
  }

  if (stripH > 0) {
    const stripPhotos = photos.slice(3)
    const stripY = y + mainH + gap
    const thumbW = (w - gap * (stripPhotos.length - 1)) / stripPhotos.length
    stripPhotos.forEach((img, i) => {
      drawCoverImage(ctx, img, x + i * (thumbW + gap), stripY, thumbW, stripH)
    })
  }
}

/** Uma foto em tela cheia na área */
function drawSingleHero(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  drawCoverImage(ctx, photos[0], x, y, w, h)
}

/** Duas fotos grandes lado a lado */
function drawDualHero(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = 8
  const half = (w - gap) / 2
  drawCoverImage(ctx, photos[0], x, y, half, h)
  drawCoverImage(ctx, photos[1] ?? photos[0], x + half + gap, y, half, h)
}

/** Mosaico assimétrico: hero 68% à esquerda, coluna de fotos à direita */
function drawAsymmetricMosaic(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = 6
  if (photos.length === 1) {
    drawCoverImage(ctx, photos[0], x, y, w, h)
    return
  }

  const mainW = w * 0.68 - gap / 2
  drawCoverImage(ctx, photos[0], x, y, mainW, h)

  const colX = x + mainW + gap
  const colW = w - mainW - gap
  const extras = photos.slice(1, 4)

  if (extras.length === 1) {
    drawCoverImage(ctx, extras[0], colX, y, colW, h)
    return
  }

  const cellH = (h - gap * (extras.length - 1)) / extras.length
  extras.forEach((img, i) => {
    drawCoverImage(ctx, img, colX, y + i * (cellH + gap), colW, cellH)
  })
}

/** Faixa horizontal de fotos no rodapé */
function drawBottomFilmstrip(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  y: number,
  h: number,
) {
  if (photos.length <= 1) return
  const extras = photos.slice(1, 5)
  const gap = 6
  const pad = 28
  const thumbW = (W - pad * 2 - gap * (extras.length - 1)) / extras.length
  extras.forEach((img, i) => {
    const tx = pad + i * (thumbW + gap)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    roundRect(ctx, tx - 2, y - 2, thumbW + 4, h + 4, 6)
    ctx.fill()
    ctx.save()
    roundRect(ctx, tx, y, thumbW, h, 4)
    ctx.clip()
    drawCoverImage(ctx, img, tx, y, thumbW, h)
    ctx.restore()
  })
}

// ─── Elementos visuais ───────────────────────────────────────────────────────

function drawTopBranding(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  site: SiteConfig,
  property: Property,
  palette: Palette,
  customization: BannerCustomization,
) {
  const pad = 24
  const logoH = 52
  const logoW = logo ? (logo.width / logo.height) * logoH : (site.shortName || site.name).length * 13
  const boxW = logoW + 32
  const boxH = logoH + 20

  const logoX = customization.logoPosition === 'top-left' ? pad : W - pad - boxW
  const logoY = pad

  ctx.fillStyle = 'rgba(255,255,255,0.97)'
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 16
  ctx.shadowOffsetY = 4
  roundRect(ctx, logoX, logoY, boxW, boxH, 12)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  if (logo) {
    ctx.drawImage(logo, logoX + 16, logoY + 10, logoW, logoH)
  } else {
    ctx.fillStyle = '#1e3a8a'
    ctx.font = 'bold 22px Inter, Arial, sans-serif'
    ctx.fillText(site.shortName || site.name, logoX + 16, logoY + 38)
  }

  const typeText = property.type.toUpperCase()
  const typeBg = property.type === 'Venda' ? palette.saleBadge : palette.rentBadge
  ctx.font = 'bold 19px Inter, Arial, sans-serif'
  const padX = 18
  const tw = ctx.measureText(typeText).width
  const bw = tw + padX * 2
  const bh = 42
  const bx = customization.typePosition === 'top-left' ? pad : W - pad - bw
  const by = pad

  ctx.fillStyle = typeBg
  roundRect(ctx, bx, by, bw, bh, 10)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.fillText(typeText, bx + padX, by + bh / 2)
  ctx.textBaseline = 'alphabetic'

  const highlight = getHighlightLabel(property)
  if (highlight) {
    const label = highlight.toUpperCase()
    const promoCorner: BannerCorner =
      customization.typePosition === 'top-right' ? 'top-left' : 'top-right'
    ctx.font = 'bold 16px Inter, Arial, sans-serif'
    const ptw = ctx.measureText(label).width
    const pbw = ptw + 28
    const pbh = 32
    const pbx = promoCorner === 'top-left' ? pad : W - pad - pbw
    const pby = pad + boxH + 10
    ctx.fillStyle = palette.promoBadge
    roundRect(ctx, pbx, pby, pbw, pbh, 8)
    ctx.fill()
    ctx.fillStyle = palette.promoText
    ctx.textBaseline = 'middle'
    ctx.fillText(label, pbx + 14, pby + pbh / 2)
    ctx.textBaseline = 'alphabetic'
  }
}

function drawDescription(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  maxW: number,
  color: string,
  maxLines: number,
  fontSize = 17,
  lineHeight = 26,
): number {
  const desc = getCleanDescription(property)
  ctx.fillStyle = color
  ctx.font = `${fontSize}px Inter, Arial, sans-serif`
  const lines = wrapText(ctx, desc, maxW).slice(0, maxLines)
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight)
  })
  return lines.length * lineHeight
}

function drawBulletsRow(
  ctx: CanvasRenderingContext2D,
  bullets: string[],
  x: number,
  y: number,
  maxW: number,
  palette: Palette,
): number {
  if (bullets.length === 0) return 0
  const gap = 8
  let cx = x
  let cy = y
  const maxH = 30

  ctx.font = '600 15px Inter, Arial, sans-serif'
  bullets.forEach((bullet) => {
    const text = bullet.length > 22 ? `${bullet.slice(0, 20)}…` : bullet
    const tw = ctx.measureText(text).width + 20
    if (cx + tw > x + maxW && cx > x) {
      cx = x
      cy += maxH + gap
    }
    ctx.fillStyle = palette.chipBg
    roundRect(ctx, cx, cy, tw, maxH, 15)
    ctx.fill()
    ctx.fillStyle = palette.chipText
    ctx.textBaseline = 'middle'
    ctx.fillText(text, cx + 10, cy + maxH / 2)
    ctx.textBaseline = 'alphabetic'
    cx += tw + gap
  })

  return cy + maxH - y
}

function drawPriceBlock(
  ctx: CanvasRenderingContext2D,
  property: Property,
  palette: Palette,
  x: number,
  y: number,
  w: number,
  compact = false,
): number {
  const blockH = compact ? (hasPriceDrop(property) ? 96 : 76) : hasPriceDrop(property) ? 110 : 86
  const grad = ctx.createLinearGradient(x, y, x + w, y + blockH)
  grad.addColorStop(0, palette.priceGradientStart)
  grad.addColorStop(1, palette.priceGradientEnd)

  ctx.fillStyle = grad
  roundRect(ctx, x, y, w, blockH, compact ? 12 : 14)
  ctx.fill()

  const innerX = x + (compact ? 16 : 20)
  let labelY = y + (compact ? 22 : 26)

  if (hasPriceDrop(property)) {
    const oldPrice = formatPropertyPrice(property.previousPriceValue!, property.type)
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.font = '15px Inter, Arial, sans-serif'
    ctx.fillText(`De ${oldPrice}`, innerX, labelY)
    const ow = ctx.measureText(`De ${oldPrice}`).width
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(innerX, labelY - 4)
    ctx.lineTo(innerX + ow, labelY - 4)
    ctx.stroke()
    labelY += 18
  }

  ctx.fillStyle = palette.priceText
  ctx.font = '600 14px Inter, Arial, sans-serif'
  ctx.fillText(property.type === 'Venda' ? 'Investimento' : 'Valor mensal', innerX, labelY)

  ctx.font = `bold ${compact ? 34 : 38}px Inter, Arial, sans-serif`
  ctx.fillText(property.price, innerX, y + blockH - (compact ? 14 : 16))

  return blockH
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  site: SiteConfig,
  palette: Palette,
  x: number,
  y: number,
  light = true,
) {
  const phone = site.phones[0] ?? ''
  ctx.fillStyle = light ? palette.titleColor : palette.mutedColor
  ctx.font = 'bold 17px Inter, Arial, sans-serif'
  ctx.fillText(`${site.shortName || site.name}  •  CRECI ${site.creci}`, x, y)
  if (phone) {
    ctx.fillStyle = palette.accentColor
    ctx.font = 'bold 17px Inter, Arial, sans-serif'
    ctx.fillText(phone, x, y + 22)
  }
}

type SpecIconKind = 'bed' | 'bath' | 'area' | 'car'

function drawSpecIcon(
  ctx: CanvasRenderingContext2D,
  kind: SpecIconKind,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (kind) {
    case 'bed':
      ctx.strokeRect(x + 1, y + size * 0.42, size - 2, size * 0.32)
      ctx.beginPath()
      ctx.moveTo(x + 1, y + size * 0.42)
      ctx.lineTo(x + 1, y + size * 0.22)
      ctx.lineTo(x + size * 0.32, y + size * 0.22)
      ctx.lineTo(x + size * 0.32, y + size * 0.42)
      ctx.stroke()
      break
    case 'bath':
      ctx.beginPath()
      ctx.ellipse(x + size / 2, y + size * 0.58, size * 0.34, size * 0.22, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + size * 0.28, y + size * 0.35)
      ctx.lineTo(x + size * 0.72, y + size * 0.35)
      ctx.stroke()
      break
    case 'area':
      ctx.strokeRect(x + size * 0.18, y + size * 0.18, size * 0.64, size * 0.64)
      ctx.beginPath()
      ctx.moveTo(x + size * 0.28, y + size * 0.72)
      ctx.lineTo(x + size * 0.72, y + size * 0.28)
      ctx.stroke()
      break
    case 'car':
      ctx.beginPath()
      ctx.moveTo(x + size * 0.12, y + size * 0.62)
      ctx.lineTo(x + size * 0.24, y + size * 0.38)
      ctx.lineTo(x + size * 0.76, y + size * 0.38)
      ctx.lineTo(x + size * 0.88, y + size * 0.62)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x + size * 0.28, y + size * 0.66, size * 0.09, 0, Math.PI * 2)
      ctx.arc(x + size * 0.72, y + size * 0.66, size * 0.09, 0, Math.PI * 2)
      ctx.fill()
      break
  }

  ctx.restore()
}

function drawPhoneIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  roundRect(ctx, x, y, 14, 22, 3)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + 4, y + 18)
  ctx.lineTo(x + 10, y + 18)
  ctx.stroke()
  ctx.restore()
}

function drawSpecIconsRow(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  w: number,
  palette: Palette,
): number {
  const items: Array<{ kind: SpecIconKind; value: string; label: string }> = []
  if (property.bedrooms > 0) {
    items.push({ kind: 'bed', value: String(property.bedrooms), label: 'quartos' })
  }
  items.push({ kind: 'bath', value: String(property.bathrooms), label: 'banh.' })
  items.push({ kind: 'area', value: String(property.area), label: 'm²' })
  if (property.parking > 0) {
    items.push({ kind: 'car', value: String(property.parking), label: 'vagas' })
  }

  const gap = 10
  const boxH = 62
  const boxW = (w - gap * (items.length - 1)) / items.length

  items.forEach((item, i) => {
    const bx = x + i * (boxW + gap)
    ctx.fillStyle = palette.chipBg
    roundRect(ctx, bx, y, boxW, boxH, 12)
    ctx.fill()
    drawSpecIcon(ctx, item.kind, bx + 14, y + 14, 28, palette.accentColor)
    ctx.fillStyle = palette.titleColor
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillText(item.value, bx + 48, y + 30)
    ctx.fillStyle = palette.mutedColor
    ctx.font = '13px Inter, Arial, sans-serif'
    ctx.fillText(item.label, bx + 48, y + 48)
  })

  return boxH
}

function drawClassicContactBar(
  ctx: CanvasRenderingContext2D,
  site: SiteConfig,
  palette: Palette,
  y: number,
  h: number,
) {
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  ctx.fillRect(0, y, W, h)

  const pad = 36
  const midY = y + h / 2
  const phone = site.phones[0] ?? ''

  ctx.textBaseline = 'middle'
  ctx.fillStyle = palette.titleColor
  ctx.font = 'bold 16px Inter, Arial, sans-serif'
  ctx.fillText(`${site.shortName || site.name}  •  CRECI ${site.creci}`, pad, midY)

  if (phone) {
    ctx.font = 'bold 18px Inter, Arial, sans-serif'
    const phoneW = ctx.measureText(phone).width
    const phoneX = W - pad - phoneW
    drawPhoneIcon(ctx, phoneX - 22, midY - 11, palette.accentColor)
    ctx.fillStyle = palette.accentColor
    ctx.fillText(phone, phoneX, midY)
  }

  ctx.textBaseline = 'alphabetic'
}

// ─── 5 layouts distintos ─────────────────────────────────────────────────────

/** DESTAQUE: fotos amplas + ícones + barra de contato integrada */
async function renderClassic(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const contactBarH = 76
  const photoH = Math.round(H * 0.62)
  const panelY = photoH
  const panelH = H - panelY
  const contentBottom = H - contactBarH
  const p = input.palette
  const pad = 36

  drawClassicPhotoLayout(ctx, input.photos, 0, 0, W, photoH)

  ctx.fillStyle = p.panelBg
  ctx.fillRect(0, panelY, W, panelH)

  const fadeH = 32
  const grad = ctx.createLinearGradient(0, panelY - fadeH, 0, panelY + 6)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, p.panelBg)
  ctx.fillStyle = grad
  ctx.fillRect(0, panelY - fadeH, W, fadeH + 6)

  drawTopBranding(ctx, input.logo, input.site, input.property, p, input.customization)

  const priceW = 252
  const gutter = 24
  const textW = W - pad * 2 - priceW - gutter
  const priceX = W - pad - priceW
  let cy = panelY + 32

  ctx.fillStyle = p.titleColor
  ctx.font = 'bold 31px Inter, Arial, sans-serif'
  wrapText(ctx, input.property.title, textW)
    .slice(0, 1)
    .forEach((line) => {
      ctx.fillText(line, pad, cy)
      cy += 36
    })

  cy += 8
  ctx.fillStyle = p.mutedColor
  ctx.font = '17px Inter, Arial, sans-serif'
  ctx.fillText(`${input.property.location} • ${input.property.city}`, pad, cy)
  cy += 30

  const descH = drawDescription(ctx, input.property, pad, cy, W - pad * 2, p.textColor, 2, 16, 24)
  cy += descH + 20

  const iconsH = drawSpecIconsRow(ctx, input.property, pad, cy, W - pad * 2, p)
  cy += iconsH + 18

  const highlights = getFeatureHighlights(input.property, 3)
  if (highlights.length > 0 && cy < contentBottom - 50) {
    const bulletsH = drawBulletsRow(ctx, highlights, pad, cy, W - pad * 2, p)
    cy += bulletsH + 8
  }

  drawPriceBlock(ctx, input.property, p, priceX, panelY + 32, priceW, true)
  drawClassicContactBar(ctx, input.site, p, contentBottom, contactBarH)
}

/** EDITORIAL: foto grande à esquerda (62%), painel texto à direita */
async function renderModern(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const split = Math.round(W * 0.62)
  drawSingleHero(ctx, input.photos, 0, 0, split, H)

  if (input.photos.length > 1) {
    drawBottomFilmstrip(ctx, input.photos, H - 100, 72)
  }

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const panelX = split
  const panelW = W - split
  const p = input.palette

  ctx.fillStyle = p.panelBg
  ctx.fillRect(panelX, 0, panelW, H)

  ctx.fillStyle = p.accentColor
  ctx.fillRect(panelX, 0, 5, H)

  const pad = 28
  const innerW = panelW - pad * 2
  let cy = 100

  ctx.fillStyle = p.titleColor
  ctx.font = 'bold 30px Inter, Arial, sans-serif'
  wrapText(ctx, input.property.title, innerW)
    .slice(0, 2)
    .forEach((line) => {
      ctx.fillText(line, panelX + pad, cy)
      cy += 36
    })

  cy += 4
  ctx.fillStyle = p.mutedColor
  ctx.font = '17px Inter, Arial, sans-serif'
  ctx.fillText(`${input.property.location} • ${input.property.city}`, panelX + pad, cy)
  cy += 30

  ctx.fillStyle = p.accentColor
  ctx.font = 'bold 13px Inter, Arial, sans-serif'
  ctx.fillText('SOBRE O IMÓVEL', panelX + pad, cy)
  cy += 22

  const descH = drawDescription(ctx, input.property, panelX + pad, cy, innerW, p.textColor, 5, 15, 23)
  cy += descH + 16

  const bulletsH = drawBulletsRow(ctx, getBulletPoints(input.property), panelX + pad, cy, innerW, p)
  cy += bulletsH + 16

  ctx.fillStyle = p.mutedColor
  ctx.font = '14px Inter, Arial, sans-serif'
  ctx.fillText(getSpecsLine(input.property), panelX + pad, cy)
  cy += 28

  drawPriceBlock(ctx, input.property, p, panelX + pad, cy, innerW)
  cy += 100

  drawFooter(ctx, input.site, p, panelX + pad, cy)
}

/** CINEMATOGRÁFICO: foto full bleed + overlay gradiente + texto */
async function renderBold(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawSingleHero(ctx, input.photos, 0, 0, W, H)

  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0.15)')
  grad.addColorStop(0.4, 'rgba(0,0,0,0.05)')
  grad.addColorStop(0.55, 'rgba(0,0,0,0.45)')
  grad.addColorStop(1, input.palette.panelBgSoft)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  if (input.photos.length > 1) {
    drawBottomFilmstrip(ctx, input.photos, H - 88, 60)
  }

  const p = input.palette
  const pad = 40
  const contentY = H * 0.52
  let cy = contentY

  ctx.fillStyle = p.titleColor
  ctx.font = 'bold 40px Inter, Arial, sans-serif'
  wrapText(ctx, input.property.title, W - pad * 2)
    .slice(0, 2)
    .forEach((line) => {
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 8
      ctx.fillText(line, pad, cy)
      cy += 46
    })
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  cy += 4
  ctx.fillStyle = p.mutedColor
  ctx.font = '19px Inter, Arial, sans-serif'
  ctx.fillText(`${input.property.location} • ${input.property.city}`, pad, cy)
  cy += 32

  const descH = drawDescription(ctx, input.property, pad, cy, W - pad * 2, p.textColor, 4, 17, 26)
  cy += descH + 14

  drawBulletsRow(ctx, getBulletPoints(input.property), pad, cy, W - pad * 2, p)

  const priceW = 300
  drawPriceBlock(ctx, input.property, p, W - pad - priceW, contentY, priceW, true)

  ctx.fillStyle = p.mutedColor
  ctx.font = '15px Inter, Arial, sans-serif'
  ctx.fillText(getSpecsLine(input.property), pad, H - 110)

  drawFooter(ctx, input.site, p, pad, H - 72)
}

/** GALERIA: duas fotos grandes + duas colunas de texto */
async function renderMinimal(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const photoH = H * 0.58
  drawDualHero(ctx, input.photos, 0, 0, W, photoH)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const panelY = photoH
  const panelH = H - photoH
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, panelY, W, panelH)

  ctx.fillStyle = input.palette.accentColor
  ctx.fillRect(0, panelY, W, 4)

  const pad = 36
  const colW = (W - pad * 2 - 24) / 2
  const leftX = pad
  const rightX = pad + colW + 24
  let cy = panelY + 32

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 32px Inter, Arial, sans-serif'
  wrapText(ctx, input.property.title, W - pad * 2)
    .slice(0, 1)
    .forEach((line) => {
      ctx.fillText(line, leftX, cy)
    })
  cy += 38

  ctx.fillStyle = '#6b7280'
  ctx.font = '17px Inter, Arial, sans-serif'
  ctx.fillText(`${input.property.location} • ${input.property.city}`, leftX, cy)
  cy += 28

  const lightPalette: Palette = {
    ...input.palette,
    textColor: '#374151',
    chipBg: 'rgba(30,64,175,0.08)',
    chipText: '#1e40af',
  }

  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 12px Inter, Arial, sans-serif'
  ctx.fillText('DESCRIÇÃO', leftX, cy)
  cy += 20

  drawDescription(ctx, input.property, leftX, cy, colW, '#4b5563', 4, 15, 22)
  drawBulletsRow(ctx, getBulletPoints(input.property), leftX, cy + 100, colW, lightPalette)

  const priceY = panelY + 32
  drawPriceBlock(ctx, input.property, input.palette, rightX, priceY, colW)

  ctx.fillStyle = '#6b7280'
  ctx.font = '14px Inter, Arial, sans-serif'
  ctx.fillText(getSpecsLine(input.property), rightX, priceY + 100)

  drawFooter(
    ctx,
    input.site,
    { ...input.palette, titleColor: '#111827', accentColor: '#1e40af' },
    rightX,
    panelY + panelH - 50,
    false,
  )
}

/** MOSAICO PREMIUM: composição assimétrica + cartão flutuante */
async function renderCollage(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawAsymmetricMosaic(ctx, input.photos, 0, 0, W, H * 0.7)

  const grad = ctx.createLinearGradient(0, H * 0.35, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.6, 'rgba(0,0,0,0.35)')
  grad.addColorStop(1, 'rgba(0,0,0,0.65)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const p = input.palette
  const cardPad = 32
  const cardH = H * 0.42
  const cardY = H - cardH - cardPad
  const cardW = W - cardPad * 2

  ctx.fillStyle = p.panelBg
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 8
  roundRect(ctx, cardPad, cardY, cardW, cardH, 20)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  const pad = 36
  const innerW = cardW - pad * 2
  let cy = cardY + pad

  ctx.fillStyle = p.titleColor
  ctx.font = 'bold 32px Inter, Arial, sans-serif'
  wrapText(ctx, input.property.title, innerW - 270)
    .slice(0, 1)
    .forEach((line) => {
      ctx.fillText(line, cardPad + pad, cy)
      cy += 38
    })

  ctx.fillStyle = p.mutedColor
  ctx.font = '17px Inter, Arial, sans-serif'
  ctx.fillText(`${input.property.location} • ${input.property.city}`, cardPad + pad, cy)
  cy += 26

  const descH = drawDescription(
    ctx,
    input.property,
    cardPad + pad,
    cy,
    innerW - 280,
    p.textColor,
    3,
    15,
    22,
  )
  cy += descH + 10

  drawBulletsRow(ctx, getBulletPoints(input.property), cardPad + pad, cy, innerW - 280, p)

  const priceX = cardPad + cardW - pad - 250
  drawPriceBlock(ctx, input.property, p, priceX, cardY + pad, 250, true)

  ctx.fillStyle = p.mutedColor
  ctx.font = '14px Inter, Arial, sans-serif'
  ctx.fillText(getSpecsLine(input.property), cardPad + pad, cardY + cardH - pad - 10)

  drawFooter(ctx, input.site, p, cardPad + pad, cardY + cardH - pad + 8)
}

const RENDERERS: Record<BannerTemplateId, (ctx: CanvasRenderingContext2D, input: RenderContext) => Promise<void>> = {
  classic: renderClassic,
  modern: renderModern,
  bold: renderBold,
  minimal: renderMinimal,
  collage: renderCollage,
}

export interface BannerInput {
  photos: string[]
  property: Property
  site: SiteConfig
  templateId: BannerTemplateId
  customization?: BannerCustomization
}

export async function generateBannerBlob(input: BannerInput): Promise<Blob> {
  const selectedPhotos = input.photos.slice(0, MAX_BANNER_PHOTOS)
  if (selectedPhotos.length === 0) {
    throw new Error('Selecione pelo menos uma foto.')
  }

  const customization = input.customization ?? DEFAULT_BANNER_CUSTOMIZATION
  const palette = PALETTES[customization.paletteId] ?? PALETTES.sapphire

  const [images, logo] = await Promise.all([
    Promise.all(selectedPhotos.map(loadImage)),
    loadLogo(input.site),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não suportado neste navegador.')

  await RENDERERS[input.templateId](ctx, {
    photos: images,
    property: input.property,
    site: input.site,
    logo,
    palette,
    customization,
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Falha ao gerar imagem do banner.'))
      },
      'image/png',
      1,
    )
  })
}

export function downloadBanner(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
