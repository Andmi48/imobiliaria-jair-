import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { SiteContentProvider } from './context/SiteContentContext'
import ScrollManager from './components/ScrollManager'
import SiteContentGate from './components/SiteContentGate'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import LegalDisclaimerPage from './pages/LegalDisclaimerPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage'
import AdminPanelPage from './pages/admin/AdminPanelPage'
import AdminRoute from './components/admin/AdminRoute'

function PublicRoutes() {
  return (
    <SiteContentGate>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/venda" element={<ListingsPage type="Venda" />} />
          <Route path="/aluguel" element={<ListingsPage type="Aluguel" />} />
          <Route path="/imovel/:id" element={<PropertyDetailPage />} />
          <Route path="/politica-de-cookies" element={<CookiePolicyPage />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
          <Route path="/isencao-de-responsabilidade" element={<LegalDisclaimerPage />} />
        </Route>
      </Routes>
    </SiteContentGate>
  )
}

function App() {
  return (
    <AdminAuthProvider>
      <SiteContentProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <ScrollManager />
            <Routes>
              <Route path="/acesso" element={<AdminLoginPage />} />
              <Route path="/acesso/login" element={<AdminLoginPage />} />
              <Route path="/acesso/redefinir-senha" element={<AdminResetPasswordPage />} />
              <Route
                path="/acesso/painel"
                element={
                  <AdminRoute>
                    <AdminPanelPage />
                  </AdminRoute>
                }
              />
              <Route path="/*" element={<PublicRoutes />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </SiteContentProvider>
    </AdminAuthProvider>
  )
}

export default App
