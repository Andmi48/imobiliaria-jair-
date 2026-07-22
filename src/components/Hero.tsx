import { Search, MapPin, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

export default function Hero() {
  const [searchType, setSearchType] = useState<'comprar' | 'alugar'>('comprar')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const { hero, propertyOptions, site } = useSiteContent()

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
      className="relative min-h-screen flex items-end sm:items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 hero-bg-animate bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
      </div>
      <div className="absolute inset-0 bg-[#0b1220]/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/55 to-[#0b1220]/35" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:py-32">
        <div className="max-w-3xl mb-10 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/55 mb-4">
            {site.shortName || site.name}
            {site.creci ? ` · CRECI ${site.creci}` : ''}
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-semibold text-white leading-[1.12] tracking-tight mb-5">
            {hero.welcomePrefix}{' '}
            <span className="text-white/90">{hero.welcomeHighlight}</span>
          </h1>
          <p className="text-base sm:text-lg text-white/65 max-w-xl leading-relaxed">
            {hero.subtitle}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="flex border-b border-slate-200">
            {([
              { value: 'comprar' as const, label: 'Comprar' },
              { value: 'alugar' as const, label: 'Alugar' },
            ]).map((option) => {
              const active = searchType === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSearchType(option.value)}
                  className={`relative px-6 sm:px-8 py-3.5 text-sm font-semibold transition-colors ${
                    active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {option.label}
                  {active && (
                    <span className="absolute left-6 right-6 bottom-0 h-[2px] bg-slate-900" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto] divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <label className="flex items-center gap-3 px-4 sm:px-5 py-4 cursor-text">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.75} />
              <div className="min-w-0 flex-1 text-left">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold mb-1">
                  Localização
                </span>
                <input
                  type="text"
                  placeholder="Cidade, bairro ou região"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                />
              </div>
            </label>

            <label className="flex items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer">
              <div className="min-w-0 flex-1 text-left relative">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold mb-1">
                  Tipo de imóvel
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-transparent outline-none text-slate-800 text-sm cursor-pointer pr-6"
                >
                  <option value="">Todos os tipos</option>
                  {propertyOptions.categories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 bottom-0.5 pointer-events-none" />
              </div>
            </label>

            <div className="p-3 sm:p-3 flex">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors"
              >
                <Search className="w-4 h-4" strokeWidth={2} />
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => goToListings('comprar')}
              className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
            >
              Ver imóveis à venda
            </button>
            <button
              type="button"
              onClick={() => goToListings('alugar')}
              className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
            >
              Ver imóveis para alugar
            </button>
          </div>

          {hero.stats.length > 0 && (
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
