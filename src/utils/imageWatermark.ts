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

/** Carrega URL via blob — evita bloqueio CORS (logo do Supabase). */
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

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  opacity: number,
) {
  const fontSize = Math.max(22, Math.round(Math.min(width, height) * 0.045))
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const stepX = fontSize * Math.max(text.length * 0.45, 8)
  const stepY = fontSize * 3.2

  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((-30 * Math.PI) / 180)
      ctx.lineWidth = 3
      ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.7})`
      ctx.strokeText(text, 0, 0)
      ctx.fillStyle = `rgba(255,255,255,${opacity + 0.15})`
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawLogoWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  logo: HTMLImageElement,
  opacity: number,
) {
  const tileW = Math.min(width, height) * 0.26
  const tileH = (logo.height / logo.width) * tileW
  const stepX = tileW * 1.5
  const stepY = tileH * 2

  ctx.save()
  ctx.globalAlpha = opacity

  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      ctx.save()
      ctx.translate(x + tileW / 2, y + tileH / 2)
      ctx.rotate((-30 * Math.PI) / 180)
      // Sombra para contraste em fotos claras e escuras
      ctx.shadowColor = 'rgba(0,0,0,0.45)'
      ctx.shadowBlur = 8
      ctx.drawImage(logo, -tileW / 2, -tileH / 2, tileW, tileH)
      ctx.restore()
    }
  }

  // Logo central grande
  const centerW = Math.min(width, height) * 0.42
  const centerH = (logo.height / logo.width) * centerW
  ctx.globalAlpha = Math.min(opacity + 0.12, 0.75)
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 16
  ctx.drawImage(logo, (width - centerW) / 2, (height - centerH) / 2, centerW, centerH)

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

/** Aplica marca dágua com a logo (ou texto) e retorna novo arquivo pronto para upload. */
export async function applyWatermarkToFile(file: File, options: WatermarkOptions = {}): Promise<File> {
  const source = await loadImageFromFile(file)
  const opacity = options.opacity ?? 0.55
  const fallbackText = options.fallbackText?.trim() || 'Jair A Costa • Imóvel protegido'

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

  let logoApplied = false
  if (options.logoUrl?.trim()) {
    try {
      const logo = await loadImageFromUrl(options.logoUrl.trim())
      drawLogoWatermark(ctx, width, height, logo, opacity)
      logoApplied = true
    } catch {
      // continua com texto
    }
  }

  // Sempre aplica texto (reforço mesmo com logo)
  drawTextWatermark(ctx, width, height, fallbackText, logoApplied ? opacity * 0.45 : opacity)

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const extension = outputType === 'image/png' ? 'png' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'foto'
  return canvasToFile(canvas, `${baseName}-protegida.${extension}`, outputType)
}
