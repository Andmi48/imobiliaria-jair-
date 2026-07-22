import { useSiteContent } from '../context/SiteContentContext'
import ProtectedImage from './ProtectedImage'

export default function About() {
  const { about } = useSiteContent()

  return (
    <section id="sobre" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden shadow-xl">
            <ProtectedImage
              src={about.image}
              alt={about.title}
              wrapperClassName="w-full"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {about.title}{' '}
              <span className="text-brand-blue">{about.titleHighlight}</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {about.paragraph1}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {about.paragraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
