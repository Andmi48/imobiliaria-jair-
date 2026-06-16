import { useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import { uploadPropertyImageWithFallback } from '../../services/contentApi'

export default function AdminLogoSection() {
  const { site, updateSite } = useSiteContent()
  const [logoUrl, setLogoUrl] = useState(site.logoUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadPropertyImageWithFallback(file)
      setLogoUrl(url)
      setSaved(false)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    updateSite({ ...site, logoUrl: logoUrl.trim() || undefined })
    setSaved(true)
  }

  const handleRemove = () => {
    setLogoUrl('')
    updateSite({ ...site, logoUrl: undefined })
    setSaved(true)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Logo do site</h2>
        <p className="text-sm text-gray-500 mt-1">
          Envie o arquivo original da sua logo (PNG ou JPG). O site usa exatamente o arquivo que você
          enviar, sem alteração.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brand-blue/30 bg-brand-blue/5 p-6 sm:p-8 text-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Prévia da logo"
            className="mx-auto h-24 sm:h-28 w-auto max-w-full object-contain mb-6"
          />
        ) : (
          <div className="h-24 sm:h-28 flex items-center justify-center text-gray-400 text-sm mb-6">
            Nenhuma logo enviada ainda
          </div>
        )}

        <label className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-semibold cursor-pointer transition-colors">
          <ImagePlus className="w-5 h-5" />
          {uploading ? 'Enviando...' : 'Escolher arquivo da logo'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>

        <p className="text-xs text-gray-500 mt-3">PNG, JPG ou WEBP — use o arquivo original da sua logo</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!logoUrl || uploading}
          className="px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark disabled:opacity-50"
        >
          Salvar logo no site
        </button>

        {logoUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-brand-red hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Remover logo
          </button>
        )}

        {saved && <span className="text-sm text-green-600 font-medium">Logo salva com sucesso!</span>}
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-1">Onde aparece</p>
        <p>A logo fica no canto esquerdo do menu branco no topo de todas as páginas do site.</p>
      </div>
    </div>
  )
}
