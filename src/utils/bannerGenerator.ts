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
  { id: 'classic', name: 'Clássico', description: 'Mosaico de fotos + painel elegante com destaques' },
  { id: 'modern', name: 'Moderno', description: 'Fotos à esquerda, informações organizadas à direita' },
  { id: 'bold', name: 'Impacto', description: 'Fotos em tela cheia com sobreposição sofisticada' },
  { id: 'minimal', name: 'Elegante', description: 'Moldura clara com layout limpo e premium' },
  { id: 'collage', name: 'Colagem', description: 'Máximo de fotos com cartão de informações flutuante' },
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
    description: 'Azul profundo com detalhes dourados — transmite confiança',
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    swatch: ['#064e3b', '#34d399', '#a7f3d0'],
    description: 'Verde sofisticado — sensação de oportunidade e crescimento',
  },
  {
    id: 'gold',
    name: 'Ouro Premium',
    swatch: ['#1c1917', '#fbbf24', '#fef3c7'],
    description: 'Tom escuro com ouro — imóvel de alto padrão',
  },
  {
    id: 'slate',
    name: 'Grafite',
    swatch: ['#1f2937', '#e5e7eb', '#93c5fd'],
    description: 'Neutro elegante com azul suave — atemporal',
  },
  {
    id: 'ocean',
    name: 'Oceano',
    swatch: ['#0c4a6e', '#22d3ee', '#bae6fd'],
    description: 'Azul claro e fresco — convida à visita',
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
    panelBgSoft: 'rgba(15,23,42,0.92)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.92)',
    mutedColor: 'rgba(255,255,255,0.72)',
    accentColor: '#38bdf8',
    priceGradientStart: '#fbbf24',
    priceGradientEnd: '#f59e0b',
    priceText: '#1c1917',
    chipBg: 'rgba(56,189,248,0.18)',
    chipText: '#e0f2fe',
    saleBadge: '#1e40af',
    rentBadge: '#0e7490',
    promoBadge: '#fbbf24',
    promoText: '#1c1917',
  },
  emerald: {
    panelBg: '#064e3b',
    panelBgSoft: 'rgba(6,78,59,0.93)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.93)',
    mutedColor: 'rgba(255,255,255,0.75)',
    accentColor: '#34d399',
    priceGradientStart: '#6ee7b7',
    priceGradientEnd: '#34d399',
    priceText: '#064e3b',
    chipBg: 'rgba(52,211,153,0.2)',
    chipText: '#d1fae5',
    saleBadge: '#047857',
    rentBadge: '#0d9488',
    promoBadge: '#fde68a',
    promoText: '#064e3b',
  },
  gold: {
    panelBg: '#1c1917',
    panelBgSoft: 'rgba(28,25,23,0.94)',
    titleColor: '#fef3c7',
    textColor: 'rgba(254,243,199,0.9)',
    mutedColor: 'rgba(254,243,199,0.65)',
    accentColor: '#fbbf24',
    priceGradientStart: '#fde68a',
    priceGradientEnd: '#fbbf24',
    priceText: '#1c1917',
    chipBg: 'rgba(251,191,36,0.15)',
    chipText: '#fef3c7',
    saleBadge: '#78350f',
    rentBadge: '#57534e',
    promoBadge: '#fbbf24',
    promoText: '#1c1917',
  },
  slate: {
    panelBg: '#1f2937',
    panelBgSoft: 'rgba(31,41,55,0.93)',
    titleColor: '#f9fafb',
    textColor: 'rgba(249,250,251,0.92)',
    mutedColor: 'rgba(209,213,219,0.8)',
    accentColor: '#93c5fd',
    priceGradientStart: '#dbeafe',
    priceGradientEnd: '#93c5fd',
    priceText: '#1e3a8a',
    chipBg: 'rgba(147,197,253,0.15)',
    chipText: '#eff6ff',
    saleBadge: '#374151',
    rentBadge: '#4b5563',
    promoBadge: '#fde68a',
    promoText: '#1f2937',
  },
  ocean: {
    panelBg: '#0c4a6e',
    panelBgSoft: 'rgba(12,74,110,0.93)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.93)',
    mutedColor: 'rgba(186,230,253,0.85)',
    accentColor: '#22d3ee',
    priceGradientStart: '#a5f3fc',
    priceGradientEnd: '#22d3ee',
    priceText: '#0c4a6e',
    chipBg: 'rgba(34,211,238,0.18)',
    chipText: '#ecfeff',
    saleBadge: '#0369a1',
    rentBadge: '#0891b2',
    promoBadge: '#fef08a',
    promoText: '#0c4a6e',
  },
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Não foi possível processar uma das fotos.'))
    img.src = src
  })
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return loadImageElement(url)
  }
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

function extractFeatures(property: Property): string[] {
  const fromDesc = (property.description || '')
    .split(/[✔✓•\n|]/)
    .map((s) => s.replace(/^[🏡\s]+/, '').trim())
    .filter((s) => s.length > 2 && s.length < 42)

  if (fromDesc.length >= 2) return fromDesc.slice(0, 6)

  const specs: string[] = []
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} quartos`)
  if (property.bathrooms > 0) specs.push(`${property.bathrooms} banheiros`)
  if (property.area > 0) specs.push(`${property.area} m²`)
  if (property.parking > 0) specs.push(`${property.parking} vagas`)
  if (property.category) specs.push(property.category)
  return specs.slice(0, 6)
}

function drawPhotoGrid(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = 5
  const n = Math.min(photos.length, MAX_BANNER_PHOTOS)
  if (n === 0) return

  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()

  if (n === 1) {
    drawCoverImage(ctx, photos[0], x, y, w, h)
    ctx.restore()
    return
  }

  if (n === 2) {
    const half = (w - gap) / 2
    drawCoverImage(ctx, photos[0], x, y, half, h)
    drawCoverImage(ctx, photos[1], x + half + gap, y, half, h)
    ctx.restore()
    return
  }

  if (n === 3) {
    const mainW = w * 0.62 - gap / 2
    drawCoverImage(ctx, photos[0], x, y, mainW, h)
    const sideW = w - mainW - gap
    const halfH = (h - gap) / 2
    drawCoverImage(ctx, photos[1], x + mainW + gap, y, sideW, halfH)
    drawCoverImage(ctx, photos[2], x + mainW + gap, y + halfH + gap, sideW, halfH)
    ctx.restore()
    return
  }

  if (n === 4) {
    const cw = (w - gap) / 2
    const ch = (h - gap) / 2
    drawCoverImage(ctx, photos[0], x, y, cw, ch)
    drawCoverImage(ctx, photos[1], x + cw + gap, y, cw, ch)
    drawCoverImage(ctx, photos[2], x, y + ch + gap, cw, ch)
    drawCoverImage(ctx, photos[3], x + cw + gap, y + ch + gap, cw, ch)
    ctx.restore()
    return
  }

  const row1H = h * 0.58 - gap / 2
  const row2H = h - row1H - gap
  const w3 = (w - gap * 2) / 3
  drawCoverImage(ctx, photos[0], x, y, w3, row1H)
  drawCoverImage(ctx, photos[1], x + w3 + gap, y, w3, row1H)
  drawCoverImage(ctx, photos[2], x + (w3 + gap) * 2, y, w3, row1H)
  const w2 = (w - gap) / 2
  drawCoverImage(ctx, photos[3], x, y + row1H + gap, w2, row2H)
  drawCoverImage(ctx, photos[4], x + w2 + gap, y + row1H + gap, w2, row2H)
  ctx.restore()
}

function measureLogo(logo: HTMLImageElement | null, site: SiteConfig, maxH: number) {
  if (logo) {
    const h = maxH
    const w = (logo.width / logo.height) * h
    return { w, h }
  }
  const name = site.shortName || site.name
  return { w: name.length * 14, h: maxH }
}

function drawLogoInBox(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  site: SiteConfig,
  x: number,
  y: number,
  maxH: number,
  textColor: string,
) {
  if (logo) {
    const h = maxH
    const w = (logo.width / logo.height) * h
    ctx.drawImage(logo, x, y, w, h)
    return w
  }
  ctx.fillStyle = textColor
  ctx.font = 'bold 24px Inter, Arial, sans-serif'
  const name = site.shortName || site.name
  ctx.fillText(name, x, y + maxH * 0.78)
  return ctx.measureText(name).width
}

function drawCornerBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  corner: BannerCorner,
  bg: string,
  color: string,
  pad = 28,
) {
  ctx.font = 'bold 20px Inter, Arial, sans-serif'
  const padX = 20
  const tw = ctx.measureText(text).width
  const bw = tw + padX * 2
  const bh = 40
  const x = corner === 'top-left' ? pad : W - pad - bw
  const y = pad

  ctx.fillStyle = bg
  roundRect(ctx, x, y, bw, bh, 10)
  ctx.fill()
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + padX, y + bh / 2)
  ctx.textBaseline = 'alphabetic'
}

function drawTopBranding(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  site: SiteConfig,
  property: Property,
  palette: Palette,
  customization: BannerCustomization,
) {
  const pad = 28
  const logoH = 48
  const { w: logoW } = measureLogo(logo, site, logoH)
  const logoPadX = 16
  const logoPadY = 10
  const boxW = logoW + logoPadX * 2
  const boxH = logoH + logoPadY * 2

  const logoX = customization.logoPosition === 'top-left' ? pad : W - pad - boxW
  const logoY = pad

  ctx.fillStyle = 'rgba(255,255,255,0.96)'
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetY = 4
  roundRect(ctx, logoX, logoY, boxW, boxH, 12)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  drawLogoInBox(ctx, logo, site, logoX + logoPadX, logoY + logoPadY, logoH, '#1e3a8a')

  const typeText = property.type.toUpperCase()
  const typeBg = property.type === 'Venda' ? palette.saleBadge : palette.rentBadge
  drawCornerBadge(ctx, typeText, customization.typePosition, typeBg, '#ffffff', pad)

  const highlight = getHighlightLabel(property)
  if (highlight) {
    const label = highlight.toUpperCase()
    const promoCorner: BannerCorner =
      customization.typePosition === 'top-right' ? 'top-left' : 'top-right'
    const offsetY = boxH + 14
    ctx.font = 'bold 18px Inter, Arial, sans-serif'
    const padX = 16
    const tw = ctx.measureText(label).width
    const bw = tw + padX * 2
    const bh = 34
    const bx =
      promoCorner === 'top-left'
        ? pad
        : W - pad - bw
    const by = pad + offsetY
    ctx.fillStyle = palette.promoBadge
    roundRect(ctx, bx, by, bw, bh, 8)
    ctx.fill()
    ctx.fillStyle = palette.promoText
    ctx.textBaseline = 'middle'
    ctx.fillText(label, bx + padX, by + bh / 2)
    ctx.textBaseline = 'alphabetic'
  }
}

function drawFeatureChips(
  ctx: CanvasRenderingContext2D,
  features: string[],
  x: number,
  y: number,
  w: number,
  palette: Palette,
): number {
  const chipH = 34
  const gap = 8
  const colW = (w - gap) / 2
  let maxY = y

  features.forEach((feat, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx = x + col * (colW + gap)
    const cy = y + row * (chipH + gap)

    ctx.font = '600 16px Inter, Arial, sans-serif'
    ctx.fillStyle = palette.chipBg
    roundRect(ctx, cx, cy, colW, chipH, 8)
    ctx.fill()
    ctx.fillStyle = palette.chipText
    ctx.textBaseline = 'middle'
    const display = feat.length > 28 ? `${feat.slice(0, 26)}…` : feat
    ctx.fillText(display, cx + 12, cy + chipH / 2)
    ctx.textBaseline = 'alphabetic'
    maxY = Math.max(maxY, cy + chipH)
  })

  return maxY - y + (features.length > 0 ? 0 : 0)
}

function drawPriceBlock(
  ctx: CanvasRenderingContext2D,
  property: Property,
  palette: Palette,
  x: number,
  y: number,
  w: number,
): number {
  const blockH = hasPriceDrop(property) ? 118 : 88
  const grad = ctx.createLinearGradient(x, y, x + w, y + blockH)
  grad.addColorStop(0, palette.priceGradientStart)
  grad.addColorStop(1, palette.priceGradientEnd)

  ctx.fillStyle = grad
  roundRect(ctx, x, y, w, blockH, 14)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1
  roundRect(ctx, x, y, w, blockH, 14)
  ctx.stroke()

  const innerX = x + 22
  let innerY = y + 28

  if (hasPriceDrop(property)) {
    const oldPrice = formatPropertyPrice(property.previousPriceValue!, property.type)
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.font = '18px Inter, Arial, sans-serif'
    const oldText = `Antes: ${oldPrice}`
    ctx.fillText(oldText, innerX, innerY)
    const oldW = ctx.measureText(oldText).width
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(innerX, innerY - 5)
    ctx.lineTo(innerX + oldW, innerY - 5)
    ctx.stroke()
    innerY += 22
    ctx.fillStyle = palette.priceText
    ctx.font = 'bold 16px Inter, Arial, sans-serif'
    ctx.fillText('Valor especial', innerX, innerY)
    innerY += 10
  } else {
    ctx.fillStyle = palette.priceText
    ctx.font = '600 16px Inter, Arial, sans-serif'
    ctx.fillText(property.type === 'Venda' ? 'Investimento' : 'Valor mensal', innerX, innerY - 4)
  }

  ctx.fillStyle = palette.priceText
  ctx.font = 'bold 42px Inter, Arial, sans-serif'
  ctx.fillText(property.price, innerX, y + blockH - 22)

  return blockH
}

function drawInfoPanel(
  ctx: CanvasRenderingContext2D,
  property: Property,
  site: SiteConfig,
  palette: Palette,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const grad = ctx.createLinearGradient(x, y - 80, x, y + h)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.15, palette.panelBgSoft)
  grad.addColorStop(1, palette.panelBg)
  ctx.fillStyle = grad
  ctx.fillRect(x, y - 40, w, h + 40)

  ctx.fillStyle = palette.panelBg
  ctx.fillRect(x, y + h * 0.08, w, h * 0.92)

  const pad = 36
  const innerW = w - pad * 2
  let cursorY = y + pad

  ctx.fillStyle = palette.titleColor
  ctx.font = 'bold 36px Inter, Arial, sans-serif'
  const titleLines = wrapText(ctx, property.title, innerW)
  titleLines.slice(0, 2).forEach((line) => {
    ctx.fillText(line, x + pad, cursorY)
    cursorY += 42
  })

  cursorY += 4
  ctx.fillStyle = palette.mutedColor
  ctx.font = '20px Inter, Arial, sans-serif'
  ctx.fillText(`${property.location} • ${property.city}`, x + pad, cursorY)
  cursorY += 32

  const features = extractFeatures(property)
  if (features.length > 0) {
    const chipsH = drawFeatureChips(ctx, features, x + pad, cursorY, innerW, palette)
    cursorY += chipsH + 20
  }

  const priceH = drawPriceBlock(ctx, property, palette, x + pad, cursorY, innerW)
  cursorY += priceH + 16

  const specs: string[] = []
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} quartos`)
  specs.push(`${property.bathrooms} banh.`)
  specs.push(`${property.area}m²`)
  if (property.parking > 0) specs.push(`${property.parking} vagas`)

  ctx.fillStyle = palette.mutedColor
  ctx.font = '17px Inter, Arial, sans-serif'
  ctx.fillText(specs.join('   •   '), x + pad, cursorY + 8)

  const footerY = y + h - pad
  ctx.fillStyle = palette.titleColor
  ctx.font = 'bold 19px Inter, Arial, sans-serif'
  const phone = site.phones[0] ?? ''
  ctx.fillText(`${site.shortName || site.name}  •  CRECI ${site.creci}`, x + pad, footerY - 14)
  if (phone) {
    ctx.fillStyle = palette.accentColor
    ctx.font = 'bold 18px Inter, Arial, sans-serif'
    ctx.fillText(phone, x + pad, footerY + 12)
  }
}

type RenderContext = {
  photos: HTMLImageElement[]
  property: Property
  site: SiteConfig
  logo: HTMLImageElement | null
  palette: Palette
  customization: BannerCustomization
}

async function renderClassic(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const photoH = H * 0.54
  drawPhotoGrid(ctx, input.photos, 0, 0, W, photoH)
  drawTopBranding(
    ctx,
    input.logo,
    input.site,
    input.property,
    input.palette,
    input.customization,
  )
  drawInfoPanel(ctx, input.property, input.site, input.palette, 0, photoH - 20, W, H - photoH + 20)
}

async function renderModern(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const split = W * 0.5
  drawPhotoGrid(ctx, input.photos, 0, 0, split - 4, H)
  ctx.fillStyle = input.palette.accentColor
  ctx.fillRect(split - 4, 0, 8, H)
  drawTopBranding(
    ctx,
    input.logo,
    input.site,
    input.property,
    input.palette,
    input.customization,
  )
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(split + 4, 0, W - split - 4, H)
  drawInfoPanel(
    ctx,
    input.property,
    input.site,
    {
      ...input.palette,
      panelBg: '#ffffff',
      panelBgSoft: 'rgba(255,255,255,0.98)',
      titleColor: '#111827',
      textColor: '#374151',
      mutedColor: '#6b7280',
      chipBg: 'rgba(30,64,175,0.08)',
      chipText: '#1e3a8a',
    },
    split + 4,
    80,
    W - split - 4,
    H - 80,
  )
}

async function renderBold(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawPhotoGrid(ctx, input.photos, 0, 0, W, H)
  const grad = ctx.createLinearGradient(0, H * 0.25, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.45, 'rgba(0,0,0,0.35)')
  grad.addColorStop(1, input.palette.panelBgSoft)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  drawTopBranding(
    ctx,
    input.logo,
    input.site,
    input.property,
    input.palette,
    input.customization,
  )
  drawInfoPanel(ctx, input.property, input.site, input.palette, 0, H * 0.38, W, H * 0.62)
}

async function renderMinimal(ctx: CanvasRenderingContext2D, input: RenderContext) {
  ctx.fillStyle = '#e5e7eb'
  ctx.fillRect(0, 0, W, H)
  const pad = 24
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 24)
  ctx.fill()
  const photoH = (H - pad * 2) * 0.5
  drawPhotoGrid(ctx, input.photos, pad + 12, pad + 12, W - pad * 2 - 24, photoH)
  drawTopBranding(
    ctx,
    input.logo,
    input.site,
    input.property,
    input.palette,
    input.customization,
  )
  drawInfoPanel(
    ctx,
    input.property,
    input.site,
    {
      ...input.palette,
      panelBg: '#f8fafc',
      panelBgSoft: 'rgba(248,250,252,0.98)',
      titleColor: '#111827',
      textColor: '#374151',
      mutedColor: '#6b7280',
      chipBg: 'rgba(30,64,175,0.07)',
      chipText: '#1e40af',
    },
    pad + 12,
    pad + 12 + photoH + 8,
    W - pad * 2 - 24,
    H - pad * 2 - photoH - 20,
  )
}

async function renderCollage(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawPhotoGrid(ctx, input.photos, 0, 0, W, H)
  const grad = ctx.createLinearGradient(0, H * 0.35, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.5, 'rgba(0,0,0,0.4)')
  grad.addColorStop(1, input.palette.panelBgSoft)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  drawTopBranding(
    ctx,
    input.logo,
    input.site,
    input.property,
    input.palette,
    input.customization,
  )
  const cardPad = 28
  const cardH = H * 0.46
  const cardY = H - cardH - cardPad
  ctx.fillStyle = input.palette.panelBg
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 24
  roundRect(ctx, cardPad, cardY, W - cardPad * 2, cardH, 20)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  drawInfoPanel(ctx, input.property, input.site, input.palette, cardPad, cardY, W - cardPad * 2, cardH)
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
