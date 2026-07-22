import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Home, Phone, MapPin } from 'lucide-react'
import SocialLinks from './SocialLinks'
import { WhatsAppIcon } from './SocialIcons'
import { useSiteContent } from '../context/SiteContentContext'

function isWhatsAppPhone(phone: string, whatsappNumber: string) {
  const digits = phone.replace(/\D/g, '')
  return digits === whatsappNumber.slice(2) || whatsappNumber.endsWith(digits)
}

function FooterColumn({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col min-w-0 ${className}`}>
      {title && (
        <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default function Footer() {
  const { site } = useSiteContent()

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 items-start">
          <FooterColumn>
            <div className="flex items-start gap-3">
              <Link
                to="/"
                className="w-10 h-10 bg-[#0c1a2e] border border-gray-700 rounded-lg flex items-center justify-center shrink-0 group"
                aria-label="Página inicial"
              >
                <Home className="w-5 h-5 text-white group-hover:text-brand-blue-light transition-colors" />
              </Link>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold mb-3">Consultores Imobiliário:</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-white text-sm leading-snug">Jair A Costa</p>
                    <p className="text-sm text-gray-500 mt-1">CRECI: {site.creci || '19738-7'}</p>
                  </div>
                  <div className="border-t border-gray-800 pt-3">
                    <p className="font-semibold text-white text-sm leading-snug">André Tadeu da S. Costa</p>
                    <p className="text-sm text-gray-500 mt-1">CRECI: 90092</p>
                  </div>
                </div>
              </div>
            </div>
          </FooterColumn>

          <FooterColumn title="Endereço">
            <div className="flex gap-3 text-sm leading-relaxed">
              <MapPin className="w-4 h-4 text-white shrink-0 mt-1" />
              <address className="not-italic">
                {site.address.street}
                <br />
                {site.address.city}
              </address>
            </div>
          </FooterColumn>

          <FooterColumn title="Contato">
            <ul className="space-y-3 text-sm">
              {site.phones.map((phone) => {
                const whatsapp = isWhatsAppPhone(phone, site.whatsapp)

                return (
                  <li key={phone}>
                    <a
                      href={
                        whatsapp
                          ? `https://wa.me/${site.whatsapp}`
                          : `tel:${phone.replace(/\D/g, '')}`
                      }
                      target={whatsapp ? '_blank' : undefined}
                      rel={whatsapp ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 hover:text-white transition-colors"
                    >
                      {whatsapp ? (
                        <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                      ) : (
                        <Phone className="w-4 h-4 text-white shrink-0" />
                      )}
                      {phone}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5">
              <SocialLinks variant="dark" />
            </div>
          </FooterColumn>

          <FooterColumn title="Links">
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/politica-de-cookies" className="hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/isencao-de-responsabilidade" className="hover:text-white transition-colors">
                  Isenção de responsabilidade
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/acesso" className="hover:text-white transition-colors block">
                  Acesso
                </Link>
              </li>
            </ul>
          </FooterColumn>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500 space-y-2">
          <p>&copy; 2025 {site.name}. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{' '}
            <a
              href="https://jmaconnect.meuacessopro.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              JMA Connect
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
