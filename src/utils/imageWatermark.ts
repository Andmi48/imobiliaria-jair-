export interface WatermarkOptions {
  logoUrl?: string
  fallbackText?: string
  opacity?: number
}

const MAX_DIMENSION = 2400

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Falha ao ler a imagem.'))
    }
    img.src = url
  })
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Falha ao carregar imagem.'))
    img.src = src
  })
}

async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
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
      img.onerror = () => reject(new Error('Falha ao carregar logo.'))
      img.src = url
    })
  }
}

/** Uma única logo centralizada, semitransparente */
function drawCenteredLogoWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  logo: HTMLImageElement,
  opacity: number,
) {
  const maxW = Math.min(width, height) * 0.38
  const logoW = maxW
  const logoH = (logo.height / logo.width) * logoW
  const x = (width - logoW) / 2
  const y = (height - logoH) / 2

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.drawImage(logo, x, y, logoW, logoH)
  ctx.restore()
}

/** Texto único centralizado quando não há logo */
function drawCenteredTextWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  opacity: number,
) {
  const fontSize = Math.max(20, Math.round(Math.min(width, height) * 0.04))
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.6})`
  ctx.lineWidth = 2
  ctx.strokeText(text, width / 2, height / 2)
  ctx.fillText(text, width / 2, height / 2)
  ctx.restore()
}

function canvasToFile(canvas: HTMLCanvasElement, fileName: string, type: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Falha ao processar imagem com marca dágua.'))
          return
        }
        resolve(new File([blob], fileName, { type }))
      },
      type,
      type === 'image/jpeg' ? 0.92 : undefined,
    )
  })
}

/** Aplica uma marca d'água discreta no centro da foto (logo ou texto). */
export async function applyWatermarkToFile(file: File, options: WatermarkOptions = {}): Promise<File> {
  const source = await loadImageFromFile(file)
  const opacity = options.opacity ?? 0.22
  const fallbackText = options.fallbackText?.trim() || 'Jair A Costa'

  let width = source.width
  let height = source.height
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não suportado.')

  ctx.drawImage(source, 0, 0, width, height)

  if (options.logoUrl?.trim()) {
    try {
      const logo = await loadImageFromUrl(options.logoUrl.trim())
      drawCenteredLogoWatermark(ctx, width, height, logo, opacity)
    } catch {
      drawCenteredTextWatermark(ctx, width, height, fallbackText, opacity)
    }
  } else {
    drawCenteredTextWatermark(ctx, width, height, fallbackText, opacity)
  }

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const extension = outputType === 'image/png' ? 'png' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'foto'
  return canvasToFile(canvas, `${baseName}-protegida.${extension}`, outputType)
}
