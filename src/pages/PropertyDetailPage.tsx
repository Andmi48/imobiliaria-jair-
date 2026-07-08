import { Link, useParams, Navigate } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, Phone, Car, ArrowLeft } from 'lucide-react'
import { WhatsAppIcon } from '../components/SocialIcons'
import { buildPropertyWhatsAppUrl } from '../utils/whatsapp'
import PropertyImageGallery from '../components/PropertyImageGallery'
import PropertyMap from '../components/PropertyMap'
import { useSiteContent } from '../context/SiteContentContext'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { getPropertyById, site } = useSiteContent()
  const property = getPropertyById(Number(id))

  if (!property) {
    return <Navigate to="/" replace />
  }

  const images = (property.images.length > 0 ? property.images : [property.image]).filter(
    (src) => src?.trim(),
  )
  const backLink = property.type === 'Venda' ? '/venda' : '/aluguel'

  return (
    <div className="pt-20 pb-24 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-blue font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para {property.type === 'Venda' ? 'vendas' : 'aluguéis'}
        </Link>

        <PropertyImageGallery images={images} title={property.title} type={property.type} />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MapPin className="w-4 h-4 text-brand-blue" />
              {property.location}
            </div>
            <p className="text-sm text-gray-400 mb-2">Código: #{property.id}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {property.title}
            </h1>
            <p className="text-3xl font-extrabold text-brand-red">{property.price}</p>
            {property.condo && (
              <p className="text-gray-500 mt-1">Condomínio: {property.condo}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={buildPropertyWhatsAppUrl(property, site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href={`tel:${site.phones[0].replace(/\D/g, '')}`}
              className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Ligar
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {property.bedrooms > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Bed className="w-6 h-6 text-brand-blue mx-auto mb-2" />
              <div className="font-bold text-gray-900">{property.bedrooms}</div>
              <div className="text-xs text-gray-500">Quartos</div>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <Bath className="w-6 h-6 text-brand-blue mx-auto mb-2" />
            <div className="font-bold text-gray-900">{property.bathrooms}</div>
            <div className="text-xs text-gray-500">Banheiros</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <Maximize className="w-6 h-6 text-brand-blue mx-auto mb-2" />
            <div className="font-bold text-gray-900">{property.area}m²</div>
            <div className="text-xs text-gray-500">Área</div>
          </div>
          {property.parking > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Car className="w-6 h-6 text-brand-blue mx-auto mb-2" />
              <div className="font-bold text-gray-900">{property.parking}</div>
              <div className="text-xs text-gray-500">Vagas</div>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Descrição</h2>
          <p className="text-gray-600 leading-relaxed">{property.description}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Comodidades</h2>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-4 py-2 bg-blue-50 text-brand-blue rounded-full text-sm font-medium"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <PropertyMap
          address={property.mapAddress?.trim() || `${property.location}, ${property.city}`}
          title={property.title}
        />
      </div>
    </div>
  )
}
