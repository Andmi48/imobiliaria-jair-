import type { Property } from '../data/properties'

export function buildPropertyWhatsAppMessage(property: Property): string {
  const tipo = property.type === 'Venda' ? 'Venda' : 'Locação'

  return [
    'Olá! Tenho interesse no seguinte imóvel:',
    '',
    `Código: #${property.id}`,
    `Endereço: ${property.location}`,
    `Valor: ${property.price}`,
    `Tipo: ${tipo}`,
  ].join('\n')
}

export function buildPropertyWhatsAppUrl(property: Property, whatsappNumber: string): string {
  const text = encodeURIComponent(buildPropertyWhatsAppMessage(property))
  return `https://wa.me/${whatsappNumber}?text=${text}`
}
