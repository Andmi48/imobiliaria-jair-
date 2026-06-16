import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AUTH_KEY,
  SYNC_PASSWORD_KEY,
  validateAdminCredentials,
} from '../config/admin'

interface AdminAuthContextValue {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
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

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
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
