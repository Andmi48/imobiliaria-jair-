import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

const navLinks = [
  { href: '/#inicio', label: 'Início' },
  { href: '/#imoveis', label: 'Imóveis' },
  { href: '/venda', label: 'Venda', isRoute: true },
  { href: '/aluguel', label: 'Aluguel', isRoute: true },
  { href: '/#sobre', label: 'Sobre' },
]

export default function Navbar() {
  const { site } = useSiteContent()
  const [isOpen, setIsOpen] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const location = useLocation()
  const logoSrc = site.logoUrl || '/logo.png'

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    setLogoFailed(false)
  }, [logoSrc])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg shadow-blue-900/5 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="shrink-0 group" aria-label="Jair A Costa Consultor Imobiliário">
            {logoFailed ? (
              <div className="leading-tight text-brand-blue">
                <p className="text-base sm:text-lg font-bold">Jair A Costa</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Consultor Imobiliário</p>
              </div>
            ) : (
              <img
                src={logoSrc}
                alt="Jair A Costa - Corretor de Imóveis / Consultor Imobiliário"
                onError={() => setLogoFailed(true)}
                className="h-14 sm:h-[72px] w-auto max-w-[240px] sm:max-w-[320px] object-contain object-left group-hover:opacity-95 transition-opacity"
              />
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-red text-gray-700 ${
                    location.pathname === link.href ? 'text-brand-red' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-brand-red text-gray-700"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href="/#contato"
              className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            >
              <Phone className="w-4 h-4" />
              Contato
            </a>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-gray-700 font-medium hover:text-brand-red transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-700 font-medium hover:text-brand-red transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href="/#contato"
              className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-5 py-3 rounded-full text-sm font-semibold transition-all"
            >
              <Phone className="w-4 h-4" />
              Contato
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
