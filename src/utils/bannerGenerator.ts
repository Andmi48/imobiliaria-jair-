import type { Property } from '../data/properties'
import type { SiteConfig } from '../types/content'

export type BannerTemplateId = 'classic' | 'modern' | 'bold' | 'minimal' | 'collage'

export const BANNER_TEMPLATES: Array<{
  id: BannerTemplateId
  name: string
  description: string
  maxPhotos: number
}> = [
  { id: 'classic', name: 'Clássico', description: 'Foto grande com faixa azul e preço em destaque', maxPhotos: 1 },
  { id: 'modern', name: 'Moderno', description: 'Foto à esquerda, informações à direita', maxPhotos: 1 },
  { id: 'bold', name: 'Impacto', description: 'Faixa vermelha com preço em evidência', maxPhotos: 1 },
  { id: 'minimal', name: 'Minimalista', description: 'Borda branca elegante e texto discreto', maxPhotos: 1 },
  { id: 'collage', name: 'Colagem', description: 'Até 3 fotos em mosaico', maxPhotos: 3 },
]

const W = 1080
const H = 1080

const COLORS = {
  blue: '#1e40af',
  blueDark: '#1e3a8a',
  red: '#dc2626',
  white: '#ffffff',
  gray: '#6b7280',
  dark: '#111827',
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Não foi possível carregar a imagem: ${url}`))
    img.src = url
  })
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
  const words = text.split(' ')
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

function drawFooter(
  ctx: CanvasRenderingContext2D,
  site: SiteConfig,
  y: number,
) {
  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 28px Inter, Arial, sans-serif'
  ctx.fillText(site.shortName || site.name, 48, y)
  ctx.font = '22px Inter, Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  const phone = site.phones[0] ?? ''
  ctx.fillText(`CRECI ${site.creci}${phone ? ` • ${phone}` : ''}`, 48, y + 36)
}

function drawPropertyInfo(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  maxWidth: number,
  light = false,
) {
  ctx.fillStyle = light ? COLORS.white : COLORS.dark
  ctx.font = 'bold 42px Inter, Arial, sans-serif'
  const titleLines = wrapText(ctx, property.title, maxWidth)
  titleLines.slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, x, y + i * 48)
  })

  const locY = y + titleLines.slice(0, 2).length * 48 + 12
  ctx.font = '24px Inter, Arial, sans-serif'
  ctx.fillStyle = light ? 'rgba(255,255,255,0.85)' : COLORS.gray
  ctx.fillText(`${property.location} • ${property.city}`, x, locY)

  ctx.fillStyle = COLORS.red
  ctx.font = 'bold 52px Inter, Arial, sans-serif'
  ctx.fillText(property.price, x, locY + 64)

  ctx.fillStyle = light ? 'rgba(255,255,255,0.8)' : COLORS.gray
  ctx.font = '22px Inter, Arial, sans-serif'
  ctx.fillText(
    `${property.bedrooms} quartos • ${property.bathrooms} banh. • ${property.area}m²`,
    x,
    locY + 110,
  )
}

async function renderClassic(ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], property: Property, site: SiteConfig) {
  drawCoverImage(ctx, photos[0], 0, 0, W, H * 0.62)
  ctx.fillStyle = COLORS.blueDark
  ctx.fillRect(0, H * 0.62, W, H * 0.38)
  drawPropertyInfo(ctx, property, 48, H * 0.62 + 72, W - 96, true)
  drawFooter(ctx, site, H - 48)
}

async function renderModern(ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], property: Property, site: SiteConfig) {
  ctx.fillStyle = COLORS.white
  ctx.fillRect(0, 0, W, H)
  drawCoverImage(ctx, photos[0], 0, 0, W * 0.52, H)
  ctx.fillStyle = COLORS.blue
  ctx.fillRect(W * 0.52, 0, W * 0.48, 12)
  drawPropertyInfo(ctx, property, W * 0.52 + 40, 120, W * 0.48 - 80)
  ctx.fillStyle = COLORS.red
  ctx.font = 'bold 20px Inter, Arial, sans-serif'
  ctx.fillText(property.type.toUpperCase(), W * 0.52 + 40, 80)
  ctx.fillStyle = COLORS.dark
  ctx.font = 'bold 26px Inter, Arial, sans-serif'
  ctx.fillText(site.shortName || site.name, W * 0.52 + 40, H - 80)
  ctx.font = '20px Inter, Arial, sans-serif'
  ctx.fillStyle = COLORS.gray
  ctx.fillText(`CRECI ${site.creci}`, W * 0.52 + 40, H - 44)
}

async function renderBold(ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], property: Property, site: SiteConfig) {
  drawCoverImage(ctx, photos[0], 0, 0, W, H)
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = COLORS.red
  ctx.fillRect(0, H - 320, W, 320)
  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 58px Inter, Arial, sans-serif'
  ctx.fillText(property.price, 48, H - 220)
  ctx.font = 'bold 36px Inter, Arial, sans-serif'
  const titleLines = wrapText(ctx, property.title, W - 96)
  ctx.fillText(titleLines[0] ?? property.title, 48, H - 160)
  ctx.font = '22px Inter, Arial, sans-serif'
  ctx.fillText(`${property.location} • ${property.type}`, 48, H - 110)
  ctx.font = 'bold 24px Inter, Arial, sans-serif'
  ctx.fillText(site.shortName || site.name, 48, H - 56)
}

async function renderMinimal(ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], property: Property, site: SiteConfig) {
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, W, H)
  const pad = 40
  ctx.fillStyle = COLORS.white
  ctx.fillRect(pad, pad, W - pad * 2, H - pad * 2)
  drawCoverImage(ctx, photos[0], pad + 24, pad + 24, W - pad * 2 - 48, H * 0.55)
  drawPropertyInfo(ctx, property, pad + 48, H * 0.55 + pad + 48, W - pad * 2 - 96)
  ctx.fillStyle = COLORS.blue
  ctx.font = 'bold 22px Inter, Arial, sans-serif'
  ctx.fillText(site.shortName || site.name, pad + 48, H - pad - 48)
  ctx.fillStyle = COLORS.gray
  ctx.font = '18px Inter, Arial, sans-serif'
  ctx.fillText(`CRECI ${site.creci}`, pad + 48, H - pad - 20)
}

async function renderCollage(ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], property: Property, site: SiteConfig) {
  ctx.fillStyle = COLORS.blueDark
  ctx.fillRect(0, 0, W, H)
  if (photos.length >= 3) {
    drawCoverImage(ctx, photos[0], 0, 0, W * 0.6, H * 0.65)
    drawCoverImage(ctx, photos[1], W * 0.6, 0, W * 0.4, H * 0.32)
    drawCoverImage(ctx, photos[2], W * 0.6, H * 0.32, W * 0.4, H * 0.33)
  } else if (photos.length === 2) {
    drawCoverImage(ctx, photos[0], 0, 0, W * 0.5, H * 0.65)
    drawCoverImage(ctx, photos[1], W * 0.5, 0, W * 0.5, H * 0.65)
  } else {
    drawCoverImage(ctx, photos[0], 0, 0, W, H * 0.65)
  }
  ctx.fillStyle = COLORS.red
  ctx.fillRect(0, H * 0.65, W, H * 0.35)
  drawPropertyInfo(ctx, property, 48, H * 0.65 + 60, W - 96, true)
  ctx.font = 'bold 22px Inter, Arial, sans-serif'
  ctx.fillStyle = COLORS.white
  ctx.fillText(site.shortName || site.name, 48, H - 36)
}

const RENDERERS: Record<
  BannerTemplateId,
  (ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], property: Property, site: SiteConfig) => Promise<void>
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
  const template = BANNER_TEMPLATES.find((t) => t.id === input.templateId) ?? BANNER_TEMPLATES[0]
  const selectedPhotos = input.photos.slice(0, template.maxPhotos)
  if (selectedPhotos.length === 0) {
    throw new Error('Selecione pelo menos uma foto.')
  }

  const images = await Promise.all(selectedPhotos.map(loadImage))

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não suportado neste navegador.')

  await RENDERERS[input.templateId](ctx, images, input.property, input.site)

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
