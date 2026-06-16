export interface Agent {
  id: number
  name: string
  role: string
  creci: string
  phone: string
  sales: number
  avatar: string
}

export const agents: Agent[] = [
  {
    id: 1,
    name: 'Fernanda Oliveira',
    role: 'Especialista em Alto Padrão',
    creci: '123.456-F',
    phone: '(11) 99999-1001',
    sales: 127,
    avatar: 'FO',
  },
  {
    id: 2,
    name: 'Ricardo Mendes',
    role: 'Consultor de Investimentos',
    creci: '234.567-F',
    phone: '(11) 99999-1002',
    sales: 98,
    avatar: 'RM',
  },
  {
    id: 3,
    name: 'Camila Santos',
    role: 'Especialista em Locação',
    creci: '345.678-F',
    phone: '(11) 99999-1003',
    sales: 156,
    avatar: 'CS',
  },
  {
    id: 4,
    name: 'André Costa',
    role: 'Corretor Comercial',
    creci: '456.789-F',
    phone: '(11) 99999-1004',
    sales: 84,
    avatar: 'AC',
  },
]
