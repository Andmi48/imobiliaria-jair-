import { Star } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

export default function Testimonials() {
  const { testimonials } = useSiteContent()

  return (
    <section className="py-24 bg-brand-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">
          O que nossos clientes dizem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-white/90 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <p className="text-white font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
