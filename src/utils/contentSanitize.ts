import type { SiteContent } from '../types/content'

function isEmbeddedImage(url: string) {
  return url.trim().startsWith('data:')
}

/** Impede publicar JSON gigante (base64) que falha no Supabase e apaga dados. */
export function validateContentForCloud(content: SiteContent): string | null {
  if (content.site.logoUrl && isEmbeddedImage(content.site.logoUrl)) {
    return 'A logo precisa ser enviada para o armazenamento online. Tente enviar o arquivo novamente.'
  }

  if (isEmbeddedImage(content.hero.backgroundImage)) {
    return 'A imagem do banner precisa ser enviada para o armazenamento online.'
  }

  if (isEmbeddedImage(content.about.image)) {
    return 'A imagem da seção Sobre precisa ser enviada para o armazenamento online.'
  }

  for (const property of content.properties) {
    const images = property.images?.length ? property.images : property.image ? [property.image] : []
    if (images.some(isEmbeddedImage)) {
      return `O imóvel "${property.title || 'sem título'}" tem fotos não publicadas. Reenvie as imagens.`
    }
  }

  const payloadSize = JSON.stringify(content).length
  if (payloadSize > 4_000_000) {
    return 'Conteúdo muito grande para publicar. Reduza o tamanho das imagens.'
  }

  return null
}
