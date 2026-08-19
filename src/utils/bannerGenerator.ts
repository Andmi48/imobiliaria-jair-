import type { Property } from '../data/properties'
import type { SiteConfig } from '../types/content'

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
    description: 'Fotos amplas + ficha técnica completa',
  },
  {
    id: 'modern',
    name: 'Editorial',
    description: 'Fotos à esquerda + ficha à direita',
  },
  {
    id: 'bold',
    name: 'Cinematográfico',
    description: 'Imagem imersiva com ficha sobreposta',
  },
  {
    id: 'minimal',
    name: 'Galeria',
    description: 'Fotos + painel claro e sóbrio',
  },
  {
    id: 'collage',
    name: 'Mosaico Premium',
    description: 'Composição de fotos + ficha técnica',
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
const INFO_H = 332
const PHOTO_H = H - INFO_H
const PHOTO_GAP = 6
const STRIP_H = 128

const BROKERS = [
  { name: 'Jair A Costa', creci: '19738-F' },
  { name: 'André T. Costa', creci: '90092-F' },
] as const

const FONT = {
  title: '600 30px Inter, Arial, sans-serif',
  titleSm: '600 26px Inter, Arial, sans-serif',
  location: '500 16px Inter, Arial, sans-serif',
  specValue: '600 22px Inter, Arial, sans-serif',
  specLabel: '500 11px Inter, Arial, sans-serif',
  feature: '500 16px Inter, Arial, sans-serif',
  priceLabel: '600 11px Inter, Arial, sans-serif',
  priceValue: '600 36px Inter, Arial, sans-serif',
  contactName: '600 14px Inter, Arial, sans-serif',
  contactMeta: '500 12px Inter, Arial, sans-serif',
  badge: '600 13px Inter, Arial, sans-serif',
  logoFallback: 'bold 18px Inter, Arial, sans-serif',
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

function getSpecCells(property: Property): Array<{ value: string; label: string }> {
  const cells: Array<{ value: string; label: string }> = []
  if (property.bedrooms > 0) {
    cells.push({ value: String(property.bedrooms), label: property.bedrooms === 1 ? 'QUARTO' : 'QUARTOS' })
  }
  if (property.bathrooms > 0) {
    cells.push({ value: String(property.bathrooms), label: property.bathrooms === 1 ? 'BANH.' : 'BANH.' })
  }
  if (property.area > 0) cells.push({ value: String(property.area), label: 'M²' })
  if (property.parking > 0) {
    cells.push({ value: String(property.parking), label: property.parking === 1 ? 'VAGA' : 'VAGAS' })
  }
  return cells
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

  const stripH = Math.min(STRIP_H, Math.round(h * 0.2))
  const heroH = h - stripH - gap
  drawPhotoCell(ctx, photos[0], x, y, w, heroH)

  const extras = photos.slice(1, 5)
  const thumbW = (w - gap * (extras.length - 1)) / extras.length
  extras.forEach((img, i) => {
    drawPhotoCell(ctx, img, x + i * (thumbW + gap), y + heroH + gap, thumbW, stripH)
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
  const inset = 22
  const logoH = 40
  const logoW = logo ? (logo.width / logo.height) * logoH : Math.min(180, (site.shortName || site.name).length * 10)
  const boxW = Math.min(logoW + 20, 220)
  const boxH = logoH + 14
  const logoX = customization.logoPosition === 'top-left' ? inset : W - inset - boxW

  ctx.fillStyle = 'rgba(255,255,255,0.96)'
  roundRect(ctx, logoX, inset, boxW, boxH, 8)
  ctx.fill()

  if (logo) {
    ctx.drawImage(logo, logoX + 10, inset + 7, logoW, logoH)
  } else {
    ctx.fillStyle = '#1e3a8a'
    ctx.font = FONT.logoFallback
    ctx.fillText(site.shortName || site.name, logoX + 10, inset + 32)
  }

  const typeText = property.type.toUpperCase()
  ctx.font = FONT.badge
  const bw = ctx.measureText(typeText).width + 28
  const bh = 30
  const bx = customization.typePosition === 'top-left' ? inset : W - inset - bw
  ctx.fillStyle = property.type === 'Venda' ? palette.saleBadge : palette.rentBadge
  roundRect(ctx, bx, inset, bw, bh, 6)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.fillText(typeText, bx + 14, inset + bh / 2)
  ctx.textBaseline = 'alphabetic'

  const highlight = getHighlightLabel(property)
  if (highlight) {
    const label = highlight.toUpperCase()
    ctx.font = FONT.badge
    const pbw = ctx.measureText(label).width + 24
    const pbx = customization.typePosition === 'top-right' ? inset : W - inset - pbw
    ctx.fillStyle = palette.promoBadge
    roundRect(ctx, pbx, inset + boxH + 8, pbw, 26, 6)
    ctx.fill()
    ctx.fillStyle = palette.promoText
    ctx.textBaseline = 'middle'
    ctx.fillText(label, pbx + 12, inset + boxH + 21)
    ctx.textBaseline = 'alphabetic'
  }
}

function fitPriceSize(ctx: CanvasRenderingContext2D, price: string, maxW: number): number {
  let size = 36
  while (size >= 24) {
    ctx.font = `600 ${size}px Inter, Arial, sans-serif`
    if (ctx.measureText(price).width <= maxW) return size
    size -= 1
  }
  return 24
}

function drawSpecRow(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  w: number,
  palette: Palette,
  light: boolean,
) {
  const cells = getSpecCells(property)
  if (cells.length === 0) return 0
  const cellW = w / cells.length
  const line = light ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.12)'

  cells.forEach((cell, i) => {
    const cx = x + i * cellW
    if (i > 0) {
      ctx.fillStyle = line
      ctx.fillRect(cx, y, 1, 42)
    }
    ctx.fillStyle = palette.titleColor
    ctx.font = FONT.specValue
    ctx.fillText(cell.value, cx + (i === 0 ? 0 : 16), y + 18)
    ctx.fillStyle = palette.mutedColor
    ctx.font = FONT.specLabel
    ctx.fillText(cell.label, cx + (i === 0 ? 0 : 16), y + 38)
  })
  return 48
}

function drawPriceColumn(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  w: number,
  palette: Palette,
) {
  ctx.fillStyle = palette.accentColor
  ctx.font = FONT.priceLabel
  ctx.fillText(property.type === 'Venda' ? 'INVESTIMENTO' : 'VALOR MENSAL', x, y)

  const size = fitPriceSize(ctx, property.price, w)
  ctx.fillStyle = palette.titleColor
  ctx.font = `600 ${size}px Inter, Arial, sans-serif`
  ctx.fillText(property.price, x, y + 40)
}

function drawContactBlock(
  ctx: CanvasRenderingContext2D,
  site: SiteConfig,
  x: number,
  y: number,
  w: number,
  palette: Palette,
  light: boolean,
) {
  ctx.fillStyle = light ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.12)'
  ctx.fillRect(x, y, w, 1)

  const mobile = getMobilePhone(site)
  const landline = getLandlinePhone(site)
  const rightX = x + Math.round(w * 0.56)
  let ly = y + 24

  BROKERS.forEach((broker) => {
    ctx.fillStyle = palette.titleColor
    ctx.font = FONT.contactName
    ctx.fillText(broker.name, x, ly)
    ctx.fillStyle = palette.mutedColor
    ctx.font = FONT.contactMeta
    ctx.fillText(`CRECI ${broker.creci}`, x, ly + 16)
    ly += 40
  })

  let ry = y + 24
  if (landline) {
    ctx.fillStyle = palette.mutedColor
    ctx.font = FONT.contactMeta
    ctx.fillText('FIXO', rightX, ry)
    ctx.fillStyle = palette.titleColor
    ctx.font = FONT.contactName
    ctx.fillText(landline, rightX, ry + 18)
    ry += 40
  }
  if (mobile) {
    ctx.fillStyle = palette.mutedColor
    ctx.font = FONT.contactMeta
    ctx.fillText('WHATSAPP', rightX, ry)
    ctx.fillStyle = palette.titleColor
    ctx.font = FONT.contactName
    ctx.fillText(mobile, rightX, ry + 18)
  }
}

function drawListingCard(
  ctx: CanvasRenderingContext2D,
  input: RenderContext,
  x: number,
  y: number,
  w: number,
  h: number,
  light = false,
) {
  const p = light
    ? ({
        ...input.palette,
        panelBg: '#f8fafc',
        titleColor: '#0f172a',
        textColor: '#334155',
        mutedColor: '#64748b',
        accentColor: '#1d4ed8',
      } satisfies Palette)
    : input.palette

  ctx.fillStyle = p.panelBg
  ctx.fillRect(x, y, w, h)

  const inner = 36
  const ix = x + inner
  const iw = w - inner * 2
  const priceW = Math.min(240, Math.round(iw * 0.32))
  const titleW = iw - priceW - 28
  let cy = y + 32

  ctx.fillStyle = p.titleColor
  ctx.font = w < 520 ? FONT.titleSm : FONT.title
  const titleLines = wrapText(ctx, input.property.title, titleW).slice(0, 2)
  titleLines.forEach((line) => {
    ctx.fillText(line, ix, cy)
    cy += w < 520 ? 30 : 34
  })

  drawPriceColumn(ctx, input.property, ix + titleW + 28, y + 32, priceW, p)

  ctx.fillStyle = p.mutedColor
  ctx.font = FONT.location
  ctx.fillText(getLocationLine(input.property), ix, cy + 6)
  cy += 28

  cy += drawSpecRow(ctx, input.property, ix, cy, iw, p, light)

  const features = extractHighlights(input.property, 2)
  if (features.length) {
    ctx.font = FONT.feature
    const colW = (iw - 20) / 2
    features.forEach((item, i) => {
      const fx = ix + i * (colW + 20)
      ctx.fillStyle = p.accentColor
      ctx.fillText('·', fx, cy + 2)
      ctx.fillStyle = p.textColor
      const line = wrapText(ctx, item, colW - 16)[0]
      ctx.fillText(line, fx + 14, cy + 2)
    })
    cy += 28
  }

  drawContactBlock(ctx, input.site, ix, y + h - 102, iw, p, light)
}

function drawMosaic(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = PHOTO_GAP
  if (photos.length === 1) {
    drawPhotoCell(ctx, photos[0], x, y, w, h)
    return
  }
  if (photos.length === 2) {
    drawPhotoCell(ctx, photos[0], x, y, (w - gap) / 2, h)
    drawPhotoCell(ctx, photos[1], x + (w - gap) / 2 + gap, y, (w - gap) / 2, h)
    return
  }
  const mainW = Math.round(w * 0.62)
  drawPhotoCell(ctx, photos[0], x, y, mainW, h)
  const sideW = w - mainW - gap
  const extras = photos.slice(1, 5)
  const sideH = (h - gap * (extras.length - 1)) / extras.length
  extras.forEach((img, i) => {
    drawPhotoCell(ctx, img, x + mainW + gap, y + i * (sideH + gap), sideW, sideH)
  })
}

// ─── 5 layouts distintos ─────────────────────────────────────────────────────

async function renderClassic(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawHeroStripLayout(ctx, input.photos, 0, 0, W, PHOTO_H)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawListingCard(ctx, input, 0, PHOTO_H, W, INFO_H)
}

async function renderModern(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const split = 600
  drawHeroStripLayout(ctx, input.photos, 0, 0, split, H)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawListingCard(ctx, input, split, 0, W - split, H)
}

async function renderBold(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawCoverImage(ctx, input.photos[0], 0, 0, W, H)
  if (input.photos.length > 1) {
    const extras = input.photos.slice(1, 5)
    const stripY = H - INFO_H - STRIP_H - 10
    const thumbW = (W - PHOTO_GAP * (extras.length - 1)) / extras.length
    extras.forEach((img, i) => {
      drawPhotoCell(ctx, img, i * (thumbW + PHOTO_GAP), stripY, thumbW, STRIP_H)
    })
  }
  const veil = ctx.createLinearGradient(0, H - INFO_H - 80, 0, H)
  veil.addColorStop(0, 'rgba(15,23,42,0)')
  veil.addColorStop(0.35, 'rgba(15,23,42,0.82)')
  veil.addColorStop(1, 'rgba(15,23,42,1)')
  ctx.fillStyle = veil
  ctx.fillRect(0, H - INFO_H - 80, W, INFO_H + 80)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawListingCard(ctx, input, 0, H - INFO_H, W, INFO_H)
}

async function renderMinimal(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawHeroStripLayout(ctx, input.photos, 0, 0, W, PHOTO_H)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawListingCard(ctx, input, 0, PHOTO_H, W, INFO_H, true)
}

async function renderCollage(ctx: CanvasRenderingContext2D, input: RenderContext) {
  drawMosaic(ctx, input.photos, 0, 0, W, PHOTO_H)
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)
  drawListingCard(ctx, input, 0, PHOTO_H, W, INFO_H)
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
