import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, KeyRound, Loader2, Lock } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { isCloudEnabled, supabase } from '../../lib/supabase'

export default function AdminResetPasswordPage() {
  const { updatePassword, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (!isCloudEnabled() || !supabase) {
      setChecking(false)
      setError('Recuperação de senha indisponível: nuvem não configurada.')
      return
    }

    let active = true

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
        setChecking(false)
      }
    })

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) {
        setReady(true)
      }
      setChecking(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setInfo('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setSaving(true)
    const result = await updatePassword(password)
    setSaving(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setInfo(result.message)
    window.setTimeout(() => navigate('/acesso/painel', { replace: true }), 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-blue/10 text-brand-blue mx-auto mb-6">
          <KeyRound className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Nova senha</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Defina a nova senha do administrador. Depois você entrará no painel automaticamente.
        </p>

        {checking ? (
          <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Validando link de recuperação...
          </p>
        ) : !ready && !isAuthenticated ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-brand-red">
              {error ||
                'Link inválido ou expirado. Solicite um novo e-mail em “Esqueci a senha”.'}
            </p>
            <Link to="/acesso" className="text-sm font-semibold text-brand-blue hover:underline">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                Nova senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none"
                required
                minLength={6}
              />
            </div>

            {error && <p className="text-sm text-brand-red">{error}</p>}
            {info && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{info}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {saving ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
