import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  address: string
  title?: string
}

/** Mapa incorporado do Google Maps (sem necessidade de chave de API). */
export default function PropertyMap({ address, title }: PropertyMapProps) {
  const query = address.trim()
  if (!query) return null

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&hl=pt-BR&output=embed`
  const linkSrc = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-3">Localização</h2>
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
        <span>{query}</span>
      </div>

      <div className="relative rounded-site overflow-hidden border border-gray-200 shadow-sm">
        <iframe
          title={title ? `Mapa de ${title}` : 'Mapa do imóvel'}
          src={embedSrc}
          className="w-full h-72 sm:h-96"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <a
        href={linkSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
      >
        <MapPin className="w-4 h-4" />
        Ver no Google Maps
      </a>

      <p className="text-xs text-gray-400 mt-2">
        A localização exibida é aproximada, apenas para referência da região.
      </p>
    </div>
  )
}
