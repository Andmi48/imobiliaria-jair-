import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  ImagePlus,
  Link as LinkIcon,
  Loader2,
  Star,
  Trash2,
} from 'lucide-react'
import { uploadPropertyImages } from '../../services/contentApi'
import { useSiteContent } from '../../context/SiteContentContext'
import { adminLabelClass } from './AdminFields'
import DeleteConfirmModal, { type DeleteMode } from './DeleteConfirmModal'

type PropertyImagesManagerProps = {
  images: string[]
  coverImage: string
  onChange: (images: string[], coverImage: string) => void
}

export default function PropertyImagesManager({
  images,
  coverImage,
  onChange,
}: PropertyImagesManagerProps) {
  const { deletePropertyImages, site } = useSiteContent()
  const fileRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const watermarkOptions = {
    logoUrl: site.logoUrl,
    watermarkText: `${site.shortName || site.name} • CRECI ${site.creci}`,
  }

  const addUrls = (urls: string[]) => {
    const valid = urls.map((url) => url.trim()).filter(Boolean)
    if (valid.length === 0) return
    const nextImages = [...images, ...valid]
    onChange(nextImages, coverImage || nextImages[0] || '')
  }

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(`Enviando 0 de ${files.length}...`)

    try {
      const uploaded: string[] = []
      for (let index = 0; index < files.length; index += 1) {
        setUploadProgress(`Enviando ${index + 1} de ${files.length}...`)
        const batch = await uploadPropertyImages([files[index]], watermarkOptions)
        uploaded.push(...batch)
      }
      addUrls(uploaded)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Falha ao enviar imagens.')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  const removeImageLocal = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index)
    const nextCover = coverImage === images[index] ? (nextImages[0] ?? '') : coverImage
    onChange(nextImages, nextCover)
  }

  const handleDeleteConfirm = async (mode: DeleteMode) => {
    if (deleteIndex === null) return
    const url = images[deleteIndex]
    if (!url) return

    setDeleting(true)
    try {
      if (mode === 'permanent') {
        await deletePropertyImages([url], { permanent: true })
      }
      removeImageLocal(deleteIndex)
      setDeleteIndex(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Falha ao excluir foto.')
    } finally {
      setDeleting(false)
    }
  }

  const setCover = (index: number) => {
    if (!images[index]) return
    const nextImages = [...images]
    const [selected] = nextImages.splice(index, 1)
    nextImages.unshift(selected)
    onChange(nextImages, selected)
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const nextImages = [...images]
    const [item] = nextImages.splice(index, 1)
    nextImages.splice(target, 0, item)
    onChange(nextImages, coverImage)
  }

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return
    const nextImages = [...images]
    const [item] = nextImages.splice(dragIndex, 1)
    nextImages.splice(targetIndex, 0, item)
    onChange(nextImages, coverImage)
    setDragIndex(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={adminLabelClass}>Fotos do imóvel</label>
        <p className="text-xs text-gray-500 mb-3">
          Envie várias fotos de uma vez, arraste para ordenar e clique em &quot;Capa&quot; para definir a foto principal.
          Cada foto enviada recebe automaticamente a marca d&apos;água com a logo. Fotos antigas ou por URL precisam ser reenviadas.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
            <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="url"
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              placeholder="Cole uma URL de foto e pressione Enter"
              className="w-full text-sm outline-none"
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                addUrls([urlInput])
                setUrlInput('')
              }}
            />
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            Enviar várias fotos
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleBulkUpload}
          />
        </div>

        {uploadProgress && <p className="text-sm text-brand-blue">{uploadProgress}</p>}
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Nenhuma foto adicionada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {images.map((image, index) => {
            const isCover = (coverImage || images[0]) === image
            return (
              <div
                key={`${image}-${index}`}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => setDragIndex(null)}
                className={`flex gap-3 rounded-xl border p-3 bg-gray-50 ${
                  dragIndex === index ? 'opacity-60 border-brand-blue' : 'border-gray-200'
                }`}
              >
                <button
                  type="button"
                  className="self-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                  aria-label="Arrastar foto"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                <img src={image} alt="" className="h-24 w-32 rounded-lg object-cover border" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-500">Posição {index + 1}</span>
                    {isCover && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        Capa
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setCover(index)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium hover:bg-gray-100"
                      >
                        Definir capa
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteIndex(index)}
                      className="p-1.5 rounded-lg bg-red-50 text-brand-red hover:bg-red-100"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <DeleteConfirmModal
        open={deleteIndex !== null}
        title="Excluir foto"
        description="Escolha se a foto deve ser removida apenas deste imóvel ou apagada permanentemente do armazenamento."
        itemLabel={deleteIndex !== null ? `Foto ${deleteIndex + 1}` : undefined}
        loading={deleting}
        onClose={() => !deleting && setDeleteIndex(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
