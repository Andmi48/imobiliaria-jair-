import { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react'
import type { PropertyType } from '../data/properties'
import ProtectedImage from './ProtectedImage'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
  type: PropertyType
}

function GalleryImage({
  src,
  alt,
  className = 'object-cover',
  fit = 'cover',
}: {
  src: string
  alt: string
  className?: string
  fit?: 'cover' | 'contain'
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setFailed(false)
    }
  }, [src])

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Foto indisponível
      </div>
    )
  }

  return (
    <ProtectedImage
      src={src}
      alt={alt}
      wrapperClassName="absolute inset-0 w-full h-full"
      className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      decoding="async"
      loading="eager"
      onError={() => setFailed(true)}
      ref={imgRef}
    />
  )
}

const SWIPE_THRESHOLD = 50

export default function PropertyImageGallery({ images, title, type }: PropertyImageGalleryProps) {
  const validImages = images.filter((src) => src?.trim())
  const [index, setIndex] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  const safeIndex = validImages.length > 0 ? index % validImages.length : 0
  const currentSrc = validImages[safeIndex] ?? ''

  const next = useCallback(() => {
    if (validImages.length <= 1) return
    setIndex((i) => (i + 1) % validImages.length)
  }, [validImages.length])

  const prev = useCallback(() => {
    if (validImages.length <= 1) return
    setIndex((i) => (i - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  const lightboxNext = useCallback(() => {
    if (validImages.length <= 1) return
    setLightboxIndex((i) => (i + 1) % validImages.length)
  }, [validImages.length])

  const lightboxPrev = useCallback(() => {
    if (validImages.length <= 1) return
    setLightboxIndex((i) => (i - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  useEffect(() => {
    validImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [validImages])

  useEffect(() => {
    if (validImages.length <= 1 || paused || galleryOpen) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [validImages.length, paused, galleryOpen, next])

  useEffect(() => {
    if (galleryOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [galleryOpen])

  useEffect(() => {
    if (index >= validImages.length) setIndex(0)
  }, [index, validImages.length])

  useEffect(() => {
    if (!galleryOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGalleryOpen(false)
      if (event.key === 'ArrowRight') lightboxNext()
      if (event.key === 'ArrowLeft') lightboxPrev()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [galleryOpen, lightboxNext, lightboxPrev])

  const openGallery = (atIndex = safeIndex) => {
    setLightboxIndex(atIndex)
    setGalleryOpen(true)
  }

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    touchDeltaX.current = 0
  }

  const onTouchMove = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return
    touchDeltaX.current = (event.touches[0]?.clientX ?? 0) - touchStartX.current
  }

  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) >= SWIPE_THRESHOLD) {
      if (touchDeltaX.current < 0) lightboxNext()
      else lightboxPrev()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  if (validImages.length === 0) {
    return (
      <div className="relative rounded-site overflow-hidden mb-8 aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400">
        Sem fotos disponíveis
      </div>
    )
  }

  return (
    <>
      <div
        className="relative rounded-site overflow-hidden mb-8 aspect-[16/9] bg-gray-100 group cursor-zoom-in"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => openGallery(safeIndex)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openGallery(safeIndex)
          }
        }}
        aria-label="Ampliar fotos do imóvel"
      >
        <GalleryImage
          key={currentSrc}
          src={currentSrc}
          alt={`${title} - foto ${safeIndex + 1}`}
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                prev()
              }}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                next()
              }}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex gap-2 pointer-events-none">
              {validImages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === safeIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <span
          className={`absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-sm font-bold text-white pointer-events-none ${
            type === 'Venda' ? 'bg-brand-blue' : 'bg-brand-red'
          }`}
        >
          {type}
        </span>

        {validImages.length > 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openGallery(safeIndex)
            }}
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all"
          >
            <Grid3X3 className="w-4 h-4" />
            {validImages.length} fotos
          </button>
        )}
      </div>

      {galleryOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos ampliada"
        >
          <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-3 sm:px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-gradient-to-b from-black/70 to-transparent">
            <p className="text-white/90 text-sm font-medium tabular-nums">
              {lightboxIndex + 1} / {validImages.length}
            </p>
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
              aria-label="Fechar galeria"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative flex-1 min-h-0 flex items-center justify-center touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => setGalleryOpen(false)}
          >
            <div
              className="relative w-full h-full max-h-[100dvh]"
              onClick={(event) => event.stopPropagation()}
            >
              <GalleryImage
                key={validImages[lightboxIndex]}
                src={validImages[lightboxIndex]}
                alt={`${title} - foto ${lightboxIndex + 1}`}
                fit="contain"
              />
            </div>

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    lightboxPrev()
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 z-30 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    lightboxNext()
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 z-30 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {validImages.length > 1 && (
            <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-none pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-8 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex justify-center gap-1.5 px-4">
                {validImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === lightboxIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-white/70 text-xs sm:hidden">
                Deslize para o lado para ver mais fotos
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
