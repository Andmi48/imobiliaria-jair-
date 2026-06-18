import { useSiteContent } from '../context/SiteContentContext'

export default function SiteContentGate({ children }: { children: React.ReactNode }) {
  const { isReady } = useSiteContent()

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Carregando site...</p>
      </div>
    )
  }

  return <>{children}</>
}
