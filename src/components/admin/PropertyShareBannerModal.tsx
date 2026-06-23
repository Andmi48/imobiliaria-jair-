import { useEffect, useMemo, useState } from 'react'
import { Download, ImageIcon, Loader2, Share2, X } from 'lucide-react'
import type { Property } from '../../data/properties'
import { useSiteContent } from '../../context/SiteContentContext'
import {
  BANNER_TEMPLATES,
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

  const template = BANNER_TEMPLATES.find((t) => t.id === templateId) ?? BANNER_TEMPLATES[0]

  useEffect(() => {
    if (!open) return
    setSelectedPhotos(allPhotos.slice(0, 1))
    setTemplateId('classic')
    setPreviewUrl(null)
    setError(null)
  }, [open, property.id, allPhotos])

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
      if (current.length >= template.maxPhotos) {
        if (template.maxPhotos === 1) return [url]
        return [...current.slice(1), url]
      }
      return [...current, url]
    })
    setPreviewUrl(null)
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Plano de divulgação</h3>
              <p className="text-sm text-gray-500">{property.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                1. Selecione as fotos ({selectedPhotos.length}/{template.maxPhotos})
              </p>
              {allPhotos.length === 0 ? (
                <p className="text-sm text-gray-500">Este imóvel não tem fotos cadastradas.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {allPhotos.map((url) => {
                    const selected = selectedPhotos.includes(url)
                    return (
                      <button
                        key={url}
                        type="button"
                        onClick={() => togglePhoto(url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                          selected ? 'border-brand-blue ring-2 ring-brand-blue/30' : 'border-gray-200'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {selected && (
                          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand-blue text-white text-xs flex items-center justify-center">
                            ✓
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BANNER_TEMPLATES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTemplateId(item.id)
                      setSelectedPhotos((current) => current.slice(0, item.maxPhotos))
                      setPreviewUrl(null)
                    }}
                    className={`text-left rounded-xl border p-3 transition-colors ${
                      templateId === item.id
                        ? 'border-brand-blue bg-brand-blue/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={generating || selectedPhotos.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-blue-dark disabled:opacity-60"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {generating ? 'Gerando banner...' : 'Gerar banner'}
            </button>

            {error && <p className="text-sm text-brand-red">{error}</p>}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-900">3. Pré-visualização (1080×1080)</p>
            <div className="aspect-square rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Prévia do banner" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-400 p-6">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selecione fotos e clique em Gerar banner</p>
                </div>
              )}
            </div>

            {previewUrl && (
              <button
                type="button"
                onClick={() => void handleDownload()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red-dark"
              >
                <Download className="w-4 h-4" />
                Baixar banner PNG
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
