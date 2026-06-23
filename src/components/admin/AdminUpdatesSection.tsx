import { Sparkles } from 'lucide-react'
import {
  ADMIN_UPDATES,
  LATEST_ADMIN_UPDATE_VERSION,
  formatUpdateDate,
  hasUnseenAdminUpdate,
} from '../../data/adminUpdates'

export default function AdminUpdatesSection() {
  const unseen = hasUnseenAdminUpdate()

  return (
    <section className="rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-brand-blue/5 to-brand-blue/10 px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Atualizações do sistema</h3>
            <p className="text-sm text-gray-500">
              Versão atual: <strong className="text-gray-700">v{LATEST_ADMIN_UPDATE_VERSION}</strong>
            </p>
          </div>
        </div>
        {unseen && (
          <span className="shrink-0 text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
            Novidade
          </span>
        )}
      </div>

      <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
        {ADMIN_UPDATES.map((entry, index) => (
          <article key={entry.version} className="px-5 py-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-semibold text-gray-900">
                v{entry.version}
                {index === 0 && (
                  <span className="ml-2 text-[10px] font-bold uppercase bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded">
                    Atual
                  </span>
                )}
              </p>
              <time className="text-xs text-gray-400">{formatUpdateDate(entry.date)}</time>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-2">{entry.title}</p>
            <ul className="space-y-1.5">
              {entry.items.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex gap-2 leading-snug">
                  <span className="text-brand-blue shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
