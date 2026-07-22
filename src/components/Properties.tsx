import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PropertyCard from './PropertyCard'
import { useSiteContent } from '../context/SiteContentContext'
import { sortProperties, type Property } from '../data/properties'

const HOME_LIMIT_PER_TYPE = 3

function TypeSection({
  title,
  properties,
  linkTo,
  linkLabel,
  accent,
}: {
  title: string
  properties: Property[]
  linkTo: string
  linkLabel: string
  accent: 'blue' | 'red'
}) {
  if (properties.length === 0) return null

  return (
    <div className="mb-14 last:mb-0">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-7 rounded-full ${accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-red'}`} />
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <Link
          to={linkTo}
          className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold ${
            accent === 'blue' ? 'text-brand-blue hover:text-brand-blue-dark' : 'text-brand-red hover:text-brand-red-dark'
          }`}
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="sm:hidden mt-6">
        <Link
          to={linkTo}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
            accent === 'blue' ? 'text-brand-blue' : 'text-brand-red'
          }`}
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function Properties() {
  const { properties } = useSiteContent()

  const sorted = sortProperties(properties)
  const carouselIds = new Set(
    sorted.filter((p) => p.featured || p.mainFeatured).map((p) => p.id),
  )

  // Home grids: demais imóveis (os de destaque ficam no carrossel)
  const pool = sorted.filter((p) => !carouselIds.has(p.id))
  const fallback = pool.length > 0 ? pool : sorted

  const vendaList = fallback.filter((p) => p.type === 'Venda').slice(0, HOME_LIMIT_PER_TYPE)
  const aluguelList = fallback.filter((p) => p.type !== 'Venda').slice(0, HOME_LIMIT_PER_TYPE)

  if (vendaList.length === 0 && aluguelList.length === 0) return null

  return (
    <section id="imoveis" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TypeSection
          title="À venda"
          properties={vendaList}
          linkTo="/venda"
          linkLabel="Ver todos à venda"
          accent="blue"
        />

        <TypeSection
          title="Para alugar"
          properties={aluguelList}
          linkTo="/aluguel"
          linkLabel="Ver todos para alugar"
          accent="red"
        />
      </div>
    </section>
  )
}
