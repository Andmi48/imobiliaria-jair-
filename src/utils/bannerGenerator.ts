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
    description: 'Todas as fotos em destaque + painel legível + WhatsApp',
  },
  {
    id: 'modern',
    name: 'Editorial',
    description: 'Galeria à esquerda + informações organizadas à direita',
  },
  {
    id: 'bold',
    name: 'Cinematográfico',
    description: 'Composição de fotos com faixa inferior elegante',
  },
  {
    id: 'minimal',
    name: 'Galeria',
    description: 'Múltiplas fotos grandes + painel claro e objetivo',
  },
  {
    id: 'collage',
    name: 'Mosaico Premium',
    description: 'Mosaico com até 5 fotos + cartão inferior compacto',
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
const CONTACT_BAR_H = 88
const PHOTO_GAP = 8
const STRIP_H = 112
const PANEL_PAD = 32

/** Consultores — espelha o rodapé do site. */
const BROKERS = [
  { name: 'Jair A Costa', creci: '19738-F' },
  { name: 'André Tadeu da S. Costa', creci: '90092-F' },
] as const

const FONT = {
  title: 'bold 34px Inter, Arial, sans-serif',
  titleSm: 'bold 28px Inter, Arial, sans-serif',
  location: '500 18px Inter, Arial, sans-serif',
  specs: '600 18px Inter, Arial, sans-serif',
  feature: '500 17px Inter, Arial, sans-serif',
  priceLabel: '600 11px Inter, Arial, sans-serif',
  contactBroker: '600 14px Inter, Arial, sans-serif',
  contactCreci: '500 13px Inter, Arial, sans-serif',
  contactPhone: '500 14px Inter, Arial, sans-serif',
  badge: 'bold 16px Inter, Arial, sans-serif',
  logoFallback: 'bold 20px Inter, Arial, sans-serif',
}

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

function normalizeHighlight(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[📞💰📄✅]/g, '')
    .replace(/^e\s+/i, '')
    .replace(/[.;,:]+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function isMarketingHighlight(text: string): boolean {
  const lower = text.toLowerCase()
  return /agende|visita|financiamento|documentação|documentacao|aceita|venha|conhecer|whats|ligue|entre em contato|saiba mais|fale conosco|imperdível|imperdivel|não perca|nao perca/i.test(
    lower,
  )
}

function isGenericHighlight(text: string, property: Property): boolean {
  const lower = text.toLowerCase().trim()
  const titleLower = property.title.toLowerCase()
  const cityLower = property.city.toLowerCase()
  const locLower = property.location.toLowerCase()

  if (text.length < 4 || text.length > 52) return true
  if (lower === titleLower || lower === cityLower || lower === locLower) return true
  if (isMarketingHighlight(text)) return true
  if (/caracter[ií]sticas?\s+(do\s+)?im[oó]vel/i.test(lower)) return true
  if (/^terreno com \d+/i.test(lower) && property.area > 0) return true
  if (/^(são paulo|sao paulo|sp)$/i.test(lower)) return true
  if (lower === property.type.toLowerCase()) return true
  if (titleLower.includes(lower) && lower.length > 8) return true
  if (locLower.includes(lower) && text.length < 28) return true
  if (cityLower.includes(lower) && text.length < 20) return true
  if (/^(excelente|sobrado|imóvel|imovel|ideal|casa)\b/i.test(lower) && text.length < 32) return true
  if (/^\d+\s*(quarto|banh|m²|m2|vaga)/i.test(lower)) return true
  return false
}

/** Até 2 destaques úteis — sem repetir specs ou marketing. */
function extractHighlights(property: Property, max = 2): string[] {
  const results: string[] = []

  if (property.amenities?.length) {
    results.push(...property.amenities.map(normalizeHighlight))
  }

  const raw = property.description || ''
  const contandoMatch = raw.match(/contando com ([^.!?\n]+)/i)
  if (contandoMatch) {
    results.push(...contandoMatch[1].split(/,\s*/).map(normalizeHighlight))
  }

  if (results.length < 2) {
    const fromBullets = raw
      .split(/[✔✓•\n|]/)
      .map(normalizeHighlight)
      .filter((item) => item.length >= 4)
    results.push(...fromBullets)
  }

  const deduped = [...new Set(results)]
    .filter((item) => !isGenericHighlight(item, property))
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))

  if (deduped.length >= 1) return deduped.slice(0, max)

  const specs: string[] = []
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} quartos`)
  if (property.bathrooms > 0) specs.push(`${property.bathrooms} banheiros`)
  if (property.area > 0) specs.push(`${property.area} m²`)
  if (property.parking > 0) specs.push(`${property.parking} vagas`)
  return specs.slice(0, max)
}

function getMobilePhone(site: SiteConfig): string {
  const mobileEntry = site.phones.find((phone) => {
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 10 && digits[2] === '9'
  })
  if (mobileEntry?.trim()) return mobileEntry.trim()

  const digits = site.whatsapp.replace(/\D/g, '')
  if (digits.length >= 12) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }

  return site.phones[1]?.trim() || site.phones[0]?.trim() || ''
}

function getLandlinePhone(site: SiteConfig): string | null {
  const mobile = getMobilePhone(site)
  const landline = site.phones[0]?.trim()
  if (landline && landline !== mobile) return landline
  return null
}

function getLocationLine(property: Property): string {
  const loc = property.location.trim()
  const city = property.city.trim()
  if (!city || loc.toLowerCase().includes(city.toLowerCase())) return loc
  return `${loc} • ${city}`
}

function getSpecsLine(property: Property): string {
  const parts: string[] = []
  if (property.bedrooms > 0) {
    parts.push(`${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}`)
  }
  parts.push(`${property.bathrooms} banh.`)
  parts.push(`${property.area} m²`)
  if (property.parking > 0) parts.push(`${property.parking} ${property.parking === 1 ? 'vaga' : 'vagas'}`)
  return parts.join('  •  ')
}


// ─── Layouts de foto ─────────────────────────────────────────────────────────

function drawPhotoCell(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 0,
) {
  if (radius > 0) {
    ctx.save()
    roundRect(ctx, x, y, w, h, radius)
    ctx.clip()
  }
  drawCoverImage(ctx, img, x, y, w, h)
  if (radius > 0) ctx.restore()
}

/** Hero + faixa horizontal — funciona em qualquer largura. */
function drawHeroStripLayout(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = PHOTO_GAP
  const count = photos.length

  if (count === 1) {
    drawPhotoCell(ctx, photos[0], x, y, w, h)
    return
  }

  if (count === 2) {
    const half = (w - gap) / 2
    drawPhotoCell(ctx, photos[0], x, y, half, h)
    drawPhotoCell(ctx, photos[1], x + half + gap, y, half, h)
    return
  }

  if (count === 3) {
    const mainW = Math.round(w * 0.62) - gap / 2
    drawPhotoCell(ctx, photos[0], x, y, mainW, h)
    const sideW = w - mainW - gap
    const sideH = (h - gap) / 2
    drawPhotoCell(ctx, photos[1], x + mainW + gap, y, sideW, sideH)
    drawPhotoCell(ctx, photos[2], x + mainW + gap, y + sideH + gap, sideW, sideH)
    return
  }

  const stripH = Math.min(STRIP_H, Math.max(88, Math.round(w * 0.18)))
  const heroH = h - stripH - gap
  drawPhotoCell(ctx, photos[0], x, y, w, heroH)

  const extras = photos.slice(1, 5)
  const thumbW = (w - gap * (extras.length - 1)) / extras.length
  extras.forEach((img, i) => {
    drawPhotoCell(ctx, img, x + i * (thumbW + gap), y + heroH + gap, thumbW, stripH, 8)
  })
}

/** Exibe todas as fotos selecionadas com proporção correta. */
function drawMultiPhotoLayout(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  drawHeroStripLayout(ctx, photos, x, y, w, h)
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
  const pad = 20
  const logoH = 44
  const logoW = logo ? (logo.width / logo.height) * logoH : (site.shortName || site.name).length * 11
  const boxW = Math.min(logoW + 24, 240)
  const boxH = logoH + 16

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
    ctx.drawImage(logo, logoX + 12, logoY + 8, logoW, logoH)
  } else {
    ctx.fillStyle = '#1e3a8a'
    ctx.font = FONT.logoFallback
    ctx.fillText(site.shortName || site.name, logoX + 12, logoY + 32)
  }

  const typeText = property.type.toUpperCase()
  const typeBg = property.type === 'Venda' ? palette.saleBadge : palette.rentBadge
  ctx.font = FONT.badge
  const padX = 16
  const tw = ctx.measureText(typeText).width
  const bw = tw + padX * 2
  const bh = 38
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

/** Até 2 destaques em linha simples — discreto e legível. */
function drawFeatureLines(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  maxW: number,
  palette: Palette,
): number {
  const items = extractHighlights(property, 2)
  if (items.length === 0) return 0

  let cy = y
  ctx.font = FONT.feature
  items.forEach((item) => {
    ctx.fillStyle = palette.accentColor
    ctx.fillText('✓', x, cy)
    ctx.fillStyle = palette.textColor
    const lines = wrapText(ctx, item, maxW - 22).slice(0, 2)
    lines.forEach((line, i) => {
      ctx.fillText(line, x + 22, cy + i * 22)
    })
    cy += 22 * lines.length + 6
  })
  return cy - y
}

function drawContactBar(
  ctx: CanvasRenderingContext2D,
  site: SiteConfig,
  y: number,
  h: number,
  dark = true,
) {
  ctx.fillStyle = dark ? '#070d18' : '#f1f5f9'
  ctx.fillRect(0, y, W, h)
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)'
  ctx.fillRect(0, y, W, 1)

  const pad = 36
  const mobile = getMobilePhone(site)
  const landline = getLandlinePhone(site)
  const textColor = dark ? 'rgba(255,255,255,0.92)' : '#0f172a'
  const mutedColor = dark ? 'rgba(255,255,255,0.55)' : '#64748b'

  let lineY = y + 20
  BROKERS.forEach((broker) => {
    ctx.fillStyle = textColor
    ctx.font = FONT.contactBroker
    ctx.fillText(broker.name, pad, lineY)
    const nameW = ctx.measureText(broker.name).width
    ctx.fillStyle = mutedColor
    ctx.font = FONT.contactCreci
    ctx.fillText(`CRECI ${broker.creci}`, pad + nameW + 8, lineY)
    lineY += 20
  })

  ctx.fillStyle = textColor
  ctx.font = FONT.contactPhone
  const phones: string[] = []
  if (landline) phones.push(landline)
  if (mobile) phones.push(mobile)
  ctx.fillText(phones.join('   ·   '), pad, lineY + 2)
}


function fitPriceFont(ctx: CanvasRenderingContext2D, price: string, maxInnerW: number): number {
  let size = 38
  while (size >= 26) {
    ctx.font = `bold ${size}px Inter, Arial, sans-serif`
    if (ctx.measureText(price).width <= maxInnerW) return size
    size -= 2
  }
  return 26
}

/** Preço moderno — tipografia limpa, sem caixa amarela. */
function drawPriceModern(
  ctx: CanvasRenderingContext2D,
  property: Property,
  palette: Palette,
  x: number,
  y: number,
  maxW: number,
): number {
  const label = property.type === 'Venda' ? 'INVESTIMENTO' : 'VALOR MENSAL'
  let cy = y

  if (hasPriceDrop(property)) {
    const oldPrice = formatPropertyPrice(property.previousPriceValue!, property.type)
    ctx.fillStyle = palette.mutedColor
    ctx.font = '14px Inter, Arial, sans-serif'
    ctx.fillText(`De ${oldPrice}`, x, cy)
    const ow = ctx.measureText(`De ${oldPrice}`).width
    ctx.strokeStyle = palette.mutedColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x, cy - 4)
    ctx.lineTo(x + ow, cy - 4)
    ctx.stroke()
    cy += 20
  }

  ctx.fillStyle = palette.accentColor
  ctx.font = FONT.priceLabel
  ctx.fillText(label, x, cy)
  cy += 16

  const priceSize = fitPriceFont(ctx, property.price, maxW)
  ctx.fillStyle = palette.titleColor
  ctx.font = `bold ${priceSize}px Inter, Arial, sans-serif`
  ctx.fillText(property.price, x, cy)
  const priceLineW = ctx.measureText(property.price).width
  cy += priceSize + 8

  ctx.strokeStyle = palette.accentColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, cy)
  ctx.lineTo(x + Math.min(maxW, priceLineW + 4), cy)
  ctx.stroke()

  return cy - y + 12
}

function measurePropertyCard(
  ctx: CanvasRenderingContext2D,
  property: Property,
  maxW: number,
  titleFont: string,
  maxTitleLines: number,
): number {
  const lineH = titleFont === FONT.title ? 36 : 30
  ctx.font = titleFont
  const titleLines = wrapText(ctx, property.title, maxW).slice(0, maxTitleLines)
  let h = titleLines.length * lineH + 8 + 20 + 22

  if (hasPriceDrop(property)) h += 20
  h += 16
  const priceSize = fitPriceFont(ctx, property.price, maxW)
  h += priceSize + 8 + 12

  h += 8
  ctx.font = FONT.feature
  extractHighlights(property, 2).forEach((item) => {
    const lines = Math.min(2, wrapText(ctx, item, maxW - 22).length)
    h += 22 * lines + 4
  })

  return h
}

function drawPropertyCard(
  ctx: CanvasRenderingContext2D,
  property: Property,
  palette: Palette,
  x: number,
  y: number,
  maxW: number,
  titleFont = FONT.title,
  maxTitleLines = 3,
): number {
  const startY = y
  let cy = y
  const lineH = titleFont === FONT.title ? 36 : 30

  ctx.fillStyle = palette.titleColor
  ctx.font = titleFont
  wrapText(ctx, property.title, maxW)
    .slice(0, maxTitleLines)
    .forEach((line) => {
      ctx.fillText(line, x, cy)
      cy += lineH
    })

  cy += 8
  ctx.fillStyle = palette.mutedColor
  ctx.font = FONT.location
  ctx.fillText(getLocationLine(property), x, cy)
  cy += 20

  ctx.fillStyle = palette.textColor
  ctx.font = FONT.specs
  ctx.fillText(getSpecsLine(property), x, cy)
  cy += 22

  cy += drawPriceModern(ctx, property, palette, x, cy, maxW) + 8
  cy += drawFeatureLines(ctx, property, x, cy, maxW, palette)

  return cy - startY
}

function drawPanelWithCard(
  ctx: CanvasRenderingContext2D,
  input: RenderContext,
  panelY: number,
  panelH: number,
  pad: number,
  maxW: number,
  titleFont = FONT.title,
  maxTitleLines = 3,
) {
  const p = input.palette
  ctx.fillStyle = p.panelBg
  ctx.fillRect(0, panelY, W, panelH)
  ctx.fillStyle = p.accentColor
  ctx.fillRect(0, panelY, W, 3)

  drawPropertyCard(ctx, input.property, p, pad, panelY + PANEL_PAD, maxW, titleFont, maxTitleLines)
}

// ─── 5 layouts distintos ─────────────────────────────────────────────────────

function calcPanelH(
  ctx: CanvasRenderingContext2D,
  property: Property,
  maxW: number,
  titleFont: string,
  maxTitleLines: number,
): number {
  return measurePropertyCard(ctx, property, maxW, titleFont, maxTitleLines) + PANEL_PAD * 2 + 16
}

/** DESTAQUE */
async function renderClassic(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const pad = PANEL_PAD
  const fullW = W - pad * 2
  const panelH = calcPanelH(ctx, input.property, fullW, FONT.title, 3)
  const photoH = H - panelH - CONTACT_BAR_H

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawPanelWithCard(ctx, input, photoH, panelH, pad, fullW, FONT.title, 3)
  drawContactBar(ctx, input.site, H - CONTACT_BAR_H, CONTACT_BAR_H)
}

/** EDITORIAL — fotos à esquerda, painel compacto à direita */
async function renderModern(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const split = Math.round(W * 0.56)
  const pad = 24
  const innerW = W - split - pad * 2

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, split, H - CONTACT_BAR_H)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const p = input.palette
  ctx.fillStyle = p.panelBg
  ctx.fillRect(split, 0, W - split, H - CONTACT_BAR_H)
  ctx.fillStyle = p.accentColor
  ctx.fillRect(split, 0, 3, H - CONTACT_BAR_H)

  const cardH = measurePropertyCard(ctx, input.property, innerW, FONT.titleSm, 4)
  const areaH = H - CONTACT_BAR_H - 60
  const cardY = 60 + Math.max(0, (areaH - cardH) / 2)
  drawPropertyCard(ctx, input.property, p, split + pad, cardY, innerW, FONT.titleSm, 4)

  drawContactBar(ctx, input.site, H - CONTACT_BAR_H, CONTACT_BAR_H)
}

/** CINEMATOGRÁFICO */
async function renderBold(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const pad = PANEL_PAD
  const fullW = W - pad * 2
  const panelH = calcPanelH(ctx, input.property, fullW, FONT.title, 3)
  const photoH = H - panelH - CONTACT_BAR_H + 40

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH)

  const grad = ctx.createLinearGradient(0, photoH - 140, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.5, 'rgba(7,13,24,0.88)')
  grad.addColorStop(1, 'rgba(7,13,24,0.98)')
  ctx.fillStyle = grad
  ctx.fillRect(0, photoH - 140, W, H - photoH + 140)

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawPanelWithCard(ctx, input, H - panelH - CONTACT_BAR_H, panelH, pad, fullW, FONT.title, 3)
  drawContactBar(ctx, input.site, H - CONTACT_BAR_H, CONTACT_BAR_H)
}

/** GALERIA */
async function renderMinimal(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const pad = PANEL_PAD
  const fullW = W - pad * 2
  const lightPalette: Palette = {
    ...input.palette,
    titleColor: '#111827',
    textColor: '#374151',
    mutedColor: '#6b7280',
    accentColor: '#2563eb',
  }
  const panelH = calcPanelH(ctx, input.property, fullW, FONT.title, 3)
  const photoH = H - panelH - CONTACT_BAR_H

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, photoH, W, panelH)
  ctx.fillStyle = input.palette.accentColor
  ctx.fillRect(0, photoH, W, 3)

  drawPropertyCard(ctx, input.property, lightPalette, pad, photoH + PANEL_PAD, fullW, FONT.title, 3)
  drawContactBar(ctx, input.site, H - CONTACT_BAR_H, CONTACT_BAR_H, false)
}

/** MOSAICO */
async function renderCollage(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const pad = PANEL_PAD
  const fullW = W - pad * 2
  const panelH = calcPanelH(ctx, input.property, fullW, FONT.title, 3)
  const photoH = H - panelH - CONTACT_BAR_H

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawPanelWithCard(ctx, input, photoH, panelH, pad, fullW, FONT.title, 3)
  drawContactBar(ctx, input.site, H - CONTACT_BAR_H, CONTACT_BAR_H)
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
