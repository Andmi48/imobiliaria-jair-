export function formatPropertyPrice(value: number, type: string): string {
  const formatted = value.toLocaleString('pt-BR')
  return type === 'Aluguel' ? `R$ ${formatted}/mês` : `R$ ${formatted}`
}

export function parsePriceInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits) : 0
}
