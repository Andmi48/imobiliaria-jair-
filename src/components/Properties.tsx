import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react'
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
      className="group block relative overflow-hidden mb-12 bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[320px] overflow-hidden bg-slate-100">
          <ProtectedImage
            src={cover}
            alt={property.title}
            wrapperClassName="absolute inset-0 w-full h-full"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-slate-900/85">
            Destaque · {property.type}
          </span>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span>
              {property.location} · {property.city}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 tracking-tight group-hover:text-slate-700 transition-colors">
            {property.title}
          </h3>
          {property.description && (
            <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed">{property.description}</p>
          )}
          <p className="text-2xl font-semibold text-slate-900 mb-5 tracking-tight">{property.price}</p>
          <div className="flex items-center gap-5 text-slate-500 text-xs mb-6">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" strokeWidth={1.75} />
                {property.bedrooms} quartos
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" strokeWidth={1.75} />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4" strokeWidth={1.75} />
              {property.area}m²
            </span>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
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
}: {
  title: string
  properties: Property[]
  linkTo: string
  linkLabel: string
}) {
  if (properties.length === 0) return null

  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-end justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="sm:hidden mt-5">
        <Link to={linkTo} className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" />
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
    <section id="imoveis" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12 max-w-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 mb-2">
            Seleção
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            Destaques
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Os melhores imóveis selecionados para você.
          </p>
        </div>

        {!hasAny ? (
          <p className="text-center text-slate-500">Nenhum imóvel cadastrado no momento.</p>
        ) : (
          <>
            {mainFeatured && <MainFeaturedCard property={mainFeatured} />}

            <TypeSection
              title="À venda"
              properties={vendaList}
              linkTo="/venda"
              linkLabel="Ver todos à venda"
            />

            <TypeSection
              title="Para alugar"
              properties={aluguelList}
              linkTo="/aluguel"
              linkLabel="Ver todos para alugar"
            />
          </>
        )}
      </div>
    </section>
  )
}
