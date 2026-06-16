import { properties } from './properties'
import { site } from './site'
import { defaultPropertyOptions } from './propertyOptions'
import type { SiteContent } from '../types/content'

export const defaultContent: SiteContent = {
  site: { ...site, address: { ...site.address }, social: { ...site.social }, phones: [...site.phones] },
  propertyOptions: defaultPropertyOptions,
  properties: properties.map((property) => ({
    ...property,
    images: [...property.images],
    amenities: [...property.amenities],
  })),
  hero: {
    welcomePrefix: 'Bem-vindo à',
    welcomeHighlight: 'Jair A Costa Consultor Imobiliário',
    subtitle:
      'Compra, venda e aluguel com segurança e transparência. A imobiliária que transforma sonhos em endereços.',
    backgroundImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
    stats: [
      { value: '1.500+', label: 'Imóveis' },
      { value: '30+', label: 'Anos de experiência' },
      { value: '98%', label: 'Clientes satisfeitos' },
    ],
  },
  about: {
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    title: 'A imobiliária que você pode',
    titleHighlight: 'confiar',
    paragraph1:
      'Há mais de 30 anos transformamos sonhos em endereços. Combinamos atendimento humanizado com profissionalismo para entregar a melhor experiência na compra, venda e aluguel de imóveis.',
    paragraph2:
      'Nossa equipe está pronta para guiá-lo em cada etapa, com transparência e as melhores condições do mercado.',
  },
  testimonials: [
    {
      id: '1',
      name: 'Maria Silva',
      text: 'Profissionais atenciosos e transparentes. Encontrei meu apartamento dos sonhos!',
      rating: 5,
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      text: 'Vendi minha casa em tempo recorde. Recomendo de olhos fechados!',
      rating: 5,
    },
    {
      id: '3',
      name: 'Ana Paula Costa',
      text: 'Atendimento personalizado que fez toda a diferença na minha busca.',
      rating: 5,
    },
  ],
}
