import type { Property } from '../data/properties'
import type { SiteConfig } from '../types/content'

export const MAX_BANNER_PHOTOS = 5

export type BannerTemplateId = 'classic' | 'modern' | 'bold' | 'minimal' | 'collage'

export const BANNER_TEMPLATES: Array<{
  id: BannerTemplateId
  name: string
  description: string
  usesMultiplePhotos: boolean
}> = [
  { id: 'classic', name: 'Clássico', description: 'Foto principal + faixa azul com preço', usesMultiplePhotos: false },
  { id: 'modern', name: 'Moderno', description: 'Foto à esquerda, dados à direita', usesMultiplePhotos: false },
  { id: 'bold', name: 'Impacto', description: 'Foto de fundo com faixa vermelha', usesMultiplePhotos: false },
  { id: 'minimal', name: 'Minimalista', description: 'Moldura branca elegante', usesMultiplePhotos: false },
  { id: 'collage', name: 'Colagem', description: 'Mosaico com até 5 fotos selecionadas', usesMultiplePhotos: true },
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

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Não foi possível processar uma das fotos selecionadas.'))
    img.src = src
  })
}

/** Carrega imagem via blob para evitar bloqueio CORS no canvas. */
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
    // Fallback: tenta carregar direto (funciona se CORS permitir)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = () =>
        reject(
          new Error(
            'Não foi possível carregar as fotos para o banner. Tente novamente ou use fotos enviadas pelo painel.',
          ),
        )
      img.src = url
    })
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

function drawFooter(ctx: CanvasRenderingContext2D, site: SiteConfig, y: number) {
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
  ctx.font = 'bold 40px Inter, Arial, sans-serif'
  const titleLines = wrapText(ctx, property.title, maxWidth)
  titleLines.slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, x, y + i * 46)
  })

  const locY = y + titleLines.slice(0, 2).length * 46 + 10
  ctx.font = '22px Inter, Arial, sans-serif'
  ctx.fillStyle = light ? 'rgba(255,255,255,0.85)' : COLORS.gray
  ctx.fillText(`${property.location} • ${property.city}`, x, locY)

  ctx.fillStyle = COLORS.red
  ctx.font = 'bold 48px Inter, Arial, sans-serif'
  ctx.fillText(property.price, x, locY + 58)

  ctx.fillStyle = light ? 'rgba(255,255,255,0.8)' : COLORS.gray
  ctx.font = '20px Inter, Arial, sans-serif'
  ctx.fillText(
    `${property.bedrooms} quartos • ${property.bathrooms} banh. • ${property.area}m²`,
    x,
    locY + 100,
  )
}

function drawCollagePhotos(ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], topH: number) {
  const gap = 6
  const n = photos.length

  if (n === 1) {
    drawCoverImage(ctx, photos[0], 0, 0, W, topH)
    return
  }

  if (n === 2) {
    const w = (W - gap) / 2
    drawCoverImage(ctx, photos[0], 0, 0, w, topH)
    drawCoverImage(ctx, photos[1], w + gap, 0, w, topH)
    return
  }

  if (n === 3) {
    drawCoverImage(ctx, photos[0], 0, 0, W * 0.62 - gap / 2, topH)
    const rightW = W * 0.38 - gap / 2
    const halfH = (topH - gap) / 2
    drawCoverImage(ctx, photos[1], W * 0.62 + gap / 2, 0, rightW, halfH)
    drawCoverImage(ctx, photos[2], W * 0.62 + gap / 2, halfH + gap, rightW, halfH)
    return
  }

  if (n === 4) {
    const w = (W - gap) / 2
    const h = (topH - gap) / 2
    drawCoverImage(ctx, photos[0], 0, 0, w, h)
    drawCoverImage(ctx, photos[1], w + gap, 0, w, h)
    drawCoverImage(ctx, photos[2], 0, h + gap, w, h)
    drawCoverImage(ctx, photos[3], w + gap, h + gap, w, h)
    return
  }

  // 5 fotos: 3 em cima, 2 embaixo
  const row1H = (topH - gap) * 0.58
  const row2H = topH - row1H - gap
  const w3 = (W - gap * 2) / 3
  drawCoverImage(ctx, photos[0], 0, 0, w3, row1H)
  drawCoverImage(ctx, photos[1], w3 + gap, 0, w3, row1H)
  drawCoverImage(ctx, photos[2], (w3 + gap) * 2, 0, w3, row1H)
  const w2 = (W - gap) / 2
  drawCoverImage(ctx, photos[3], 0, row1H + gap, w2, row2H)
  drawCoverImage(ctx, photos[4], w2 + gap, row1H + gap, w2, row2H)
}

async function renderClassic(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
) {
  drawCoverImage(ctx, photos[0], 0, 0, W, H * 0.62)
  ctx.fillStyle = COLORS.blueDark
  ctx.fillRect(0, H * 0.62, W, H * 0.38)
  drawPropertyInfo(ctx, property, 48, H * 0.62 + 64, W - 96, true)
  drawFooter(ctx, site, H - 48)
}

async function renderModern(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
) {
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

async function renderBold(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
) {
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

async function renderMinimal(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
) {
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

async function renderCollage(
  ctx: CanvasRenderingContext2D,
  photos: HTMLImageElement[],
  property: Property,
  site: SiteConfig,
) {
  const infoH = H * 0.32
  const photoAreaH = H - infoH - 8

  ctx.fillStyle = COLORS.blueDark
  ctx.fillRect(0, 0, W, photoAreaH)
  drawCollagePhotos(ctx, photos.slice(0, MAX_BANNER_PHOTOS), photoAreaH)

  ctx.fillStyle = COLORS.red
  ctx.fillRect(0, photoAreaH + 8, W, infoH - 8)
  drawPropertyInfo(ctx, property, 48, photoAreaH + 56, W - 96, true)
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
  const photoCount = template.usesMultiplePhotos
    ? Math.min(input.photos.length, MAX_BANNER_PHOTOS)
    : 1

  const selectedPhotos = input.photos.slice(0, photoCount)
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
        else reject(new Error('Falha ao gerar imagem do banner. Tente com menos fotos ou outro modelo.'))
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
