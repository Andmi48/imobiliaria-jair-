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
const CONTACT_BAR_H = 104
const PHOTO_GAP = 8
const STRIP_H = 118

/** Tipografia grande — legível em celular e WhatsApp. */
const FONT = {
  title: 'bold 40px Inter, Arial, sans-serif',
  titleSm: 'bold 34px Inter, Arial, sans-serif',
  location: '600 21px Inter, Arial, sans-serif',
  specs: '600 21px Inter, Arial, sans-serif',
  chip: '600 19px Inter, Arial, sans-serif',
  priceLabel: '600 18px Inter, Arial, sans-serif',
  priceValue: 'bold 48px Inter, Arial, sans-serif',
  contactName: '600 19px Inter, Arial, sans-serif',
  contactLandline: '17px Inter, Arial, sans-serif',
  contactWhatsLabel: '700 13px Inter, Arial, sans-serif',
  contactWhatsPhone: 'bold 30px Inter, Arial, sans-serif',
  badge: 'bold 19px Inter, Arial, sans-serif',
  logoFallback: 'bold 22px Inter, Arial, sans-serif',
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

  if (text.length < 4 || text.length > 48) return true
  if (lower === titleLower || lower === cityLower || lower === locLower) return true
  if (isMarketingHighlight(text)) return true
  if (/^(são paulo|sao paulo|sp)$/i.test(lower)) return true
  if (lower === property.type.toLowerCase()) return true
  if (titleLower.includes(lower) && lower.length > 8) return true
  if (locLower.includes(lower) && text.length < 28) return true
  if (cityLower.includes(lower) && text.length < 20) return true
  if (/^(excelente|sobrado|imóvel|imovel|ideal|casa)\b/i.test(lower) && text.length < 32) return true
  if (/^\d+\s*(quarto|banh|m²|m2|vaga)/i.test(lower)) return true
  return false
}

/** Até 3 destaques curtos — sem repetir título, cidade ou marketing. */
function extractHighlights(property: Property, max = 3): string[] {
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

function getSpecsLine(property: Property): string {
  const parts: string[] = []
  if (property.bedrooms > 0) parts.push(`${property.bedrooms} quartos`)
  parts.push(`${property.bathrooms} banh.`)
  parts.push(`${property.area}m²`)
  if (property.parking > 0) parts.push(`${property.parking} vagas`)
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

/** Grade uniforme — ideal para colunas estreitas (Editorial). */
function drawPhotoGrid(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const gap = PHOTO_GAP
  const count = Math.min(photos.length, 5)

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
    const topH = (h - gap) * 0.58
    const botH = h - topH - gap
    const leftW = (w - gap) * 0.58
    const rightW = w - leftW - gap
    drawPhotoCell(ctx, photos[0], x, y, w, topH)
    drawPhotoCell(ctx, photos[1], x, y + topH + gap, leftW, botH)
    drawPhotoCell(ctx, photos[2], x + leftW + gap, y + topH + gap, rightW, botH)
    return
  }

  const cols = count <= 4 ? 2 : 3
  const rows = Math.ceil(count / cols)
  const cellW = (w - gap * (cols - 1)) / cols
  const cellH = (h - gap * (rows - 1)) / rows
  photos.slice(0, count).forEach((img, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    drawPhotoCell(ctx, img, x + col * (cellW + gap), y + row * (cellH + gap), cellW, cellH, 8)
  })
}

/** Exibe todas as fotos — faixa inferior com altura fixa (nunca estica). */
function drawMultiPhotoLayout(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  x: number,
  y: number,
  w: number,
  h: number,
  mode: 'wide' | 'grid' = 'wide',
) {
  if (mode === 'grid' || w < 580) {
    drawPhotoGrid(ctx, photos, x, y, w, h)
    return
  }

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

  const stripH = Math.min(STRIP_H, Math.round(h * 0.17))
  const heroH = h - stripH - gap
  drawPhotoCell(ctx, photos[0], x, y, w, heroH)

  const extras = photos.slice(1, 5)
  const thumbW = (w - gap * (extras.length - 1)) / extras.length
  extras.forEach((img, i) => {
    drawPhotoCell(ctx, img, x + i * (thumbW + gap), y + heroH + gap, thumbW, stripH, 10)
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

/** Até 3 chips curtos — sem parágrafos nem listas longas. */
function drawFeatureChips(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  maxW: number,
  palette: Palette,
): number {
  const items = extractHighlights(property, 3)
  if (items.length === 0) return 0

  const gap = 10
  const padX = 16
  const chipH = 40
  let cx = x
  let cy = y
  const rowStart = x

  ctx.font = FONT.chip
  items.forEach((item) => {
    const tw = ctx.measureText(item).width
    const chipW = tw + padX * 2

    if (cx + chipW > x + maxW && cx > rowStart) {
      cx = rowStart
      cy += chipH + gap
    }

    ctx.fillStyle = palette.chipBg
    roundRect(ctx, cx, cy, chipW, chipH, 20)
    ctx.fill()
    ctx.fillStyle = palette.chipText
    ctx.textBaseline = 'middle'
    ctx.fillText(item, cx + padX, cy + chipH / 2)
    ctx.textBaseline = 'alphabetic'

    cx += chipW + gap
  })

  return cy + chipH - y
}

function drawWhatsAppIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#25D366'
  ctx.font = `bold ${Math.round(size * 0.55)}px Inter, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('W', x + size / 2, y + size / 2 + 1)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.restore()
}

function drawPremiumContactBar(
  ctx: CanvasRenderingContext2D,
  site: SiteConfig,
  palette: Palette,
  y: number,
  h: number,
  dark = true,
) {
  ctx.fillStyle = dark ? 'rgba(0,0,0,0.38)' : 'rgba(15,23,42,0.06)'
  ctx.fillRect(0, y, W, h)

  const pad = 32
  const midY = y + h / 2
  const mobile = getMobilePhone(site)
  const landline = getLandlinePhone(site)

  ctx.textBaseline = 'middle'
  ctx.fillStyle = dark ? palette.titleColor : '#111827'
  ctx.font = FONT.contactName
  ctx.fillText(`${site.shortName || site.name}  •  CRECI ${site.creci}`, pad, midY - (landline ? 12 : 0))

  if (landline) {
    ctx.fillStyle = dark ? palette.mutedColor : '#6b7280'
    ctx.font = FONT.contactLandline
    ctx.fillText(`Fixo: ${landline}`, pad, midY + 14)
  }

  if (mobile) {
    ctx.font = FONT.contactWhatsPhone
    const phoneW = ctx.measureText(mobile).width
    const iconSize = 40
    const pillW = iconSize + 20 + phoneW + 20
    const pillH = 58
    const pillX = W - pad - pillW
    const pillY = midY - pillH / 2

    ctx.fillStyle = '#25D366'
    roundRect(ctx, pillX, pillY, pillW, pillH, 29)
    ctx.fill()

    drawWhatsAppIcon(ctx, pillX + 12, pillY + 10, iconSize - 12)

    ctx.fillStyle = '#ffffff'
    ctx.font = FONT.contactWhatsLabel
    ctx.fillText('WHATSAPP', pillX + iconSize + 8, pillY + 20)
    ctx.font = FONT.contactWhatsPhone
    ctx.fillText(mobile, pillX + iconSize + 8, pillY + 44)
  }

  ctx.textBaseline = 'alphabetic'
}


function fitPriceFont(ctx: CanvasRenderingContext2D, price: string, maxInnerW: number): void {
  let size = 48
  while (size >= 30) {
    ctx.font = `bold ${size}px Inter, Arial, sans-serif`
    if (ctx.measureText(price).width <= maxInnerW) return
    size -= 2
  }
  ctx.font = 'bold 30px Inter, Arial, sans-serif'
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
  const blockH = compact ? (hasPriceDrop(property) ? 96 : 78) : hasPriceDrop(property) ? 108 : 88
  const grad = ctx.createLinearGradient(x, y, x + w, y + blockH)
  grad.addColorStop(0, palette.priceGradientStart)
  grad.addColorStop(1, palette.priceGradientEnd)

  ctx.fillStyle = grad
  roundRect(ctx, x, y, w, blockH, compact ? 14 : 16)
  ctx.fill()

  const innerX = x + 20
  let labelY = y + (compact ? 24 : 28)

  if (hasPriceDrop(property)) {
    const oldPrice = formatPropertyPrice(property.previousPriceValue!, property.type)
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.font = '16px Inter, Arial, sans-serif'
    ctx.fillText(`De ${oldPrice}`, innerX, labelY)
    const ow = ctx.measureText(`De ${oldPrice}`).width
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(innerX, labelY - 4)
    ctx.lineTo(innerX + ow, labelY - 4)
    ctx.stroke()
    labelY += 20
  }

  ctx.fillStyle = palette.priceText
  ctx.font = FONT.priceLabel
  ctx.fillText(property.type === 'Venda' ? 'Investimento' : 'Valor mensal', innerX, labelY)

  fitPriceFont(ctx, property.price, w - 40)
  ctx.fillText(property.price, innerX, y + blockH - 14)

  return blockH
}

/** Cabeçalho empilhado: título → local → specs → preço (largura total). */
function drawPropertyCard(
  ctx: CanvasRenderingContext2D,
  property: Property,
  palette: Palette,
  x: number,
  y: number,
  maxW: number,
  titleFont = FONT.title,
  maxTitleLines = 2,
): number {
  let cy = y

  ctx.fillStyle = palette.titleColor
  ctx.font = titleFont
  wrapText(ctx, property.title, maxW)
    .slice(0, maxTitleLines)
    .forEach((line) => {
      ctx.fillText(line, x, cy)
      cy += titleFont === FONT.title ? 44 : 38
    })

  cy += 6
  ctx.fillStyle = palette.mutedColor
  ctx.font = FONT.location
  ctx.fillText(`${property.location} • ${property.city}`, x, cy)
  cy += 26

  ctx.fillStyle = palette.textColor
  ctx.font = FONT.specs
  ctx.fillText(getSpecsLine(property), x, cy)
  cy += 30

  const priceH = drawPriceBlock(ctx, property, palette, x, cy, maxW, true)
  cy += priceH

  return cy - y
}

// ─── 5 layouts distintos ─────────────────────────────────────────────────────

/** DESTAQUE: fotos amplas + cartão inferior organizado */
async function renderClassic(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const panelH = 340
  const photoH = H - panelH - CONTACT_BAR_H
  const panelY = photoH
  const p = input.palette
  const pad = 36
  const fullW = W - pad * 2

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH, 'wide')

  ctx.fillStyle = p.panelBg
  ctx.fillRect(0, panelY, W, panelH)

  drawTopBranding(ctx, input.logo, input.site, input.property, p, input.customization)

  let cy = panelY + 24
  cy += drawPropertyCard(ctx, input.property, p, pad, cy, fullW) + 16
  drawFeatureChips(ctx, input.property, pad, cy, fullW, p)

  drawPremiumContactBar(ctx, input.site, p, H - CONTACT_BAR_H, CONTACT_BAR_H)
}

/** EDITORIAL: grade de fotos à esquerda + painel à direita */
async function renderModern(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const split = Math.round(W * 0.5)
  drawMultiPhotoLayout(ctx, input.photos, 0, 0, split, H - CONTACT_BAR_H, 'grid')

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const panelX = split
  const panelW = W - split
  const p = input.palette

  ctx.fillStyle = p.panelBg
  ctx.fillRect(panelX, 0, panelW, H - CONTACT_BAR_H)

  ctx.fillStyle = p.accentColor
  ctx.fillRect(panelX, 0, 5, H - CONTACT_BAR_H)

  const pad = 28
  const innerW = panelW - pad * 2
  let cy = 72

  cy += drawPropertyCard(ctx, input.property, p, panelX + pad, cy, innerW, FONT.titleSm, 3) + 18
  drawFeatureChips(ctx, input.property, panelX + pad, cy, innerW, p)

  drawPremiumContactBar(ctx, input.site, p, H - CONTACT_BAR_H, CONTACT_BAR_H)
}

/** CINEMATOGRÁFICO: fotos no topo + texto sobre gradiente */
async function renderBold(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const photoH = Math.round(H * 0.55)
  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH, 'wide')

  const grad = ctx.createLinearGradient(0, photoH - 100, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.35, 'rgba(15,23,42,0.8)')
  grad.addColorStop(1, 'rgba(15,23,42,0.97)')
  ctx.fillStyle = grad
  ctx.fillRect(0, photoH - 100, W, H - photoH + 100)

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const p = input.palette
  const pad = 40
  const panelTop = H - CONTACT_BAR_H - 300
  let cy = panelTop + 20
  const fullW = W - pad * 2

  cy += drawPropertyCard(ctx, input.property, p, pad, cy, fullW) + 16
  drawFeatureChips(ctx, input.property, pad, cy, fullW, p)

  drawPremiumContactBar(ctx, input.site, p, H - CONTACT_BAR_H, CONTACT_BAR_H)
}

/** GALERIA: fotos grandes + painel branco limpo */
async function renderMinimal(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const photoH = Math.round(H * 0.54)
  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH, 'wide')
  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const panelY = photoH
  const panelH = H - photoH - CONTACT_BAR_H
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, panelY, W, panelH)

  ctx.fillStyle = input.palette.accentColor
  ctx.fillRect(0, panelY, W, 5)

  const pad = 36
  const fullW = W - pad * 2
  let cy = panelY + 24

  const lightPalette: Palette = {
    ...input.palette,
    titleColor: '#111827',
    textColor: '#374151',
    mutedColor: '#6b7280',
    accentColor: '#1e40af',
    chipBg: 'rgba(30,64,175,0.1)',
    chipText: '#1e3a8a',
  }

  cy += drawPropertyCard(ctx, input.property, lightPalette, pad, cy, fullW) + 16
  drawFeatureChips(ctx, input.property, pad, cy, fullW, lightPalette)

  drawPremiumContactBar(ctx, input.site, { ...input.palette, titleColor: '#111827' }, H - CONTACT_BAR_H, CONTACT_BAR_H, false)
}

/** MOSAICO: composição ampla + cartão inferior */
async function renderCollage(ctx: CanvasRenderingContext2D, input: RenderContext) {
  const cardH = 340
  const photoH = H - cardH - CONTACT_BAR_H

  drawMultiPhotoLayout(ctx, input.photos, 0, 0, W, photoH, 'wide')

  drawTopBranding(ctx, input.logo, input.site, input.property, input.palette, input.customization)

  const p = input.palette
  const cardY = photoH
  const pad = 36
  const innerW = W - pad * 2

  ctx.fillStyle = p.panelBg
  ctx.fillRect(0, cardY, W, cardH)

  let cy = cardY + 24
  cy += drawPropertyCard(ctx, input.property, p, pad, cy, innerW) + 16
  drawFeatureChips(ctx, input.property, pad, cy, innerW, p)

  drawPremiumContactBar(ctx, input.site, p, H - CONTACT_BAR_H, CONTACT_BAR_H)
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
