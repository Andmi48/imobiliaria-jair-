import { useMemo, useState } from 'react'

import { Plus, Pencil, Trash2, Star, Search, Share2 } from 'lucide-react'

import type { Property } from '../../data/properties'

import { useSiteContent } from '../../context/SiteContentContext'

import { formatPropertyPrice } from '../../utils/propertyFormat'

import { getOptionLabel } from '../../data/propertyOptions'

import PropertyImagesManager from './PropertyImagesManager'

import { adminInputClass, adminLabelClass } from './AdminFields'

import DeleteConfirmModal, { type DeleteMode } from './DeleteConfirmModal'

import PropertyShareBannerModal from './PropertyShareBannerModal'



const emptyProperty = (defaults: {

  type: string

  category: string

  city: string

  buildingType?: string

}): Property => ({

  id: Date.now(),

  title: '',

  location: '',

  city: defaults.city,

  price: 'R$ 0',

  priceValue: 0,

  type: defaults.type,

  category: defaults.category,

  buildingType: defaults.buildingType,

  bedrooms: 1,

  bathrooms: 1,

  area: 0,

  parking: 0,

  image: '',

  images: [],

  description: '',

  amenities: [],

  featured: true,

})



export default function AdminPropertiesSection() {

  const { properties, propertyOptions, saveProperty, deleteProperty } = useSiteContent()

  const [query, setQuery] = useState('')

  const [editing, setEditing] = useState<Property | null>(null)

  const [amenityInput, setAmenityInput] = useState('')

  const [customCity, setCustomCity] = useState('')

  const [shareProperty, setShareProperty] = useState<Property | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)

  const [deleting, setDeleting] = useState(false)



  const defaultType = propertyOptions.types[0]?.value ?? 'Venda'

  const defaultCategory = propertyOptions.categories[0]?.value ?? 'apartamento'

  const defaultCity = propertyOptions.cities[0]?.value ?? 'São Paulo'

  const defaultBuildingType = propertyOptions.buildingTypes[0]?.value



  const cityIsPreset = useMemo(

    () => propertyOptions.cities.some((city) => city.value === editing?.city),

    [editing?.city, propertyOptions.cities],

  )



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

    setEditing(

      emptyProperty({

        type: defaultType,

        category: defaultCategory,

        city: defaultCity,

        buildingType: defaultBuildingType,

      }),

    )

    setAmenityInput('')

    setCustomCity('')

  }



  const startEdit = (property: Property) => {

    setEditing({ ...property, images: [...property.images], amenities: [...property.amenities] })

    setAmenityInput('')

    setCustomCity(property.city)

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



  const handleTypeChange = (type: string) => {

    if (!editing) return

    setEditing({

      ...editing,

      type,

      price: formatPropertyPrice(editing.priceValue, type),

    })

  }



  const addAmenity = (value?: string) => {

    const next = (value ?? amenityInput).trim()

    if (!editing || !next) return

    if (editing.amenities.includes(next)) return

    setEditing({

      ...editing,

      amenities: [...editing.amenities, next],

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

      image: editing.image || images[0] || '',

    })

    setEditing(null)

  }



  const handleDeleteConfirm = async (mode: DeleteMode) => {

    if (!deleteTarget) return

    setDeleting(true)

    try {

      await deleteProperty(deleteTarget.id, { permanent: mode === 'permanent' })

      if (editing?.id === deleteTarget.id) setEditing(null)

      setDeleteTarget(null)

    } catch (error) {

      alert(error instanceof Error ? error.message : 'Falha ao excluir imóvel.')

    } finally {

      setDeleting(false)

    }

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

            <select

              className={`${adminInputClass} mb-2`}

              value={cityIsPreset ? editing.city : '__custom__'}

              onChange={(e) => {

                if (e.target.value === '__custom__') {

                  updateField('city', customCity)

                  return

                }

                updateField('city', e.target.value)

                setCustomCity(e.target.value)

              }}

            >

              {propertyOptions.cities.map((city) => (

                <option key={city.value} value={city.value}>

                  {city.label}

                </option>

              ))}

              <option value="__custom__">Outra cidade</option>

            </select>

            {!cityIsPreset && (

              <input

                className={adminInputClass}

                value={customCity}

                onChange={(e) => {

                  setCustomCity(e.target.value)

                  updateField('city', e.target.value)

                }}

                placeholder="Digite a cidade"

              />

            )}

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

          <div className="lg:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">

            <p className="text-sm font-semibold text-amber-900">Destaque no banner (redução de preço)</p>

            <p className="text-xs text-amber-800">

              Preencha o valor anterior quando o proprietário abaixar o preço. O banner mostrará &quot;Preço reduzido!&quot; automaticamente.

            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>

                <label className={adminLabelClass}>Valor anterior (só números)</label>

                <input

                  className={adminInputClass}

                  value={editing.previousPriceValue || ''}

                  onChange={(e) => {

                    const previousPriceValue = Number(e.target.value.replace(/\D/g, '')) || undefined

                    updateField('previousPriceValue', previousPriceValue)

                  }}

                  placeholder="Ex: 520000"

                />

                {editing.previousPriceValue ? (

                  <p className="text-xs text-gray-500 mt-1">

                    Era: {formatPropertyPrice(editing.previousPriceValue, editing.type)}

                  </p>

                ) : null}

              </div>

              <div>

                <label className={adminLabelClass}>Texto de destaque (opcional)</label>

                <input

                  className={adminInputClass}

                  value={editing.promoHighlight ?? ''}

                  onChange={(e) => updateField('promoHighlight', e.target.value || undefined)}

                  placeholder="Ex: Preço reduzido! Oportunidade!"

                />

              </div>

            </div>

          </div>

          <div>

            <label className={adminLabelClass}>Tipo</label>

            <select

              className={adminInputClass}

              value={editing.type}

              onChange={(e) => handleTypeChange(e.target.value)}

            >

              {propertyOptions.types.map((option) => (

                <option key={option.value} value={option.value}>

                  {option.label}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className={adminLabelClass}>Categoria</label>

            <select

              className={adminInputClass}

              value={editing.category}

              onChange={(e) => updateField('category', e.target.value)}

            >

              {propertyOptions.categories.map((option) => (

                <option key={option.value} value={option.value}>

                  {option.label}

                </option>

              ))}

            </select>

          </div>

          {propertyOptions.buildingTypes.length > 0 && (

            <div>

              <label className={adminLabelClass}>Modelo do imóvel</label>

              <select

                className={adminInputClass}

                value={editing.buildingType ?? ''}

                onChange={(e) => updateField('buildingType', e.target.value || undefined)}

              >

                <option value="">Selecione</option>

                {propertyOptions.buildingTypes.map((option) => (

                  <option key={option.value} value={option.value}>

                    {option.label}

                  </option>

                ))}

              </select>

            </div>

          )}

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



        <PropertyImagesManager

          images={editing.images}

          coverImage={editing.image}

          onChange={(images, coverImage) => {

            setEditing({ ...editing, images, image: coverImage })

          }}

        />



        <div>

          <label className={adminLabelClass}>Comodidades</label>

          {propertyOptions.amenityPresets.length > 0 && (

            <div className="flex flex-wrap gap-2 mb-3">

              {propertyOptions.amenityPresets.map((preset) => (

                <button

                  key={preset.value}

                  type="button"

                  onClick={() => addAmenity(preset.label)}

                  className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"

                >

                  + {preset.label}

                </button>

              ))}

            </div>

          )}

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

              onClick={() => addAmenity()}

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

            onClick={() => setShareProperty(editing)}

            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue/5"

          >

            <Share2 className="w-4 h-4" />

            Divulgar

          </button>

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

              <th className="px-4 py-3 font-medium">Categoria</th>

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

                    {(property.images?.[0] || property.image) ? (

                      <img src={property.images?.[0] || property.image} alt="" className="w-12 h-12 rounded-lg object-cover" />

                    ) : (

                      <div className="w-12 h-12 rounded-lg bg-gray-100" />

                    )}

                    <div>

                      <p className="font-medium text-gray-900">{property.title}</p>

                      <p className="text-gray-500">{property.location}</p>

                    </div>

                  </div>

                </td>

                <td className="px-4 py-3">{getOptionLabel(propertyOptions.types, property.type)}</td>

                <td className="px-4 py-3">{getOptionLabel(propertyOptions.categories, property.category)}</td>

                <td className="px-4 py-3">{property.price}</td>

                <td className="px-4 py-3">

                  {property.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}

                </td>

                <td className="px-4 py-3">

                  <div className="flex justify-end gap-2">

                    <button

                      type="button"

                      onClick={() => setShareProperty(property)}

                      className="p-2 rounded-lg hover:bg-blue-50 text-brand-blue"

                      title="Criar banner de divulgação"

                    >

                      <Share2 className="w-4 h-4" />

                    </button>

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

                      onClick={() => setDeleteTarget(property)}

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

      <DeleteConfirmModal

        open={!!deleteTarget}

        title="Excluir imóvel"

        description="Escolha como deseja remover este imóvel. A exclusão permanente também apaga as fotos do armazenamento online."

        itemLabel={deleteTarget?.title}

        loading={deleting}

        onClose={() => !deleting && setDeleteTarget(null)}

        onConfirm={handleDeleteConfirm}

      />

      {shareProperty && (

        <PropertyShareBannerModal

          property={shareProperty}

          open={!!shareProperty}

          onClose={() => setShareProperty(null)}

        />

      )}

    </div>

  )

}


