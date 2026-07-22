import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ADMIN_EMAIL,
  AUTH_KEY,
  SYNC_PASSWORD_KEY,
  validateAdminCredentials,
} from '../config/admin'
import { isCloudEnabled, supabase } from '../lib/supabase'

interface AdminAuthContextValue {
  isAuthenticated: boolean
  isAuthReady: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; message: string }>
  updatePassword: (newPassword: string) => Promise<{ ok: boolean; message: string }>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

function readAuthState() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

function setLocalSession(active: boolean, password?: string) {
  if (active) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    if (password) sessionStorage.setItem(SYNC_PASSWORD_KEY, password)
  } else {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(SYNC_PASSWORD_KEY)
  }
}

function getResetRedirectUrl() {
  return `${window.location.origin}/acesso/redefinir-senha`
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthState)
  const [isAuthReady, setIsAuthReady] = useState(!isCloudEnabled())

  useEffect(() => {
    if (!isCloudEnabled() || !supabase) {
      setIsAuthReady(true)
      return
    }

    let mounted = true

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const email = data.session?.user?.email?.toLowerCase()
      if (email && email === ADMIN_EMAIL) {
        setLocalSession(true)
        setIsAuthenticated(true)
      }
      setIsAuthReady(true)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      const email = session?.user?.email?.toLowerCase()
      if (event === 'SIGNED_OUT') {
        setLocalSession(false)
        setIsAuthenticated(false)
        return
      }
      if (email && email === ADMIN_EMAIL) {
        setLocalSession(true)
        setIsAuthenticated(true)
      }
      if (event === 'PASSWORD_RECOVERY') {
        setLocalSession(true)
        setIsAuthenticated(true)
      }
    })

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase()

    if (isCloudEnabled() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      })

      if (!error && data.user?.email?.toLowerCase() === ADMIN_EMAIL) {
        setLocalSession(true, password)
        setIsAuthenticated(true)
        return { ok: true }
      }

      // Fallback: senha configurada no site (Vercel), caso o usuário Auth ainda não exista
      if (validateAdminCredentials(normalized, password)) {
        setLocalSession(true, password)
        setIsAuthenticated(true)
        return { ok: true }
      }

      if (error?.message) {
        return {
          ok: false,
          message:
            error.message.includes('Invalid login')
              ? 'E-mail ou senha incorretos. Se esqueceu a senha, use “Esqueci a senha”.'
              : `Não foi possível entrar: ${error.message}`,
        }
      }

      return { ok: false, message: 'E-mail ou senha incorretos. Tente novamente.' }
    }

    if (!validateAdminCredentials(normalized, password)) {
      return { ok: false, message: 'E-mail ou senha incorretos. Tente novamente.' }
    }

    setLocalSession(true, password)
    setIsAuthenticated(true)
    return { ok: true }
  }, [])

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setLocalSession(false)
    setIsAuthenticated(false)
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      return { ok: false, message: 'Informe seu e-mail.' }
    }

    // Não revela se o e-mail existe ou não
    if (normalized !== ADMIN_EMAIL) {
      return {
        ok: true,
        message:
          'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha em alguns minutos. Verifique também a caixa de spam.',
      }
    }

    if (!isCloudEnabled() || !supabase) {
      return {
        ok: false,
        message:
          'A recuperação por e-mail não está disponível neste momento. Peça ao suporte técnico para redefinir a senha na Vercel/Supabase.',
      }
    }

    const redirectTo = getResetRedirectUrl()
    const { error } = await supabase.auth.resetPasswordForEmail(normalized, { redirectTo })

    if (error) {
      const hint =
        error.message.toLowerCase().includes('rate') || error.status === 429
          ? ' Aguarde alguns minutos e tente de novo.'
          : ''
      return {
        ok: false,
        message: `Não foi possível enviar o e-mail agora.${hint} Detalhe: ${error.message}`,
      }
    }

    return {
      ok: true,
      message:
        'Enviamos o link de recuperação para o e-mail do administrador. Verifique a caixa de entrada e o spam. O link leva à tela para criar a nova senha.',
    }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    const trimmed = newPassword.trim()
    if (trimmed.length < 6) {
      return { ok: false, message: 'A nova senha precisa ter pelo menos 6 caracteres.' }
    }

    if (!isCloudEnabled() || !supabase) {
      return {
        ok: false,
        message: 'Não é possível alterar a senha sem a nuvem configurada.',
      }
    }

    const { error } = await supabase.auth.updateUser({ password: trimmed })
    if (error) {
      return {
        ok: false,
        message: `Não foi possível salvar a nova senha: ${error.message}`,
      }
    }

    setLocalSession(true, trimmed)
    setIsAuthenticated(true)
    return {
      ok: true,
      message: 'Senha atualizada com sucesso. Use a nova senha no próximo login.',
    }
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAuthReady,
      login,
      logout,
      requestPasswordReset,
      updatePassword,
    }),
    [isAuthenticated, isAuthReady, login, logout, requestPasswordReset, updatePassword],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
