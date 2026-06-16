import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { type PropertyType } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import { useSiteContent } from '../context/SiteContentContext'

interface ListingsPageProps {
  type: PropertyType
}

export default function ListingsPage({ type }: ListingsPageProps) {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const { properties } = useSiteContent()

  const filtered = useMemo(() => {
    let result = properties.filter((p) => p.type === type)

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      )
    }

    return result
  }, [type, query])

  const title = type === 'Venda' ? 'Imóveis à venda' : 'Imóveis para alugar'
  const subtitle =
    type === 'Venda'
      ? 'Todos os imóveis disponíveis para compra.'
      : 'Todos os imóveis disponíveis para locação.'

  return (
    <div className="pt-28 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-600 mb-6">{subtitle}</p>

          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 max-w-xl border border-gray-100 shadow-sm">
            <Search className="w-5 h-5 text-brand-blue shrink-0" />
            <input
              type="text"
              placeholder="Buscar por bairro ou cidade..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          {filtered.length} {filtered.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-20">Nenhum imóvel encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
