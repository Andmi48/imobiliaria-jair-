import { useSiteContent } from '../../context/SiteContentContext'

export default function AdminSyncBanner() {
  const { lastSyncStatus, lastSyncError, syncNow, isCloudConfigured, isLoadingFromCloud } = useSiteContent()

  if (isLoadingFromCloud) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 mb-6">
        Carregando dados da nuvem...
      </div>
    )
  }

  if (!isCloudConfigured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-6">
        <p className="font-medium">Ambiente local sem conexão com a nuvem</p>
        <p className="mt-1">
          Para ver o mesmo conteúdo do site publicado, crie o arquivo <strong>.env.local</strong> com as
          variáveis do Supabase (copie da Vercel) e reinicie <strong>npm run dev</strong>.
        </p>
      </div>
    )
  }

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
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-6 flex flex-col gap-3">
      <div>
        <p className="font-medium">Não foi possível publicar no site.</p>
        <p className="mt-1 text-red-700">
          {lastSyncError ??
            'As alterações ficam salvas neste navegador, mas visitantes podem não vê-las até a publicação funcionar.'}
        </p>
      </div>
      {lastSyncError?.includes('Supabase') && (
        <div className="rounded-lg bg-white/80 border border-red-100 p-3 text-red-900">
          <p className="font-semibold mb-1">Como corrigir (uma vez só):</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Abra <strong>supabase.com/dashboard</strong> → seu projeto</li>
            <li>Vá em <strong>SQL Editor</strong> → New query</li>
            <li>Cole o conteúdo do arquivo <strong>supabase/fix-sync-completo.sql</strong> do projeto</li>
            <li>Clique em <strong>Run</strong></li>
            <li>Volte aqui, clique em Sair, entre de novo e tente publicar</li>
          </ol>
        </div>
      )}
      <button
        type="button"
        onClick={() => void syncNow()}
        className="self-start shrink-0 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
      >
        Tentar novamente
      </button>
    </div>
  )
}
