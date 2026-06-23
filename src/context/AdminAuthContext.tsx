import {
  createContext,
  useCallback,
  useContext,
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
  login: (email: string, password: string) => boolean
  logout: () => void
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; message: string }>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

function readAuthState() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthState)

  const login = useCallback((email: string, password: string) => {
    if (!validateAdminCredentials(email, password)) return false

    sessionStorage.setItem(AUTH_KEY, 'true')
    sessionStorage.setItem(SYNC_PASSWORD_KEY, password)
    setIsAuthenticated(true)
    return true
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(SYNC_PASSWORD_KEY)
    setIsAuthenticated(false)
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      return { ok: false, message: 'Informe seu e-mail.' }
    }

    if (normalized !== ADMIN_EMAIL) {
      return {
        ok: true,
        message:
          'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha em alguns minutos.',
      }
    }

    if (isCloudEnabled() && supabase) {
      const redirectTo = `${window.location.origin}/acesso/login`
      const { error } = await supabase.auth.resetPasswordForEmail(normalized, { redirectTo })
      if (error) {
        return {
          ok: false,
          message:
            'Não foi possível enviar o e-mail agora. Entre em contato com o suporte técnico do site.',
        }
      }
    }

    return {
      ok: true,
      message:
        'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha em alguns minutos. Verifique também a caixa de spam.',
    }
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, requestPasswordReset }),
    [isAuthenticated, login, logout, requestPasswordReset],
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
