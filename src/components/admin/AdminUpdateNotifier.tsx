import { useEffect, useState } from 'react'
import { Bell, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react'
import {
  ADMIN_UPDATES,
  LATEST_ADMIN_UPDATE_VERSION,
  formatUpdateDate,
  hasUnseenAdminUpdate,
  markUpdateAsSeen,
  readLastSeenUpdateVersion,
} from '../../data/adminUpdates'

export default function AdminUpdateNotifier() {
  const [unseen, setUnseen] = useState(hasUnseenAdminUpdate)
  const [expanded, setExpanded] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const latest = ADMIN_UPDATES[0]

  useEffect(() => {
    if (unseen) setExpanded(true)
  }, [unseen])

  const handleDismiss = () => {
    markUpdateAsSeen()
    setUnseen(false)
    setExpanded(false)
    setShowHistory(false)
  }

  const handleOpen = () => {
    setExpanded(true)
    if (!unseen) setShowHistory(true)
  }

  if (!latest) return null

  const lastSeen = readLastSeenUpdateVersion()

  return (
    <div className="fixed bottom-4 right-4 z-[150] flex flex-col items-end gap-2 max-w-[calc(100vw-2rem)]">
      {expanded && (
        <div
          className="w-[min(100vw-2rem,380px)] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
          role="dialog"
          aria-label="Novidades do painel"
        >
          <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                {unseen ? <Sparkles className="w-5 h-5 text-amber-300" /> : <Bell className="w-5 h-5 text-white" />}
              </div>
              <div className="min-w-0 text-white">
                <p className="font-bold text-sm leading-tight">
                  {unseen ? 'Nova atualização disponível!' : 'Atualizações do sistema'}
                </p>
                <p className="text-xs text-white/75 mt-0.5">
                  v{LATEST_ADMIN_UPDATE_VERSION} · {formatUpdateDate(latest.date)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setExpanded(false)
                setShowHistory(false)
              }}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 shrink-0"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 max-h-[min(60vh,420px)] overflow-y-auto">
            {(unseen || !showHistory) && (
              <div className="mb-4">
                <p className="font-semibold text-gray-900 text-sm mb-2">{latest.title}</p>
                <ul className="space-y-2">
                  {latest.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-gray-600 leading-snug">
                      <span className="text-brand-blue mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(showHistory || !unseen) && ADMIN_UPDATES.length > 1 && (
              <div className={unseen ? 'border-t border-gray-100 pt-4' : ''}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Histórico
                </p>
                <div className="space-y-3">
                  {ADMIN_UPDATES.slice(unseen ? 1 : 0).map((entry) => (
                    <div key={entry.version} className="rounded-xl bg-gray-50 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-gray-800">v{entry.version}</p>
                        <p className="text-[11px] text-gray-400">{formatUpdateDate(entry.date)}</p>
                      </div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{entry.title}</p>
                      <ul className="text-[11px] text-gray-500 space-y-0.5">
                        {entry.items.slice(0, 2).map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                        {entry.items.length > 2 && (
                          <li className="text-gray-400">+ {entry.items.length - 2} melhorias</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lastSeen && unseen && (
              <p className="text-[11px] text-gray-400 mt-3">
                Última versão vista: v{lastSeen}
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-3 flex flex-wrap gap-2 bg-gray-50/80">
            {unseen ? (
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue-dark transition-colors"
              >
                Entendi, obrigado
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="flex-1 min-w-[120px] px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
            )}
            {unseen && ADMIN_UPDATES.length > 1 && (
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors inline-flex items-center gap-1"
              >
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Histórico
              </button>
            )}
          </div>
        </div>
      )}

      {!expanded && (
        <button
          type="button"
          onClick={handleOpen}
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-sm font-semibold transition-all hover:scale-[1.02] ${
            unseen
              ? 'bg-brand-blue text-white ring-2 ring-brand-blue/30 animate-pulse'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-blue/30'
          }`}
          aria-label={unseen ? 'Ver nova atualização' : 'Ver atualizações do sistema'}
        >
          {unseen ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <Sparkles className="w-4 h-4" />
              Nova atualização
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 text-brand-blue" />
              v{LATEST_ADMIN_UPDATE_VERSION}
            </>
          )}
        </button>
      )}
    </div>
  )
}
