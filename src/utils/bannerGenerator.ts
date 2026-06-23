import type { Property } from '../data/properties'
import type { SiteConfig } from '../types/content'
import { formatPropertyPrice } from './propertyFormat'

export const MAX_BANNER_PHOTOS = 5

export type BannerTemplateId = 'classic' | 'modern' | 'bold' | 'minimal' | 'collage'

export const BANNER_TEMPLATES: Array<{
  id: BannerTemplateId
  name: string
  description: string
}> = [
  { id: 'classic', name: 'Clássico', description: 'Mosaico de fotos + painel azul com logo e descrição' },
  { id: 'modern', name: 'Moderno', description: 'Fotos à esquerda, informações completas à direita' },
  { id: 'bold', name: 'Impacto', description: 'Fotos em destaque com faixa vermelha e preço grande' },
  { id: 'minimal', name: 'Elegante', description: 'Moldura branca com logo e texto organizado' },
  { id: 'collage', name: 'Colagem', description: 'Máximo de fotos em mosaio + destaque de preço' },
]

const W = 1080
const H = 1080

const COLORS = {
  blue: '#1e40af',
  blueDark: '#1e3a8a',
  red: '#dc2626',
  redDark: '#b91c1c',
  white: '#ffffff',
  gray: '#6b7280',
  grayLight: '#9ca3af',
  dark: '#111827',
  amber: '#f59e0b',
}

type BannerStyle = {
  panelBg: string
  titleColor: string
  textColor: string
  mutedColor: string
  accentColor: string
  badgeBg: string
  badgeText: string
}

const STYLES: Record<BannerTemplateId, BannerStyle> = {
  classic: {
    panelBg: COLORS.blueDark,
    titleColor: COLORS.white,
    textColor: 'rgba(255,255,255,0.92)',
    mutedColor: 'rgba(255,255,255,0.75)',
    accentColor: '#fca5a5',
    badgeBg: COLORS.red,
    badgeText: COLORS.white,
  },
  modern: {
    panelBg: COLORS.white,
    titleColor: COLORS.dark,
    textColor: COLORS.dark,
    mutedColor: COLORS.gray,
    accentColor: COLORS.red,
    badgeBg: COLORS.red,
    badgeText: COLORS.white,
  },
  bold: {
    panelBg: COLORS.redDark,
    titleColor: COLORS.white,
    textColor: 'rgba(255,255,255,0.95)',
    mutedColor: 'rgba(255,255,255,0.8)',
    accentColor: COLORS.white,
    badgeBg: COLORS.amber,
    badgeText: COLORS.dark,
  },
  minimal: {
    panelBg: '#f8fafc',
    titleColor: COLORS.dark,
    textColor: '#374151',
    mutedColor: COLORS.gray,
    accentColor: COLORS.blue,
    badgeBg: COLORS.red,
    badgeText: COLORS.white,
  },
  collage: {
    panelBg: COLORS.red,
    titleColor: COLORS.white,
    textColor: 'rgba(255,255,255,0.95)',
    mutedColor: 'rgba(255,255,255,0.8)',
    accentColor: '#fecaca',
    badgeBg: COLORS.amber,
    badgeText: COLORS.dark,
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
  if (hasPriceDrop(property)) return 'Preço reduzido!'
  return null
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

  // 5 fotos
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

function drawBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  bg: string,
  color: string,
) {
  ctx.font = 'bold 22px Inter, Arial, sans-serif'
  const padX = 18
  const padY = 10
  const tw = ctx.measureText(text).width
  const bw = tw + padX * 2
  const bh = 38
  ctx.fillStyle = bg
  roundRect(ctx, x, y, bw, bh, 8)
  ctx.fill()
  ctx.fillStyle = color
  ctx.fillText(text, x + padX, y + padY + 20)
  return bw
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

function drawLogo(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  site: SiteConfig,
  x: number,
  y: number,
  maxH: number,
  textColor: string,
): number {
  if (logo) {
    const h = maxH
    const w = (logo.width / logo.height) * h
    ctx.drawImage(logo, x, y, w, h)
    return w
  }
  ctx.fillStyle = textColor
  ctx.font = 'bold 26px Inter, Arial, sans-serif'
  const name = site.shortName || site.name
  ctx.fillText(name, x, y + maxH * 0.75)
  return ctx.measureText(name).width
}

function drawInfoPanel(
  ctx: CanvasRenderingContext2D,
  property: Property,
  site: SiteConfig,
  logo: HTMLImageElement | null,
  style: BannerStyle,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.fillStyle = style.panelBg
  ctx.fillRect(x, y, w, h)

  const pad = 36
  const innerW = w - pad * 2
  let cursorY = y + pad

  // Logo + badge na mesma linha
  drawLogo(ctx, logo, site, x + pad, cursorY, 48, style.titleColor)
  const highlight = getHighlightLabel(property)
  if (highlight) {
    const label = highlight.toUpperCase()
    ctx.font = 'bold 22px Inter, Arial, sans-serif'
    const tw = ctx.measureText(label).width
    const bw = tw + 36
    drawBadge(ctx, label, x + w - pad - bw, cursorY + 4, style.badgeBg, style.badgeText)
  }

  cursorY += 64

  // Tipo
  ctx.fillStyle = style.accentColor
  ctx.font = 'bold 18px Inter, Arial, sans-serif'
  ctx.fillText(property.type.toUpperCase(), x + pad, cursorY)
  cursorY += 28

  // Título
  ctx.fillStyle = style.titleColor
  ctx.font = 'bold 34px Inter, Arial, sans-serif'
  const titleLines = wrapText(ctx, property.title, innerW)
  titleLines.slice(0, 2).forEach((line) => {
    ctx.fillText(line, x + pad, cursorY)
    cursorY += 40
  })

  cursorY += 6

  // Localização
  ctx.fillStyle = style.mutedColor
  ctx.font = '20px Inter, Arial, sans-serif'
  ctx.fillText(`${property.location} • ${property.city}`, x + pad, cursorY)
  cursorY += 30

  // Descrição
  if (property.description?.trim()) {
    ctx.fillStyle = style.textColor
    ctx.font = '18px Inter, Arial, sans-serif'
    const descLines = wrapText(ctx, property.description.trim(), innerW)
    descLines.slice(0, 3).forEach((line) => {
      ctx.fillText(line, x + pad, cursorY)
      cursorY += 24
    })
    cursorY += 8
  }

  // Preço com redução
  if (hasPriceDrop(property)) {
    const oldPrice = formatPropertyPrice(property.previousPriceValue!, property.type)
    ctx.fillStyle = style.mutedColor
    ctx.font = '22px Inter, Arial, sans-serif'
    const oldText = `De ${oldPrice}`
    ctx.fillText(oldText, x + pad, cursorY)
    const oldW = ctx.measureText(oldText).width
    ctx.strokeStyle = style.accentColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + pad, cursorY - 6)
    ctx.lineTo(x + pad + oldW, cursorY - 6)
    ctx.stroke()
    cursorY += 30
    ctx.fillStyle = style.accentColor
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.fillText('Por apenas', x + pad, cursorY)
    cursorY += 28
  }

  ctx.fillStyle = hasPriceDrop(property) ? style.accentColor : style.accentColor
  ctx.font = 'bold 44px Inter, Arial, sans-serif'
  ctx.fillText(property.price, x + pad, cursorY + 36)
  cursorY += 56

  // Specs
  const specs: string[] = []
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} quartos`)
  specs.push(`${property.bathrooms} banh.`)
  specs.push(`${property.area}m²`)
  if (property.parking > 0) specs.push(`${property.parking} vagas`)
  ctx.fillStyle = style.mutedColor
  ctx.font = '18px Inter, Arial, sans-serif'
  ctx.fillText(specs.join('  •  '), x + pad, cursorY + 16)

  // Rodapé fixo no painel
  const footerY = y + h - pad
  ctx.fillStyle = style.titleColor
  ctx.font = 'bold 20px Inter, Arial, sans-serif'
  const phone = site.phones[0] ?? ''
  ctx.fillText(`${site.shortName || site.name}  •  CRECI ${site.creci}`, x + pad, footerY - 18)
  if (phone) {
    ctx.fillStyle = style.mutedColor
    ctx.font = '18px Inter, Arial, sans-serif'
    ctx.fillText(phone, x + pad, footerY + 6)
  }
}

async function renderClassic(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
  logo: HTMLImageElement | null,
) {
  const photoH = H * 0.52
  drawPhotoGrid(ctx, photos, 0, 0, W, photoH)
  drawInfoPanel(ctx, property, site, logo, STYLES.classic, 0, photoH, W, H - photoH)
}

async function renderModern(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
  logo: HTMLImageElement | null,
) {
  const split = W * 0.5
  drawPhotoGrid(ctx, photos, 0, 0, split - 3, H)
  ctx.fillStyle = COLORS.blue
  ctx.fillRect(split - 3, 0, 6, H)
  drawInfoPanel(ctx, property, site, logo, STYLES.modern, split + 3, 0, W - split - 3, H)
}

async function renderBold(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
  logo: HTMLImageElement | null,
) {
  drawPhotoGrid(ctx, photos, 0, 0, W, H)
  const grad = ctx.createLinearGradient(0, H * 0.35, 0, H)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.55, 'rgba(0,0,0,0.55)')
  grad.addColorStop(1, 'rgba(185,28,28,0.95)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  drawInfoPanel(ctx, property, site, logo, STYLES.bold, 0, H * 0.42, W, H * 0.58)
}

async function renderMinimal(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
  logo: HTMLImageElement | null,
) {
  ctx.fillStyle = '#e5e7eb'
  ctx.fillRect(0, 0, W, H)
  const pad = 28
  ctx.fillStyle = COLORS.white
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 20)
  ctx.fill()
  const photoH = (H - pad * 2) * 0.48
  drawPhotoGrid(ctx, photos, pad + 16, pad + 16, W - pad * 2 - 32, photoH)
  drawInfoPanel(
    ctx,
    property,
    site,
    logo,
    STYLES.minimal,
    pad + 16,
    pad + 16 + photoH + 12,
    W - pad * 2 - 32,
    H - pad * 2 - photoH - 28,
  )
}

async function renderCollage(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
  logo: HTMLImageElement | null,
) {
  const photoH = H * 0.58
  drawPhotoGrid(ctx, photos, 0, 0, W, photoH)
  drawInfoPanel(ctx, property, site, logo, STYLES.collage, 0, photoH, W, H - photoH)
}

const RENDERERS: Record<
  BannerTemplateId,
  (
    ctx: CanvasRenderingContext2D,
    photos: HTMLImageElement[],
    property: Property,
    site: SiteConfig,
    logo: HTMLImageElement | null,
  ) => Promise<void>
> = {
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
}

export async function generateBannerBlob(input: BannerInput): Promise<Blob> {
  const selectedPhotos = input.photos.slice(0, MAX_BANNER_PHOTOS)
  if (selectedPhotos.length === 0) {
    throw new Error('Selecione pelo menos uma foto.')
  }

  const [images, logo] = await Promise.all([
    Promise.all(selectedPhotos.map(loadImage)),
    loadLogo(input.site),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não suportado neste navegador.')

  const templateId = input.templateId
  await RENDERERS[templateId](ctx, images, input.property, input.site, logo)

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
