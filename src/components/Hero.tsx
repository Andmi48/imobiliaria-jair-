import { Search, MapPin, Building2, Key } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

export default function Hero() {
  const [searchType, setSearchType] = useState<'comprar' | 'alugar'>('comprar')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const { hero, propertyOptions } = useSiteContent()

  const handleSearch = () => {
    const path = searchType === 'comprar' ? '/venda' : '/aluguel'
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('categoria', category)
    const search = params.toString()
    navigate(search ? `${path}?${search}` : path)
  }

  const goToListings = (type: 'comprar' | 'alugar') => {
    navigate(type === 'comprar' ? '/venda' : '/aluguel')
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 hero-bg-animate bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${hero.backgroundImage})`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-dark/90 via-brand-blue/80 to-brand-blue-dark/70" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-red rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6 max-w-4xl mx-auto">
          {hero.welcomePrefix}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            {hero.welcomeHighlight}
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-12">{hero.subtitle}</p>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-blue-900/20 p-2 sm:p-3">
          <div className="flex gap-2 mb-3 px-2">
            <button
              type="button"
              onClick={() => setSearchType('comprar')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                searchType === 'comprar'
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setSearchType('alugar')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                searchType === 'alugar'
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Key className="w-4 h-4" />
              Alugar
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-brand-blue shrink-0" />
              <input
                type="text"
                placeholder="Cidade, bairro ou região..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <Building2 className="w-5 h-5 text-brand-blue shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 cursor-pointer"
              >
                <option value="">Tipo de imóvel</option>
                {propertyOptions.categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button
            type="button"
            onClick={() => goToListings('comprar')}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold transition-all"
          >
            Ver todos à venda
          </button>
          <button
            type="button"
            onClick={() => goToListings('alugar')}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold transition-all"
          >
            Ver todos para alugar
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
