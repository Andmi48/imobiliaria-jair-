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

export default function PropertyImageGallery({ images, title, type }: PropertyImageGalleryProps) {
  const validImages = images.filter((src) => src?.trim())
  const [index, setIndex] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [paused, setPaused] = useState(false)

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

  const openGallery = () => {
    setLightboxIndex(safeIndex)
    setGalleryOpen(true)
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
        className="relative rounded-site overflow-hidden mb-8 aspect-[16/9] bg-gray-100 group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
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
              onClick={prev}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex gap-2">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === safeIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Ir para foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <span
          className={`absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-sm font-bold text-white ${
            type === 'Venda' ? 'bg-brand-blue' : 'bg-brand-red'
          }`}
        >
          {type}
        </span>

        {validImages.length > 1 && (
          <button
            type="button"
            onClick={openGallery}
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-105"
          >
            <Grid3X3 className="w-4 h-4" />
            Ver todas ({validImages.length})
          </button>
        )}
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setGalleryOpen(false)}
            aria-hidden
          />

          <div className="relative w-full max-w-6xl max-h-[90vh]">
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Fechar galeria"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-white rounded-site overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/10] bg-gray-900">
                <GalleryImage
                  key={validImages[lightboxIndex]}
                  src={validImages[lightboxIndex]}
                  alt={`${title} - foto ${lightboxIndex + 1}`}
                  fit="contain"
                />
                {validImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((i) => (i - 1 + validImages.length) % validImages.length)
                      }
                      className="absolute left-4 top-1/2 z-20 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex((i) => (i + 1) % validImages.length)}
                      className="absolute right-4 top-1/2 z-20 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {validImages.length}
                </span>
              </div>

              <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {validImages.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      i === lightboxIndex
                        ? 'ring-2 ring-brand-blue scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover pointer-events-none select-none"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
