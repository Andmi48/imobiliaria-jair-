import { useRef, type ChangeEvent } from 'react'
import { ImagePlus, Link as LinkIcon } from 'lucide-react'
import { uploadPropertyImageWithFallback } from '../../services/contentApi'

type ImageFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  previewClassName?: string
}

export default function ImageField({
  label,
  value,
  onChange,
  previewClassName = 'h-28 w-full object-cover rounded-lg border border-gray-200',
}: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    void (async () => {
      try {
        const url = await uploadPropertyImageWithFallback(file)
        onChange(url)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Falha ao enviar imagem.')
      }
    })()

    event.target.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {value && <img src={value} alt="" className={previewClassName} />}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
          <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://..."
            className="w-full text-sm outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
        >
          <ImagePlus className="w-4 h-4" />
          Enviar foto
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  )
}

export const adminInputClass =
  'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none'

export const adminLabelClass = 'block text-sm font-medium text-gray-700 mb-1'
