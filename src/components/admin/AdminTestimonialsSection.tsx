import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import type { Testimonial } from '../../types/content'
import { adminInputClass, adminLabelClass } from './AdminFields'

export default function AdminTestimonialsSection() {
  const { testimonials, updateTestimonials } = useSiteContent()
  const [items, setItems] = useState(testimonials)
  const [saved, setSaved] = useState(false)

  const updateItem = (id: string, patch: Partial<Testimonial>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
    setSaved(false)
  }

  const addItem = () => {
    setItems((current) => [
      ...current,
      { id: String(Date.now()), name: '', text: '', rating: 5 },
    ])
    setSaved(false)
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setSaved(false)
  }

  const handleSave = () => {
    updateTestimonials(items)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Depoimentos</h2>
          <p className="text-sm text-gray-500">Avaliações exibidas na página inicial.</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex justify-between gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <div>
                  <label className={adminLabelClass}>Nome</label>
                  <input
                    className={adminInputClass}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Estrelas (1 a 5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className={adminInputClass}
                    value={item.rating}
                    onChange={(e) => updateItem(item.id, { rating: Number(e.target.value) })}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-brand-red self-start"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className={adminLabelClass}>Depoimento</label>
              <textarea
                rows={3}
                className={`${adminInputClass} resize-none`}
                value={item.text}
                onChange={(e) => updateItem(item.id, { text: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
        >
          Salvar depoimentos
        </button>
        {saved && <span className="text-sm text-green-600">Salvo com sucesso!</span>}
      </div>
    </div>
  )
}
