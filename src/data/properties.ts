export type PropertyType = string
export type PropertyCategory = string

export interface Property {
  id: number
  title: string
  location: string
  city: string
  price: string
  priceValue: number
  type: PropertyType
  category: PropertyCategory
  buildingType?: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  condo?: string
  image: string
  images: string[]
  description: string
  amenities: string[]
  featured?: boolean
  isNew?: boolean
  /** Valor anterior — se maior que priceValue, exibe redução no banner */
  previousPriceValue?: number
  /** Texto de destaque no banner (ex: "Preço reduzido!") */
  promoHighlight?: string
}

export const properties: Property[] = [
  {
    id: 1,
    title: 'Apartamento de Luxo nos Jardins',
    location: 'Jardins, São Paulo',
    city: 'São Paulo',
    price: 'R$ 1.850.000',
    priceValue: 1850000,
    type: 'Venda',
    category: 'apartamento',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 2,
    condo: 'R$ 1.200/mês',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    ],
    description: 'Apartamento sofisticado com acabamento premium, vista privilegiada e localização exclusiva nos Jardins. Ideal para quem busca conforto e praticidade.',
    amenities: ['Piscina', 'Academia', 'Salão de festas', 'Portaria 24h', 'Varanda gourmet'],
    featured: true,
    isNew: true,
  },
  {
    id: 2,
    title: 'Casa com Piscina e Jardim',
    location: 'Alphaville, Barueri',
    city: 'Barueri',
    price: 'R$ 2.400.000',
    priceValue: 2400000,
    type: 'Venda',
    category: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    parking: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
    description: 'Residência ampla com área de lazer completa, piscina aquecida e jardim paisagístico. Condomínio fechado com segurança total.',
    amenities: ['Piscina', 'Churrasqueira', 'Jardim', 'Suíte master', 'Closet'],
    featured: true,
  },
  {
    id: 3,
    title: 'Cobertura Panorâmica no Leblon',
    location: 'Leblon, Rio de Janeiro',
    city: 'Rio de Janeiro',
    price: 'R$ 12.500/mês',
    priceValue: 12500,
    type: 'Aluguel',
    category: 'cobertura',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    parking: 1,
    condo: 'R$ 2.800/mês',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    ],
    description: 'Cobertura com vista mar deslumbrante, terraço privativo e design contemporâneo. Uma das regiões mais desejadas do Rio.',
    amenities: ['Vista mar', 'Terraço', 'Hidromassagem', 'Smart home', 'Vaga coberta'],
    featured: true,
    isNew: true,
  },
  {
    id: 4,
    title: 'Studio Moderno na Vila Madalena',
    location: 'Vila Madalena, São Paulo',
    city: 'São Paulo',
    price: 'R$ 3.200/mês',
    priceValue: 3200,
    type: 'Aluguel',
    category: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    ],
    description: 'Studio compacto e funcional, perfeito para jovens profissionais. Próximo a bares, restaurantes e transporte público.',
    amenities: ['Mobiliado', 'Coworking', 'Lavanderia', 'Pet friendly'],
  },
  {
    id: 5,
    title: 'Casa de Campo em Campos do Jordão',
    location: 'Campos do Jordão, SP',
    city: 'Campos do Jordão',
    price: 'R$ 980.000',
    priceValue: 980000,
    type: 'Venda',
    category: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
    description: 'Refúgio aconchegante na serra com lareira, deck de madeira e vista para as montanhas. Ideal para finais de semana.',
    amenities: ['Lareira', 'Deck', 'Jardim', 'Aquecimento central'],
  },
  {
    id: 6,
    title: 'Loft Industrial em Pinheiros',
    location: 'Pinheiros, São Paulo',
    city: 'São Paulo',
    price: 'R$ 5.800/mês',
    priceValue: 5800,
    type: 'Aluguel',
    category: 'apartamento',
    bedrooms: 1,
    bathrooms: 1,
    area: 70,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    ],
    description: 'Loft com pé-direito duplo, conceito aberto e estilo industrial-chic. Localização premium em Pinheiros.',
    amenities: ['Pé-direito duplo', 'Varanda', 'Academia', 'Bicicletário'],
  },
  {
    id: 7,
    title: 'Apartamento Familiar em Moema',
    location: 'Moema, São Paulo',
    city: 'São Paulo',
    price: 'R$ 1.200.000',
    priceValue: 1200000,
    type: 'Venda',
    category: 'apartamento',
    bedrooms: 3,
    bathrooms: 2,
    area: 105,
    parking: 2,
    condo: 'R$ 980/mês',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    ],
    description: 'Apartamento espaçoso em região tranquila, próximo a escolas e parques. Ótimo custo-benefício.',
    amenities: ['Playground', 'Salão de jogos', 'Portaria', 'Área verde'],
  },
  {
    id: 8,
    title: 'Sala Comercial na Faria Lima',
    location: 'Faria Lima, São Paulo',
    city: 'São Paulo',
    price: 'R$ 8.500/mês',
    priceValue: 8500,
    type: 'Aluguel',
    category: 'comercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 85,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    ],
    description: 'Sala corporativa em edifício AAA, no coração do mercado financeiro. Infraestrutura completa para empresas.',
    amenities: ['Ar central', 'Recepção', 'Auditório', 'Restaurante'],
    isNew: true,
  },
  {
    id: 9,
    title: 'Casa em Condomínio Fechado',
    location: 'Granja Viana, Cotia',
    city: 'Cotia',
    price: 'R$ 1.650.000',
    priceValue: 1650000,
    type: 'Venda',
    category: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    parking: 4,
    image: 'https://images.unsplash.com/photo-1605276374102-decdcf5ab2a8?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1605276374102-decdcf5ab2a8?w=1200&q=80',
    ],
    description: 'Casa em condomínio de alto padrão com clube completo, quadras e área de preservação ambiental.',
    amenities: ['Clube', 'Quadras', 'Segurança 24h', 'Área verde'],
    featured: true,
  },
]

export function getPropertyById(id: number): Property | undefined {
  return properties.find((p) => p.id === id)
}
