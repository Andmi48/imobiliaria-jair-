import { useRef } from 'react'
import { Download, Upload, RotateCcw } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import type { SiteContent } from '../../types/content'

export default function AdminBackupSection() {
  const { exportContent, importContent, resetToDefaults } = useSiteContent()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const blob = new Blob([exportContent()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'jairacosta-site-backup.json'
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
        alert('Backup importado com sucesso!')
        window.location.reload()
      } catch {
        alert('Não foi possível importar o arquivo.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleReset = () => {
    if (!confirm('Isso vai restaurar todo o site para os dados originais. Continuar?')) return
    resetToDefaults()
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Backup e restauração</h2>
        <p className="text-sm text-gray-500">
          Exporte, importe ou restaure todo o conteúdo do site.
        </p>
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
          <span className="text-xs text-gray-500 text-center">Restaura o site a partir de um arquivo JSON</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex flex-col items-center gap-3 rounded-xl border border-red-200 p-6 hover:bg-red-50"
        >
          <RotateCcw className="w-6 h-6 text-brand-red" />
          <span className="font-semibold text-gray-900">Restaurar padrão</span>
          <span className="text-xs text-gray-500 text-center">Volta ao conteúdo original do site</span>
        </button>
      </div>

      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
    </div>
  )
}
