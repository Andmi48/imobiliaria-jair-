import { Link } from 'react-router-dom'
import PropertyCard from './PropertyCard'
import { useSiteContent } from '../context/SiteContentContext'

export default function Properties() {
  const { properties } = useSiteContent()
  const featured = properties.filter((p) => p.featured)

  return (
    <section id="imoveis" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Destaques
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Os melhores imóveis selecionados para você.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          <Link
            to="/venda"
            className="px-8 py-3 rounded-full text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue-dark transition-all"
          >
            Ver todos à venda
          </Link>
          <Link
            to="/aluguel"
            className="px-8 py-3 rounded-full text-sm font-semibold bg-brand-red text-white hover:bg-brand-red-dark transition-all"
          >
            Ver todos para alugar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
