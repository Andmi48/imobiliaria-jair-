import { useState } from 'react'
import { useSiteContent } from '../../context/SiteContentContext'
import type { SiteConfig } from '../../types/content'
import { adminInputClass, adminLabelClass } from './AdminFields'

export default function AdminSiteSection() {
  const { site, updateSite } = useSiteContent()
  const [form, setForm] = useState<SiteConfig>(site)
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateSite(form)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dados da empresa</h2>
        <p className="text-sm text-gray-500">Informações exibidas no rodapé, contato e WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className={adminLabelClass}>Nome completo</label>
          <input className={adminInputClass} value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div>
          <label className={adminLabelClass}>Nome curto (menu)</label>
          <input
            className={adminInputClass}
            value={form.shortName}
            onChange={(e) => update('shortName', e.target.value)}
          />
        </div>
        <div>
          <label className={adminLabelClass}>CRECI</label>
          <input className={adminInputClass} value={form.creci} onChange={(e) => update('creci', e.target.value)} />
        </div>
        <div>
          <label className={adminLabelClass}>E-mail</label>
          <input
            type="email"
            className={adminInputClass}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Telefone fixo</label>
          <input
            className={adminInputClass}
            value={form.phones[0] ?? ''}
            onChange={(e) => update('phones', [e.target.value, form.phones[1] ?? ''])}
          />
        </div>
        <div>
          <label className={adminLabelClass}>WhatsApp (número exibido)</label>
          <input
            className={adminInputClass}
            value={form.phones[1] ?? ''}
            onChange={(e) => update('phones', [form.phones[0] ?? '', e.target.value])}
          />
        </div>
        <div>
          <label className={adminLabelClass}>WhatsApp (link — só números com DDI)</label>
          <input
            className={adminInputClass}
            value={form.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value.replace(/\D/g, ''))}
            placeholder="5511999999999"
          />
        </div>
        <div>
          <label className={adminLabelClass}>Endereço</label>
          <input
            className={adminInputClass}
            value={form.address.street}
            onChange={(e) => update('address', { ...form.address, street: e.target.value })}
          />
        </div>
        <div>
          <label className={adminLabelClass}>Cidade / CEP</label>
          <input
            className={adminInputClass}
            value={form.address.city}
            onChange={(e) => update('address', { ...form.address, city: e.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Redes sociais</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(['instagram', 'linkedin', 'youtube', 'tiktok'] as const).map((network) => (
            <div key={network}>
              <label className={adminLabelClass}>{network}</label>
              <input
                className={adminInputClass}
                value={form.social[network]}
                onChange={(e) =>
                  update('social', { ...form.social, [network]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark"
        >
          Salvar alterações
        </button>
        {saved && <span className="text-sm text-green-600">Salvo com sucesso!</span>}
      </div>
    </div>
  )
}
