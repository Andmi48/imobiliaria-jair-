import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, LogIn } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/acesso/painel" replace />
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const success = login(password)
    if (!success) {
      setError('Senha incorreta. Tente novamente.')
      return
    }
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-blue/10 text-brand-blue mx-auto mb-6">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Área de Acesso</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Painel administrativo do site. Somente para o administrador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white py-3 rounded-lg font-semibold transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Entrar no painel
          </button>
        </form>
      </div>
    </div>
  )
}
