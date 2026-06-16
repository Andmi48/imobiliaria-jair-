import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  Database,
  ExternalLink,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import AdminPropertiesSection from '../../components/admin/AdminPropertiesSection'
import AdminSiteSection from '../../components/admin/AdminSiteSection'
import AdminHeroSection from '../../components/admin/AdminHeroSection'
import AdminAboutSection from '../../components/admin/AdminAboutSection'
import AdminTestimonialsSection from '../../components/admin/AdminTestimonialsSection'
import AdminBackupSection from '../../components/admin/AdminBackupSection'

type AdminTab = 'overview' | 'properties' | 'site' | 'hero' | 'about' | 'testimonials' | 'backup'

const tabs: Array<{ id: AdminTab; label: string; icon: typeof Home }> = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'properties', label: 'Imóveis', icon: Building2 },
  { id: 'site', label: 'Empresa', icon: Settings },
  { id: 'hero', label: 'Página inicial', icon: Home },
  { id: 'about', label: 'Sobre', icon: Info },
  { id: 'testimonials', label: 'Depoimentos', icon: MessageSquareQuote },
  { id: 'backup', label: 'Backup', icon: Database },
]

export default function AdminPanelPage() {
  const { logout } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0c1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">Painel administrativo</p>
            <h1 className="text-lg font-bold">Jair A Costa — Controle do site</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Ver site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-red hover:bg-brand-red-dark text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white rounded-2xl border border-gray-200 p-3 h-fit">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Bem-vindo ao painel</h2>
                  <p className="text-gray-600 mt-2">
                    Aqui você controla 100% do site: imóveis, fotos, textos, contatos e depoimentos.
                    As alterações são salvas automaticamente neste navegador.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabs
                    .filter((tab) => tab.id !== 'overview')
                    .map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className="text-left rounded-xl border border-gray-200 p-5 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors"
                      >
                        <tab.icon className="w-5 h-5 text-brand-blue mb-3" />
                        <p className="font-semibold text-gray-900">{tab.label}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}
            {activeTab === 'properties' && <AdminPropertiesSection />}
            {activeTab === 'site' && <AdminSiteSection />}
            {activeTab === 'hero' && <AdminHeroSection />}
            {activeTab === 'about' && <AdminAboutSection />}
            {activeTab === 'testimonials' && <AdminTestimonialsSection />}
            {activeTab === 'backup' && <AdminBackupSection />}
          </main>
        </div>
      </div>
    </div>
  )
}
