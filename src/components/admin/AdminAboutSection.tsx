import { useState } from 'react'
import { useSiteContent } from '../../context/SiteContentContext'
import ImageField, { adminInputClass, adminLabelClass } from './AdminFields'

export default function AdminAboutSection() {
  const { about, updateAbout } = useSiteContent()
  const [form, setForm] = useState(about)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateAbout(form)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Seção Sobre</h2>
        <p className="text-sm text-gray-500">Texto e imagem da área &quot;Sobre&quot; na home.</p>
      </div>

      <ImageField
        label="Imagem da seção"
        value={form.image}
        onChange={(image) => setForm((current) => ({ ...current, image }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className={adminLabelClass}>Título</label>
          <input
            className={adminInputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Palavra em destaque</label>
          <input
            className={adminInputClass}
            value={form.titleHighlight}
            onChange={(e) => setForm({ ...form, titleHighlight: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={adminLabelClass}>Primeiro parágrafo</label>
        <textarea
          rows={4}
          className={`${adminInputClass} resize-none`}
          value={form.paragraph1}
          onChange={(e) => setForm({ ...form, paragraph1: e.target.value })}
        />
      </div>

      <div>
        <label className={adminLabelClass}>Segundo parágrafo</label>
        <textarea
          rows={4}
          className={`${adminInputClass} resize-none`}
          value={form.paragraph2}
          onChange={(e) => setForm({ ...form, paragraph2: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
        >
          Salvar seção
        </button>
        {saved && <span className="text-sm text-green-600">Salvo com sucesso!</span>}
      </div>
    </div>
  )
}
