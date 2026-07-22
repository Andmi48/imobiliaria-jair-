import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, Star, ArrowRight } from 'lucide-react'
import PropertyCard from './PropertyCard'
import ProtectedImage from './ProtectedImage'
import { useSiteContent } from '../context/SiteContentContext'
import { sortProperties, type Property } from '../data/properties'

const HOME_LIMIT_PER_TYPE = 3

function MainFeaturedCard({ property }: { property: Property }) {
  const cover = property.images?.[0] || property.image || ''
  return (
    <Link
      to={`/imovel/${property.id}`}
      className="group block relative overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-gray-100">
          <ProtectedImage
            src={cover}
            alt={property.title}
            wrapperClassName="absolute inset-0 w-full h-full"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-white bg-amber-500 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            Destaque
          </span>
          <span
            className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white bg-brand-blue"
          >
            {property.type}
          </span>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
            <span>{property.location} • {property.city}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
            {property.title}
          </h3>
          {property.description && (
            <p className="text-gray-600 mb-4 line-clamp-3">{property.description}</p>
          )}
          <p className="text-3xl font-extrabold text-brand-blue-dark mb-5">{property.price}</p>
          <div className="flex items-center gap-6 text-gray-600 text-sm mb-6">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <Bed className="w-5 h-5 text-brand-blue" />
                {property.bedrooms} quartos
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Bath className="w-5 h-5 text-brand-blue" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="w-5 h-5 text-brand-blue" />
              {property.area}m²
            </span>
          </div>
          <span className="inline-flex items-center gap-2 text-brand-blue font-semibold group-hover:gap-3 transition-all">
            Ver detalhes
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

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
  const mainFeatured = sorted.find((p) => p.mainFeatured)

  const onHome = sorted.filter((p) => (p.featured || p.mainFeatured) && p.id !== mainFeatured?.id)
  const pool = onHome.length > 0 ? onHome : sorted.filter((p) => p.id !== mainFeatured?.id)

  const vendaList = pool.filter((p) => p.type === 'Venda').slice(0, HOME_LIMIT_PER_TYPE)
  const aluguelList = pool.filter((p) => p.type !== 'Venda').slice(0, HOME_LIMIT_PER_TYPE)

  const hasAny = mainFeatured || vendaList.length > 0 || aluguelList.length > 0

  return (
    <section id="imoveis" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Destaques</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Os melhores imóveis selecionados para você.
          </p>
        </div>

        {!hasAny ? (
          <p className="text-center text-gray-500">Nenhum imóvel cadastrado no momento.</p>
        ) : (
          <>
            {mainFeatured && <MainFeaturedCard property={mainFeatured} />}

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
          </>
        )}
      </div>
    </section>
  )
}
