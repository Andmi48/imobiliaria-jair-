import { useEffect, useRef, useState } from 'react'
import { Download, Upload, RotateCcw, History, Undo2 } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import type { SiteContent } from '../../types/content'
import type { ContentHistoryEntry } from '../../utils/contentClone'
import { fetchContentHistory, restoreContentVersion } from '../../services/contentApi'
import { getAdminSyncPassword } from '../../config/admin'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminBackupSection() {
  const { exportContent, importContent, resetToDefaults, syncNow, reloadFromCloud } = useSiteContent()
  const fileRef = useRef<HTMLInputElement>(null)
  const [history, setHistory] = useState<ContentHistoryEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [restoringId, setRestoringId] = useState<number | null>(null)

  const loadHistory = async () => {
    setLoadingHistory(true)
    const entries = await fetchContentHistory()
    setHistory(entries)
    setLoadingHistory(false)
  }

  useEffect(() => {
    void loadHistory()
  }, [])

  const handleExport = () => {
    const blob = new Blob([exportContent()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `jairacosta-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteContent
        if (!parsed.site || !parsed.properties) {
          alert('Arquivo inválido.')
          return
        }
        importContent(parsed)
        void syncNow()
        alert('Backup importado e publicado!')
      } catch {
        alert('Não foi possível importar o arquivo.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleReset = () => {
    if (!confirm('Isso vai restaurar todo o site para os dados originais de fábrica. Continuar?')) return
    resetToDefaults()
    void syncNow()
  }

  const handleRestoreVersion = async (id: number) => {
    if (!confirm('Restaurar o site para esta data/hora? A versão atual será salva no histórico.')) return

    setRestoringId(id)
    const result = await restoreContentVersion(id, getAdminSyncPassword())
    setRestoringId(null)

    if (!result.ok) {
      alert(result.error)
      return
    }

    await loadHistory()
    await reloadFromCloud()
    alert('Versão restaurada com sucesso!')
  }

  return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Backup e restauração</h2>
          <p className="text-sm text-gray-500">
            Desfaça erros com o botão <strong>Voltar</strong> no topo do painel, ou restaure uma versão
            salva por data e hora.
          </p>
        </div>

        <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 flex gap-3 items-start">
          <Undo2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Desfazer rápido</p>
            <p className="mt-1">
              Errou uma edição? Clique em <strong>Voltar</strong> no cabeçalho do painel para retornar ao
              estado anterior (até 30 passos).
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-gray-900">Restaurar por data e hora</h3>
          </div>

          {loadingHistory ? (
            <p className="text-sm text-gray-500">Carregando histórico...</p>
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
              <p>Nenhuma versão salva ainda.</p>
              <p className="mt-2">
                Após publicar alterações, as versões anteriores ficam listadas aqui. Execute também{' '}
                <strong>supabase/content-history.sql</strong> no Supabase (uma vez).
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
              {history.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white"
                >
                  <div>
                    <p className="font-medium text-gray-900">{formatDateTime(entry.createdAt)}</p>
                    <p className="text-xs text-gray-500">Versão #{entry.id}</p>
                  </div>
                  <button
                    type="button"
                    disabled={restoringId === entry.id}
                    onClick={() => void handleRestoreVersion(entry.id)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue-dark disabled:opacity-50"
                  >
                    {restoringId === entry.id ? 'Restaurando...' : 'Restaurar'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={handleExport}
            className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-6 hover:bg-gray-50"
          >
            <Download className="w-6 h-6 text-brand-blue" />
            <span className="font-semibold text-gray-900">Exportar backup</span>
            <span className="text-xs text-gray-500 text-center">Baixa um arquivo JSON com todo o conteúdo</span>
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-6 hover:bg-gray-50"
          >
            <Upload className="w-6 h-6 text-brand-blue" />
            <span className="font-semibold text-gray-900">Importar backup</span>
            <span className="text-xs text-gray-500 text-center">Restaura a partir de um arquivo JSON</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex flex-col items-center gap-3 rounded-xl border border-red-200 p-6 hover:bg-red-50"
          >
            <RotateCcw className="w-6 h-6 text-brand-red" />
            <span className="font-semibold text-gray-900">Restaurar fábrica</span>
            <span className="text-xs text-gray-500 text-center">Volta ao conteúdo original do sistema</span>
          </button>
        </div>

        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
      </div>
  )
}
