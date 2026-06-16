import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react'
import type { Property, PropertyCategory, PropertyType } from '../../data/properties'
import { useSiteContent } from '../../context/SiteContentContext'
import { formatPropertyPrice } from '../../utils/propertyFormat'
import ImageField, { adminInputClass, adminLabelClass } from './AdminFields'

const emptyProperty = (): Property => ({
  id: Date.now(),
  title: '',
  location: '',
  city: 'São Paulo',
  price: 'R$ 0',
  priceValue: 0,
  type: 'Venda',
  category: 'apartamento',
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  parking: 0,
  image: '',
  images: [],
  description: '',
  amenities: [],
})

export default function AdminPropertiesSection() {
  const { properties, saveProperty, deleteProperty } = useSiteContent()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Property | null>(null)
  const [amenityInput, setAmenityInput] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return properties
    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term),
    )
  }, [properties, query])

  const startCreate = () => {
    setEditing(emptyProperty())
    setAmenityInput('')
  }

  const startEdit = (property: Property) => {
    setEditing({ ...property, images: [...property.images], amenities: [...property.amenities] })
    setAmenityInput('')
  }

  const updateField = <K extends keyof Property>(key: K, value: Property[K]) => {
    if (!editing) return
    setEditing({ ...editing, [key]: value })
  }

  const handlePriceChange = (raw: string) => {
    if (!editing) return
    const priceValue = Number(raw.replace(/\D/g, '')) || 0
    setEditing({
      ...editing,
      priceValue,
      price: formatPropertyPrice(priceValue, editing.type),
    })
  }

  const handleTypeChange = (type: PropertyType) => {
    if (!editing) return
    setEditing({
      ...editing,
      type,
      price: formatPropertyPrice(editing.priceValue, type),
    })
  }

  const addImage = (url: string) => {
    if (!editing || !url) return
    const images = [...editing.images, url]
    setEditing({
      ...editing,
      images,
      image: editing.image || url,
    })
  }

  const removeImage = (index: number) => {
    if (!editing) return
    const images = editing.images.filter((_, i) => i !== index)
    setEditing({
      ...editing,
      images,
      image: images[0] ?? '',
    })
  }

  const addAmenity = () => {
    if (!editing || !amenityInput.trim()) return
    setEditing({
      ...editing,
      amenities: [...editing.amenities, amenityInput.trim()],
    })
    setAmenityInput('')
  }

  const removeAmenity = (index: number) => {
    if (!editing) return
    setEditing({
      ...editing,
      amenities: editing.amenities.filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    if (!editing || !editing.title.trim()) return
    const images = editing.images.length > 0 ? editing.images : editing.image ? [editing.image] : []
    saveProperty({
      ...editing,
      images,
      image: images[0] ?? '',
    })
    setEditing(null)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Deseja excluir este imóvel?')) return
    deleteProperty(id)
    if (editing?.id === id) setEditing(null)
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {properties.some((item) => item.id === editing.id) ? 'Editar imóvel' : 'Novo imóvel'}
          </h2>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Voltar à lista
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>Título</label>
            <input
              className={adminInputClass}
              value={editing.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Cidade</label>
            <input
              className={adminInputClass}
              value={editing.city}
              onChange={(e) => updateField('city', e.target.value)}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Localização / Bairro</label>
            <input
              className={adminInputClass}
              value={editing.location}
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Valor (apenas números)</label>
            <input
              className={adminInputClass}
              value={editing.priceValue || ''}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Exibido como: {editing.price}</p>
          </div>
          <div>
            <label className={adminLabelClass}>Tipo</label>
            <select
              className={adminInputClass}
              value={editing.type}
              onChange={(e) => handleTypeChange(e.target.value as PropertyType)}
            >
              <option value="Venda">Venda</option>
              <option value="Aluguel">Aluguel</option>
            </select>
          </div>
          <div>
            <label className={adminLabelClass}>Categoria</label>
            <select
              className={adminInputClass}
              value={editing.category}
              onChange={(e) => updateField('category', e.target.value as PropertyCategory)}
            >
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="cobertura">Cobertura</option>
              <option value="comercial">Comercial</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          <div>
            <label className={adminLabelClass}>Quartos</label>
            <input
              type="number"
              min={0}
              className={adminInputClass}
              value={editing.bedrooms}
              onChange={(e) => updateField('bedrooms', Number(e.target.value))}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Banheiros</label>
            <input
              type="number"
              min={0}
              className={adminInputClass}
              value={editing.bathrooms}
              onChange={(e) => updateField('bathrooms', Number(e.target.value))}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Área (m²)</label>
            <input
              type="number"
              min={0}
              className={adminInputClass}
              value={editing.area}
              onChange={(e) => updateField('area', Number(e.target.value))}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Vagas</label>
            <input
              type="number"
              min={0}
              className={adminInputClass}
              value={editing.parking}
              onChange={(e) => updateField('parking', Number(e.target.value))}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Condomínio (opcional)</label>
            <input
              className={adminInputClass}
              value={editing.condo ?? ''}
              onChange={(e) => updateField('condo', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={adminLabelClass}>Descrição</label>
          <textarea
            rows={4}
            className={`${adminInputClass} resize-none`}
            value={editing.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!editing.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Destaque na home
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!editing.isNew}
              onChange={(e) => updateField('isNew', e.target.checked)}
            />
            Marcar como novo
          </label>
        </div>

        <div className="space-y-4">
          <ImageField
            label="Adicionar foto à galeria"
            value=""
            onChange={addImage}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {editing.images.map((image, index) => (
              <div key={`${image}-${index}`} className="relative group">
                <img src={image} alt="" className="h-24 w-full object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={adminLabelClass}>Comodidades</label>
          <div className="flex gap-2 mb-3">
            <input
              className={adminInputClass}
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="Ex: Piscina"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            />
            <button
              type="button"
              onClick={addAmenity}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editing.amenities.map((amenity, index) => (
              <span
                key={`${amenity}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm"
              >
                {amenity}
                <button type="button" onClick={() => removeAmenity(index)} className="hover:text-brand-red">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
          >
            Salvar imóvel
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Imóveis</h2>
          <p className="text-sm text-gray-500">{properties.length} imóveis cadastrados</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-red text-white font-semibold hover:bg-brand-red-dark"
        >
          <Plus className="w-4 h-4" />
          Novo imóvel
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          className={`${adminInputClass} pl-9`}
          placeholder="Buscar imóvel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Imóvel</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Destaque</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((property) => (
              <tr key={property.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {property.image ? (
                      <img src={property.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <p className="text-gray-500">{property.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{property.type}</td>
                <td className="px-4 py-3">{property.price}</td>
                <td className="px-4 py-3">
                  {property.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(property)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(property.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-brand-red"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
