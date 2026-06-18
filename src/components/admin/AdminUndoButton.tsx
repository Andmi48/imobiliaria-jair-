import { Undo2 } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'

export default function AdminUndoButton() {
  const { canUndo, undo } = useSiteContent()

  return (
    <button
      type="button"
      onClick={undo}
      disabled={!canUndo}
      title="Desfazer última alteração"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Undo2 className="w-4 h-4" />
      <span className="hidden sm:inline">Voltar</span>
    </button>
  )
}
