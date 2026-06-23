import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react'
import type { PropertyType } from '../data/properties'
import ProtectedImage from './ProtectedImage'

interface PropertyImageGalleryProps {
  images: string[]
  title: string
  type: PropertyType
}

export default function PropertyImageGallery({ images, title, type }: PropertyImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1 || paused || galleryOpen) return

    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [images.length, paused, galleryOpen, next])

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

  const openGallery = () => {
    setLightboxIndex(index)
    setGalleryOpen(true)
  }

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-gray-100 group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((src, i) => (
          <ProtectedImage
            key={src}
            src={src}
            alt={`${title} - foto ${i + 1}`}
            wrapperClassName={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            className="w-full h-full object-cover"
          />
        ))}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <span
          className={`absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full text-sm font-bold text-white ${
            type === 'Venda' ? 'bg-brand-blue' : 'bg-brand-red'
          }`}
        >
          {type}
        </span>

        {images.length > 1 && (
          <button
            type="button"
            onClick={openGallery}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-105"
          >
            <Grid3X3 className="w-4 h-4" />
            Ver todas
          </button>
        )}
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md gallery-backdrop-enter"
            onClick={() => setGalleryOpen(false)}
            aria-hidden
          />

          <div className="relative w-full max-w-6xl max-h-[90vh] gallery-panel-enter">
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Fechar galeria"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/10] bg-gray-900">
                <ProtectedImage
                  key={lightboxIndex}
                  src={images[lightboxIndex]}
                  alt={`${title} - foto ${lightboxIndex + 1}`}
                  wrapperClassName="w-full h-full gallery-image-enter"
                  className="w-full h-full object-contain"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((i) => (i - 1 + images.length) % images.length)
                      }
                      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex((i) => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </div>

              <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      i === lightboxIndex
                        ? 'ring-2 ring-brand-blue scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProtectedImage src={src} alt="" wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
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
