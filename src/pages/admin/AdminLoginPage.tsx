import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { isAuthenticated, login, requestPasswordReset } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/acesso/painel" replace />
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const success = login(email, password)
    if (!success) {
      setError('E-mail ou senha incorretos. Tente novamente.')
      setInfo('')
      return
    }
    setError('')
    setInfo('')
  }

  const handleForgotSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSendingReset(true)
    setError('')
    setInfo('')
    const result = await requestPasswordReset(email)
    setSendingReset(false)
    if (result.ok) {
      setInfo(result.message)
    } else {
      setError(result.message)
    }
  }

  const switchToForgot = () => {
    setForgotMode(true)
    setError('')
    setInfo('')
  }

  const switchToLogin = () => {
    setForgotMode(false)
    setError('')
    setInfo('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-blue/10 text-brand-blue mx-auto mb-6">
          <Lock className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {forgotMode ? 'Recuperar senha' : 'Login do Administrador'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {forgotMode
            ? 'Informe seu e-mail para receber o link de redefinição de senha.'
            : 'Acesse com seu e-mail e senha para gerenciar o site.'}
        </p>

        {forgotMode ? (
          <form onSubmit={(e) => void handleForgotSubmit(e)} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-brand-red">{error}</p>}
            {info && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{info}</p>}

            <button
              type="submit"
              disabled={sendingReset}
              className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
            >
              {sendingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {sendingReset ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>

            <button
              type="button"
              onClick={switchToLogin}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-brand-blue py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={switchToForgot}
                  className="text-xs font-medium text-brand-blue hover:underline"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
        )}
      </div>
    </div>
  )
}
