import { WhatsAppIcon } from './SocialIcons'
import { useSiteContent } from '../context/SiteContentContext'

export default function WhatsAppButton() {
  const { site } = useSiteContent()
  const message = encodeURIComponent('Olá! Gostaria de mais informações sobre imóveis.')

  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8" />
    </a>
  )
}
