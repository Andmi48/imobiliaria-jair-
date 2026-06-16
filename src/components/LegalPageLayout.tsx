import { Link } from 'react-router-dom'

interface LegalPageLayoutProps {
  title: string
  children: React.ReactNode
}

export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-sm text-brand-blue hover:underline mb-6 inline-block">
          ← Voltar ao início
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-4 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
