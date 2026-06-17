import { useEffect, useState } from 'react'
import { useSiteContent } from '../../context/SiteContentContext'
import ImageField, { adminInputClass, adminLabelClass } from './AdminFields'

export default function AdminHeroSection() {
  const { hero, updateHero } = useSiteContent()
  const [form, setForm] = useState(hero)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(hero)
  }, [hero])

  const handleSave = () => {
    updateHero(form)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Página inicial</h2>
        <p className="text-sm text-gray-500">Banner principal e números de destaque.</p>
      </div>

      <ImageField
        label="Imagem de fundo do banner"
        value={form.backgroundImage}
        onChange={(backgroundImage) => setForm((current) => ({ ...current, backgroundImage }))}
        previewClassName="h-40 w-full object-cover rounded-lg border border-gray-200"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className={adminLabelClass}>Texto antes do destaque</label>
          <input
            className={adminInputClass}
            value={form.welcomePrefix}
            onChange={(e) => setForm({ ...form, welcomePrefix: e.target.value })}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Nome em destaque</label>
          <input
            className={adminInputClass}
            value={form.welcomeHighlight}
            onChange={(e) => setForm({ ...form, welcomeHighlight: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={adminLabelClass}>Subtítulo</label>
        <textarea
          rows={3}
          className={`${adminInputClass} resize-none`}
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {form.stats.map((stat, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Estatística {index + 1}</p>
            <input
              className={adminInputClass}
              value={stat.value}
              onChange={(e) => {
                const stats = [...form.stats]
                stats[index] = { ...stats[index], value: e.target.value }
                setForm({ ...form, stats })
              }}
              placeholder="1.500+"
            />
            <input
              className={adminInputClass}
              value={stat.label}
              onChange={(e) => {
                const stats = [...form.stats]
                stats[index] = { ...stats[index], label: e.target.value }
                setForm({ ...form, stats })
              }}
              placeholder="Imóveis"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
        >
          Salvar banner
        </button>
        {saved && <span className="text-sm text-green-600">Salvo com sucesso!</span>}
      </div>
    </div>
  )
}
