import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bath, Bed, MapPin, Maximize } from 'lucide-react'
import ProtectedImage from './ProtectedImage'
import { useSiteContent } from '../context/SiteContentContext'
import { sortProperties, type Property } from '../data/properties'

const AUTOPLAY_MS = 6500

function Slide({ property }: { property: Property }) {
  const cover = property.images?.[0] || property.image || ''

  return (
    <Link
      to={`/imovel/${property.id}`}
      className="group grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden rounded-md border border-gray-100 shadow-sm h-full"
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-gray-100">
        <ProtectedImage
          src={cover}
          alt={property.title}
          wrapperClassName="absolute inset-0 w-full h-full"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
        <span
          className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white ${
            property.type === 'Venda' ? 'bg-brand-blue' : 'bg-brand-red'
          }`}
        >
          {property.type}
        </span>
      </div>

      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
          <span>
            {property.location}
            {property.city ? ` · ${property.city}` : ''}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors leading-snug">
          {property.title}
        </h3>

        {property.description ? (
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
            {property.description}
          </p>
        ) : null}

        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 tracking-tight">
          {property.price}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm mb-6">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-brand-blue" />
              {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-brand-blue" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-brand-blue" />
            {property.area}m²
          </span>
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
          Ver detalhes
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export default function FeaturedCarousel() {
  const { properties } = useSiteContent()
  const featured = sortProperties(
    properties.filter((p) => p.featured || p.mainFeatured),
  )

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = featured.length

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  useEffect(() => {
    setIndex(0)
  }, [count])

  useEffect(() => {
    if (count <= 1 || paused) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [count, paused])

  if (count === 0) return null

  return (
    <section
      id="destaques"
      className="py-16 sm:py-20 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Destaques</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Os melhores imóveis selecionados para você.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-md">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {featured.map((property) => (
                <div key={property.id} className="w-full shrink-0 px-0.5">
                  <Slide property={property} />
                </div>
              ))}
            </div>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-white border border-gray-200 shadow-md text-gray-700 hover:text-brand-blue hover:border-brand-blue/40 flex items-center justify-center transition-colors"
                aria-label="Imóvel anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-white border border-gray-200 shadow-md text-gray-700 hover:text-brand-blue hover:border-brand-blue/40 flex items-center justify-center transition-colors"
                aria-label="Próximo imóvel"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-6">
                {featured.map((property, i) => (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-8 bg-brand-blue' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para destaque ${i + 1}`}
                    aria-current={i === index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
