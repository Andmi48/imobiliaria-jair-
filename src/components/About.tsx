import { useSiteContent } from '../context/SiteContentContext'
import ProtectedImage from './ProtectedImage'

export default function About() {
  const { about } = useSiteContent()

  return (
    <section id="sobre" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="overflow-hidden">
            <ProtectedImage
              src={about.image}
              alt={about.title}
              wrapperClassName="w-full"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 mb-3">
              Sobre nós
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-5 leading-snug">
              {about.title}{' '}
              <span className="text-slate-600">{about.titleHighlight}</span>
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
              {about.paragraph1}
            </p>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              {about.paragraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
