import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react'
import type { Property } from '../data/properties'
import { useFavorites } from '../context/FavoritesContext'
import ProtectedImage from './ProtectedImage'

interface PropertyCardProps {
  property: Property
}

function getPropertyCoverImage(property: Property): string {
  return property.images?.[0] || property.image || ''
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = favorites.includes(property.id)
  const coverImage = getPropertyCoverImage(property)

  return (
    <article className="group relative bg-white overflow-hidden rounded-site border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/imovel/${property.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          <ProtectedImage
            src={coverImage}
            alt={property.title}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span
            className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white ${
              property.type === 'Venda' ? 'bg-brand-blue' : 'bg-brand-red'
            }`}
          >
            {property.type}
          </span>
          <button
            type="button"
            className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isFavorite
                ? 'bg-brand-red text-white'
                : 'bg-white/90 text-gray-600 hover:bg-brand-red hover:text-white'
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(property.id)
            }}
            aria-label="Favoritar"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
            {property.title}
          </h3>
          <p className="text-xl font-bold text-gray-900 mb-3">{property.price}</p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {property.bedrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              {property.area}m²
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
