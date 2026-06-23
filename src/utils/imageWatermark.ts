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

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Falha ao carregar logo para marca dágua.'))
    img.src = url
  })
}

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  opacity: number,
) {
  const fontSize = Math.max(18, Math.round(Math.min(width, height) * 0.04))
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 2
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const stepX = fontSize * text.length * 0.55
  const stepY = fontSize * 3.5

  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((-28 * Math.PI) / 180)
      ctx.strokeText(text, 0, 0)
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
  const logoWidth = Math.min(width, height) * 0.22
  const logoHeight = (logo.height / logo.width) * logoWidth
  const stepX = logoWidth * 1.6
  const stepY = logoHeight * 2.2

  ctx.save()
  ctx.globalAlpha = opacity

  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      ctx.save()
      ctx.translate(x + logoWidth / 2, y + logoHeight / 2)
      ctx.rotate((-28 * Math.PI) / 180)
      ctx.drawImage(logo, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight)
      ctx.restore()
    }
  }

  // Logo central maior
  const centerW = Math.min(width, height) * 0.35
  const centerH = (logo.height / logo.width) * centerW
  ctx.globalAlpha = opacity * 0.85
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
      type === 'image/jpeg' ? 0.9 : undefined,
    )
  })
}

/** Aplica marca dágua com a logo (ou texto) e retorna novo arquivo pronto para upload. */
export async function applyWatermarkToFile(file: File, options: WatermarkOptions = {}): Promise<File> {
  const source = await loadImageFromFile(file)
  const opacity = options.opacity ?? 0.38
  const fallbackText = options.fallbackText?.trim() || 'Imóvel protegido'

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
      // usa texto se a logo não carregar
    }
  }

  if (!logoApplied) {
    drawTextWatermark(ctx, width, height, fallbackText, opacity)
  }

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const extension = outputType === 'image/png' ? 'png' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'foto'
  return canvasToFile(canvas, `${baseName}-protegida.${extension}`, outputType)
}
