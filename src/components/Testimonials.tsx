import { Quote, Star } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

export default function Testimonials() {
  const { testimonials } = useSiteContent()

  if (testimonials.length === 0) return null

  // Duplica para o loop infinito do carrossel
  const track = [...testimonials, ...testimonials]

  return (
    <section className="py-20 sm:py-24 bg-[#0f172a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
          Depoimentos
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-white text-center tracking-tight">
          O que nossos clientes dizem
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#0f172a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#0f172a] to-transparent z-10" />

        <div className="testimonials-marquee-mask">
          <div className="testimonials-marquee-track">
            {track.map((t, index) => (
              <article
                key={`${t.id ?? t.name}-${index}`}
                className="testimonials-card shrink-0 w-[min(86vw,340px)] sm:w-[380px] bg-white rounded-site border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.18)] p-7 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.max(0, Math.min(5, t.rating || 5)) }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-600/90 fill-amber-600/90" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300 shrink-0" strokeWidth={1.5} />
                </div>

                <p className="text-slate-700 leading-relaxed text-[15px] mb-6 min-h-[4.5rem]">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm leading-tight">{t.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Cliente</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
