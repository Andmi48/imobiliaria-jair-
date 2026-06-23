import { AlertTriangle, Trash2, X } from 'lucide-react'

export type DeleteMode = 'system' | 'permanent'

type DeleteConfirmModalProps = {
  open: boolean
  title: string
  description: string
  itemLabel?: string
  onClose: () => void
  onConfirm: (mode: DeleteMode) => void | Promise<void>
  loading?: boolean
}

export default function DeleteConfirmModal({
  open,
  title,
  description,
  itemLabel,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!open) return null

  const handleConfirm = async (mode: DeleteMode) => {
    await onConfirm(mode)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" role="dialog" aria-modal="true">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {itemLabel && <p className="text-sm text-gray-500">{itemLabel}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-5">{description}</p>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleConfirm('system')}
            className="w-full text-left rounded-xl border border-gray-200 p-4 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors disabled:opacity-60"
          >
            <p className="font-semibold text-gray-900">Remover apenas do site</p>
            <p className="text-sm text-gray-500 mt-1">
              Some da listagem, mas as fotos permanecem no armazenamento online.
            </p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => void handleConfirm('permanent')}
            className="w-full text-left rounded-xl border border-red-200 p-4 hover:border-brand-red hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            <p className="font-semibold text-brand-red flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Excluir permanentemente
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Remove do site e apaga as fotos do Supabase para liberar espaço. Não pode desfazer.
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
