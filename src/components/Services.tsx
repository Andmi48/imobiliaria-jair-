import { Handshake, Home, Scale } from 'lucide-react'

const services = [
  {
    icon: Handshake,
    title: 'Compra e Venda',
    description: 'Assessoria completa com transparência em cada etapa.',
    color: 'bg-brand-blue',
  },
  {
    icon: Home,
    title: 'Locação',
    description: 'Encontre ou alugue seu imóvel com segurança.',
    color: 'bg-brand-red',
  },
  {
    icon: Scale,
    title: 'Segurança Jurídica',
    description: 'Transações seguras com suporte especializado.',
    color: 'bg-brand-blue',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Nossos serviços
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="text-center p-8 border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${service.color} flex items-center justify-center mb-5 mx-auto`}
              >
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
