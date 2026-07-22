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

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:py-28">
        <div className="max-w-2xl mb-8 sm:mb-9">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 mb-3">
            {site.shortName || site.name}
            {site.creci ? ` · CRECI ${site.creci}` : ''}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-[1.15] tracking-tight mb-4">
            {hero.welcomePrefix}{' '}
            <span className="text-white/90">{hero.welcomeHighlight}</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
            {hero.subtitle}
          </p>
        </div>

        <div className="max-w-3xl bg-white/95 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-1 px-3 sm:px-4 pt-2.5">
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
                  className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {option.label}
                  {active && (
                    <span className="absolute left-3.5 right-3.5 bottom-0 h-px bg-slate-900" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_auto] items-stretch border-t border-slate-100">
            <label className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 cursor-text sm:border-r border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Cidade, bairro ou região"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-[13px]"
              />
            </label>

            <label className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 cursor-pointer relative sm:border-r border-slate-100">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-transparent outline-none text-slate-800 text-[13px] cursor-pointer pr-5"
              >
                <option value="">Tipo de imóvel</option>
                {propertyOptions.categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 pointer-events-none" />
            </label>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 text-[13px] font-medium transition-colors"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={2} />
              Buscar
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <button
              type="button"
              onClick={() => goToListings('comprar')}
              className="text-white/70 hover:text-white transition-colors"
            >
              Imóveis à venda
            </button>
            <span className="text-white/25">|</span>
            <button
              type="button"
              onClick={() => goToListings('alugar')}
              className="text-white/70 hover:text-white transition-colors"
            >
              Imóveis para alugar
            </button>
          </div>

          {hero.stats.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-lg font-semibold text-white tracking-tight">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-white/40 mt-0.5">
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
