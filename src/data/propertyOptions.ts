import type { PropertyOptionsConfig, SelectOption } from '../types/content'

export const defaultPropertyOptions: PropertyOptionsConfig = {
  types: [
    { value: 'Venda', label: 'Venda' },
    { value: 'Aluguel', label: 'Aluguel' },
  ],
  categories: [
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'cobertura', label: 'Cobertura' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'studio', label: 'Studio' },
  ],
  buildingTypes: [
    { value: 'sobrado', label: 'Sobrado' },
    { value: 'terreo', label: 'Térreo' },
    { value: 'outro', label: 'Outro' },
  ],
  cities: [{ value: 'São Paulo', label: 'São Paulo' }],
  amenityPresets: [
    { value: 'piscina', label: 'Piscina' },
    { value: 'churrasqueira', label: 'Churrasqueira' },
    { value: 'academia', label: 'Academia' },
    { value: 'portaria-24h', label: 'Portaria 24h' },
    { value: 'elevador', label: 'Elevador' },
  ],
}

export function getOptionLabel(options: SelectOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}
