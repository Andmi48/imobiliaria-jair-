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
    <article className="group relative bg-white overflow-hidden">
      <Link to={`/imovel/${property.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
          <ProtectedImage
            src={coverImage}
            alt={property.title}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-slate-900/85">
            {property.type}
          </span>
          <button
            type="button"
            className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-colors ${
              isFavorite
                ? 'bg-slate-900 text-white'
                : 'bg-white/90 text-slate-500 hover:text-slate-900'
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(property.id)
            }}
            aria-label="Favoritar"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="pt-4 pb-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1.5">
            <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{property.location}</span>
          </div>
          <h3 className="font-semibold text-slate-900 text-[15px] leading-snug mb-2 group-hover:text-slate-700 transition-colors">
            {property.title}
          </h3>
          <p className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">{property.price}</p>
          <div className="flex items-center gap-4 text-slate-500 text-xs border-t border-slate-100 pt-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5" strokeWidth={1.75} />
                {property.bedrooms}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5" strokeWidth={1.75} />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5" strokeWidth={1.75} />
              {property.area}m²
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
