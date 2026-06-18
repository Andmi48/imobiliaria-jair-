import { useSiteContent } from '../../context/SiteContentContext'

export default function AdminSectionLoader({ children }: { children: React.ReactNode }) {
  const { isReady } = useSiteContent()

  if (!isReady) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-500">
        <div className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        <p className="text-sm">Carregando dados salvos...</p>
      </div>
    )
  }

  return <>{children}</>
}
