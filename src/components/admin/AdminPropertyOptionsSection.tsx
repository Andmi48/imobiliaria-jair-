import { useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import type { PropertyOptionsConfig, SelectOption } from '../../types/content'
import { useSiteContent } from '../../context/SiteContentContext'
import { adminInputClass, adminLabelClass } from './AdminFields'

type OptionGroupKey = keyof PropertyOptionsConfig

const groupLabels: Record<OptionGroupKey, string> = {
  types: 'Tipos (Venda / Aluguel)',
  categories: 'Categorias (Apartamento, Casa...)',
  buildingTypes: 'Modelo do imóvel (Sobrado, Térreo...)',
  cities: 'Cidades',
  amenityPresets: 'Comodidades sugeridas',
}

function emptyOption(): SelectOption {
  return { value: '', label: '' }
}

export default function AdminPropertyOptionsSection() {
  const { propertyOptions, updatePropertyOptions } = useSiteContent()
  const [draft, setDraft] = useState<PropertyOptionsConfig>(propertyOptions)
  const [saved, setSaved] = useState(false)

  const updateGroup = (group: OptionGroupKey, options: SelectOption[]) => {
    setDraft((current) => ({ ...current, [group]: options }))
    setSaved(false)
  }

  const updateOption = (group: OptionGroupKey, index: number, patch: Partial<SelectOption>) => {
    updateGroup(
      group,
      draft[group].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )
  }

  const addOption = (group: OptionGroupKey) => {
    updateGroup(group, [...draft[group], emptyOption()])
  }

  const removeOption = (group: OptionGroupKey, index: number) => {
    updateGroup(
      group,
      draft[group].filter((_, i) => i !== index),
    )
  }

  const handleSave = () => {
    const cleaned: PropertyOptionsConfig = {
      types: draft.types.filter((item) => item.value.trim() && item.label.trim()),
      categories: draft.categories.filter((item) => item.value.trim() && item.label.trim()),
      buildingTypes: draft.buildingTypes.filter((item) => item.value.trim() && item.label.trim()),
      cities: draft.cities.filter((item) => item.value.trim() && item.label.trim()),
      amenityPresets: draft.amenityPresets.filter((item) => item.value.trim() && item.label.trim()),
    }

    updatePropertyOptions(cleaned)
    setDraft(cleaned)
    setSaved(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Opções dos campos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure as listas de escolha usadas no cadastro de imóveis e na busca do site.
        </p>
      </div>

      {(Object.keys(groupLabels) as OptionGroupKey[]).map((group) => (
        <section key={group} className="rounded-xl border border-gray-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900">{groupLabels[group]}</h3>
            <button
              type="button"
              onClick={() => addOption(group)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          <div className="space-y-2">
            {draft[group].map((option, index) => (
              <div key={`${group}-${index}`} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <div>
                  {index === 0 && <label className={adminLabelClass}>Valor interno</label>}
                  <input
                    className={adminInputClass}
                    value={option.value}
                    placeholder="ex: sobrado"
                    onChange={(event) => updateOption(group, index, { value: event.target.value })}
                  />
                </div>
                <div>
                  {index === 0 && <label className={adminLabelClass}>Nome exibido</label>}
                  <input
                    className={adminInputClass}
                    value={option.label}
                    placeholder="ex: Sobrado"
                    onChange={(event) => updateOption(group, index, { label: event.target.value })}
                  />
                </div>
                <div className={index === 0 ? 'sm:pt-7' : ''}>
                  <button
                    type="button"
                    onClick={() => removeOption(group, index)}
                    className="p-2 rounded-lg hover:bg-red-50 text-brand-red"
                    title="Remover opção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
        >
          <Save className="w-4 h-4" />
          Salvar opções
        </button>
        {saved && <span className="text-sm text-green-600">Opções salvas com sucesso.</span>}
      </div>
    </div>
  )
}
