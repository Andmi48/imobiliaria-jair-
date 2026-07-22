import { Building2, Key, Shield } from 'lucide-react'

const services = [
  {
    icon: Building2,
    title: 'Compra e Venda',
    description: 'Assessoria completa com transparência em cada etapa.',
  },
  {
    icon: Key,
    title: 'Locação',
    description: 'Encontre ou alugue seu imóvel com segurança.',
  },
  {
    icon: Shield,
    title: 'Segurança Jurídica',
    description: 'Transações seguras com suporte especializado.',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12 max-w-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 mb-2">
            Atendimento
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Nossos serviços
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-slate-200">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`py-8 md:py-9 md:pr-8 ${
                index > 0 ? 'md:pl-8 border-t md:border-t-0 md:border-l border-slate-200' : ''
              }`}
            >
              <service.icon className="w-5 h-5 text-slate-700 mb-5" strokeWidth={1.5} />
              <h3 className="text-base font-semibold text-slate-900 mb-2 tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
