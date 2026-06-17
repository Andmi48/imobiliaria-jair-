import { useSiteContent } from '../../context/SiteContentContext'

export default function AdminSyncBanner() {
  const { lastSyncStatus, lastSyncError, syncNow } = useSiteContent()

  if (lastSyncStatus === 'idle') return null

  if (lastSyncStatus === 'syncing') {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 mb-6">
        Publicando alterações no site...
      </div>
    )
  }

  if (lastSyncStatus === 'ok') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 mb-6">
        Alterações publicadas no site com sucesso.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="font-medium">Não foi possível publicar no site.</p>
        <p className="mt-1 text-red-700">
          {lastSyncError ??
            'As alterações ficam salvas neste navegador, mas visitantes podem não vê-las até a publicação funcionar.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void syncNow()}
        className="shrink-0 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
      >
        Tentar novamente
      </button>
    </div>
  )
}
