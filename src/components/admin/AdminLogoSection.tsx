import { useEffect, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import { uploadSiteLogo } from '../../services/contentApi'

export default function AdminLogoSection() {
  const { site, updateSite, lastSyncStatus, lastSyncError } = useSiteContent()
  const [logoUrl, setLogoUrl] = useState(site.logoUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLogoUrl(site.logoUrl ?? '')
  }, [site.logoUrl])

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const url = await uploadSiteLogo(file)
      setLogoUrl(url)
      updateSite((current) => ({ ...current, logoUrl: url }))
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Falha ao enviar logo.'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    if (!logoUrl.trim()) return
    setError(null)
    updateSite((current) => ({ ...current, logoUrl: logoUrl.trim() }))
  }

  const handleRemove = () => {
    setLogoUrl('')
    setError(null)
    updateSite((current) => ({ ...current, logoUrl: undefined }))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Logo do site</h2>
        <p className="text-sm text-gray-500 mt-1">
          Envie o arquivo original da sua logo (PNG ou JPG). Ela é salva no armazenamento online e
          publicada automaticamente para todos os visitantes.
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
          {uploading ? 'Enviando e publicando...' : 'Escolher arquivo da logo'}
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

      {(error || lastSyncStatus === 'error') && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error ?? lastSyncError ?? 'Erro ao publicar a logo.'}
        </div>
      )}

      {lastSyncStatus === 'ok' && logoUrl && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Logo publicada no site com sucesso.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!logoUrl || uploading}
          className="px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark disabled:opacity-50"
        >
          Republicar logo
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
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-1">Onde aparece</p>
        <p>A logo fica no canto esquerdo do menu branco no topo de todas as páginas do site.</p>
      </div>
    </div>
  )
}
