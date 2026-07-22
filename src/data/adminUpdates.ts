export type AdminUpdateEntry = {
  version: string
  date: string
  title: string
  items: string[]
}

/** Histórico de atualizações — adicione a nova versão sempre no topo. */
export const ADMIN_UPDATES: AdminUpdateEntry[] = [
  {
    version: '2.5.4',
    date: '2026-07-22',
    title: 'Visual mais profissional em todo o site',
    items: [
      'Barra de busca menor e mais compacta',
      'Cards de imóveis sem contorno pesado e visual mais sóbrio',
      'Seção de serviços redesenhada sem caixas coloridas',
      'Foto da seção Sobre sem cantos arredondados e sombra',
    ],
  },
  {
    version: '2.5.3',
    date: '2026-07-21',
    title: 'Busca do banner mais profissional',
    items: [
      'Barra de busca do início redesenhada com visual mais sóbrio e profissional',
      'Removido o visual “template” com cantos muito arredondados e botões em pílula',
    ],
  },
  {
    version: '2.5.2',
    date: '2026-07-21',
    title: 'Depoimentos com visual profissional',
    items: [
      'Seção de depoimentos redesenhada com visual mais sóbrio e profissional',
      'Carrossel contínuo bem lento (pausa ao passar o mouse)',
    ],
  },
  {
    version: '2.5.1',
    date: '2026-07-21',
    title: 'Mapa da imobiliária no Fale conosco',
    items: [
      'Mapa da localização da imobiliária ao lado do formulário Fale conosco na home',
      'Endereço e link para abrir no Google Maps',
    ],
  },
  {
    version: '2.5.0',
    date: '2026-07-08',
    title: 'Mapa, destaque principal e ordenação',
    items: [
      'Mapa da localização na página de cada imóvel (venda e aluguel)',
      'Opção "Destaque principal" — card grande no topo da home',
      'Home separa imóveis: primeiro Venda, depois Aluguel',
      'Menos imóveis na home (mais enxuta)',
      'Campo "Ordem de exibição" para definir a posição (1, 2, 3...) na home e nas listagens',
    ],
  },

  {
    version: '2.4.5',
    date: '2025-06-23',
    title: 'Correção da galeria de fotos',
    items: [
      'Fotos dos imóveis não ficam mais em branco ao abrir o detalhe',
      'Corrigido bug de imagens em cache que não apareciam na galeria',
    ],
  },
  {
    version: '2.4.4',
    date: '2025-06-23',
    title: 'Marca d\'água discreta',
    items: [
      'Marca d\'água agora é apenas uma logo centralizada e semitransparente',
      'Removido o padrão repetido que cobria as fotos',
      'Reenvie fotos antigas para aplicar o novo estilo',
    ],
  },
  {
    version: '2.4.3',
    date: '2025-06-23',
    title: 'Banner Destaque ajustado',
    items: [
      'Fotos extras em grade 2×2 (sem faixas finas)',
      'Descrição curta sem repetir local e lista de itens',
      'Texto alinhado ao lado do preço, sem bloco único',
    ],
  },
  {
    version: '2.4.2',
    date: '2025-06-23',
    title: 'Banner Destaque com ícones e contato',
    items: [
      'Fotos maiores com faixa inferior para fotos extras',
      'Ícones de quartos, banheiros, área e vagas',
      'Barra de contato integrada com telefone e CRECI juntos',
    ],
  },
  {
    version: '2.4.1',
    date: '2025-06-23',
    title: 'Banner Destaque refinado',
    items: [
      'Layout de fotos rebalanceado: principal + coluna lateral visível',
      'Menos repetição de informações no banner',
      'Espaçamento e rodapé corrigidos no modelo Destaque',
    ],
  },
  {
    version: '2.4.0',
    date: '2025-06-23',
    title: 'Banners profissionais e aviso de atualização',
    items: [
      'Banners redesenhados com fotos maiores e descrição completa do imóvel',
      '5 layouts distintos: Destaque, Editorial, Cinematográfico, Galeria e Mosaico',
      'Paleta de cores e posição da logo / Venda-Locação no banner',
      'Aviso de novas atualizações no canto inferior direito do painel',
    ],
  },
  {
    version: '2.3.0',
    date: '2025-06-23',
    title: 'Login e galeria de fotos',
    items: [
      'Login: botão "Esqueci a senha" e olhinho para ver a senha',
      'Correção da galeria — todas as fotos do imóvel carregam corretamente',
      'Marca d\'água reforçada no upload de fotos',
    ],
  },
  {
    version: '2.2.0',
    date: '2025-06-22',
    title: 'Divulgação e modo rascunho',
    items: [
      'Botão Divulgar com geração de banners para Instagram',
      'Modo rascunho: alterações só vão ao site após "Publicar no site"',
      'Exclusão permanente de fotos e imóveis no Supabase Storage',
      'Campo de destaque para redução de preço no banner',
    ],
  },
  {
    version: '2.1.0',
    date: '2025-06-22',
    title: 'Proteção de imagens',
    items: [
      'Marca d\'água automática com logo em fotos enviadas pelo painel',
      'Bloqueio de cópia e clique direito nas fotos do site público',
    ],
  },
]

export const LATEST_ADMIN_UPDATE_VERSION = ADMIN_UPDATES[0]?.version ?? '0.0.0'

export const ADMIN_LAST_SEEN_UPDATE_KEY = 'jairacosta-admin-last-seen-update'

export function formatUpdateDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function readLastSeenUpdateVersion(): string | null {
  try {
    return localStorage.getItem(ADMIN_LAST_SEEN_UPDATE_KEY)
  } catch {
    return null
  }
}

export function markUpdateAsSeen(version = LATEST_ADMIN_UPDATE_VERSION) {
  try {
    localStorage.setItem(ADMIN_LAST_SEEN_UPDATE_KEY, version)
  } catch {
    // ignore
  }
}

export function hasUnseenAdminUpdate(): boolean {
  return readLastSeenUpdateVersion() !== LATEST_ADMIN_UPDATE_VERSION
}
