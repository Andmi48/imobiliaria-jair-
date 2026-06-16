export interface Neighborhood {
  id: number
  name: string
  city: string
  properties: number
  avgPrice: string
  image: string
}

export const neighborhoods: Neighborhood[] = [
  {
    id: 1,
    name: 'Jardins',
    city: 'São Paulo',
    properties: 48,
    avgPrice: 'R$ 1.2M',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
  },
  {
    id: 2,
    name: 'Leblon',
    city: 'Rio de Janeiro',
    properties: 32,
    avgPrice: 'R$ 2.8M',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
  },
  {
    id: 3,
    name: 'Alphaville',
    city: 'Barueri',
    properties: 56,
    avgPrice: 'R$ 1.8M',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
  {
    id: 4,
    name: 'Pinheiros',
    city: 'São Paulo',
    properties: 41,
    avgPrice: 'R$ 950K',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
  },
]
