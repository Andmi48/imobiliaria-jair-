import { useEffect, useMemo, useState } from 'react'
import { Download, ImageIcon, Loader2, Share2, X } from 'lucide-react'
import type { Property } from '../../data/properties'
import { useSiteContent } from '../../context/SiteContentContext'
import {
  BANNER_TEMPLATES,
  MAX_BANNER_PHOTOS,
  downloadBanner,
  generateBannerBlob,
  type BannerTemplateId,
} from '../../utils/bannerGenerator'

type PropertyShareBannerModalProps = {
  property: Property
  open: boolean
  onClose: () => void
}

export default function PropertyShareBannerModal({ property, open, onClose }: PropertyShareBannerModalProps) {
  const { site } = useSiteContent()

  const allPhotos = useMemo(() => {
    const urls = new Set<string>()
    if (property.image?.trim()) urls.add(property.image.trim())
    property.images?.forEach((url) => {
      if (url?.trim()) urls.add(url.trim())
    })
    return [...urls]
  }, [property])

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [templateId, setTemplateId] = useState<BannerTemplateId>('classic')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSelectedPhotos(allPhotos.slice(0, Math.min(1, allPhotos.length)))
    setTemplateId('classic')
    setPreviewUrl(null)
    setError(null)
  }, [open, property.id, allPhotos])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const togglePhoto = (url: string) => {
    setSelectedPhotos((current) => {
      if (current.includes(url)) {
        return current.filter((item) => item !== url)
      }
      if (current.length >= MAX_BANNER_PHOTOS) {
        return [...current.slice(1), url]
      }
      return [...current, url]
    })
    setPreviewUrl(null)
    setError(null)
  }

  const handleGenerate = async () => {
    if (selectedPhotos.length === 0) {
      setError('Selecione pelo menos uma foto.')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const blob = await generateBannerBlob({
        photos: selectedPhotos,
        property,
        site,
        templateId,
      })
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(blob))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar banner.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    try {
      const blob = previewUrl
        ? await fetch(previewUrl).then((r) => r.blob())
        : await generateBannerBlob({ photos: selectedPhotos, property, site, templateId })
      const safeName = property.title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 40)
      downloadBanner(blob, `divulgacao-${safeName || property.id}.png`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao baixar banner.')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white w-full sm:max-w-5xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[92dvh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="banner-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Cabeçalho fixo */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue" />
            </div>
            <div className="min-w-0">
              <h3 id="banner-modal-title" className="text-base sm:text-lg font-bold text-gray-900 truncate">
                Plano de divulgação
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{property.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Prévia no topo no mobile */}
            <div className="xl:hidden">
              <p className="text-sm font-semibold text-gray-900 mb-2">Pré-visualização</p>
              <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px]">
                <div className="aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Prévia do banner" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">A prévia aparece aqui após gerar</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 sm:gap-6">
              <div className="space-y-5 min-w-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    1. Selecione as fotos ({selectedPhotos.length}/{MAX_BANNER_PHOTOS})
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Todas as fotos selecionadas aparecem no banner. Use até {MAX_BANNER_PHOTOS} fotos.
                  </p>
                  {allPhotos.length === 0 ? (
                    <p className="text-sm text-gray-500">Este imóvel não tem fotos cadastradas.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {allPhotos.map((url) => {
                        const selected = selectedPhotos.includes(url)
                        const order = selectedPhotos.indexOf(url)
                        return (
                          <button
                            key={url}
                            type="button"
                            onClick={() => togglePhoto(url)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selected
                                ? 'border-brand-blue ring-2 ring-brand-blue/30 scale-[0.98]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                            {selected && (
                              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] font-bold flex items-center justify-center">
                                {order + 1}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">2. Escolha o modelo</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {BANNER_TEMPLATES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setTemplateId(item.id)
                          setPreviewUrl(null)
                          setError(null)
                        }}
                        className={`text-left rounded-xl border p-3 transition-colors ${
                          templateId === item.id
                            ? 'border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}
              </div>

              {/* Prévia lateral no desktop */}
              <div className="hidden xl:block space-y-3">
                <p className="text-sm font-semibold text-gray-900">3. Pré-visualização</p>
                <div className="sticky top-0">
                  <div className="aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Prévia do banner" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center text-gray-400 p-4">
                        <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Clique em Gerar banner</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">1080 × 1080 px — ideal para Instagram</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé fixo com ações */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={generating || selectedPhotos.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark disabled:opacity-60 text-sm sm:text-base"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {generating ? 'Gerando banner...' : 'Gerar banner'}
          </button>
          {previewUrl && (
            <button
              type="button"
              onClick={() => void handleDownload()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red-dark text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              Baixar PNG
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
