import { AlertTriangle, CloudUpload, RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'
import { useSiteContent } from '../../context/SiteContentContext'

export default function AdminPublishBar() {
  const {
    hasUnpublishedChanges,
    publishChanges,
    discardDraft,
    saveDraft,
    lastSyncStatus,
    lastSyncError,
    isCloudConfigured,
    isLoadingFromCloud,
    isReady,
  } = useSiteContent()

  const [publishing, setPublishing] = useState(false)

  if (isLoadingFromCloud || !isReady) return null

  const handlePublish = async () => {
    if (!confirm('Publicar todas as alterações no site? Os visitantes verão esta versão.')) return
    setPublishing(true)
    try {
      const ok = await publishChanges()
      if (!ok) {
        alert(lastSyncError ?? 'Não foi possível publicar. Tente novamente.')
      }
    } finally {
      setPublishing(false)
    }
  }

  const handleDiscard = () => {
    if (!confirm('Descartar alterações não publicadas e voltar à versão online?')) return
    discardDraft()
  }

  const handleSaveDraft = () => {
    const ok = saveDraft()
    if (ok) {
      alert('Rascunho salvo neste navegador. O site público não foi alterado.')
    } else {
      alert('Não foi possível salvar o rascunho. Libere espaço no navegador.')
    }
  }

  return (
    <div
      className={`rounded-xl border px-4 py-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        hasUnpublishedChanges
          ? 'border-amber-200 bg-amber-50'
          : lastSyncStatus === 'error'
            ? 'border-red-200 bg-red-50'
            : 'border-green-200 bg-green-50'
      }`}
    >
      <div className="text-sm">
        {hasUnpublishedChanges ? (
          <>
            <p className="font-semibold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alterações em rascunho — ainda não publicadas
            </p>
            <p className="text-amber-800 mt-1">
              Edite à vontade. Clique em <strong>Publicar no site</strong> quando quiser que os visitantes vejam as mudanças.
            </p>
          </>
        ) : lastSyncStatus === 'error' ? (
          <>
            <p className="font-semibold text-red-900">Erro na última publicação</p>
            <p className="text-red-700 mt-1">{lastSyncError}</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-green-900">Site publicado</p>
            <p className="text-green-800 mt-1">A versão online está igual ao que você vê aqui.</p>
          </>
        )}
        {!isCloudConfigured && (
          <p className="text-amber-800 mt-1">Sem Supabase: alterações ficam só neste navegador.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        {hasUnpublishedChanges && (
          <button
            type="button"
            onClick={handleDiscard}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            Descartar
          </button>
        )}
        <button
          type="button"
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Save className="w-4 h-4" />
          Salvar rascunho
        </button>
        <button
          type="button"
          onClick={() => void handlePublish()}
          disabled={publishing || !isCloudConfigured}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue-dark disabled:opacity-60"
        >
          <CloudUpload className="w-4 h-4" />
          {publishing ? 'Publicando...' : 'Publicar no site'}
        </button>
      </div>
    </div>
  )
}
