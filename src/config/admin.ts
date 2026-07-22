export const AUTH_KEY = 'jairacosta-admin-auth'
export const SYNC_PASSWORD_KEY = 'jairacosta-admin-sync-password'

/** E-mail principal do administrador */
export const ADMIN_EMAIL = (
  import.meta.env.VITE_ADMIN_EMAIL ?? 'andretec26@gmail.com'
).toLowerCase()

/**
 * E-mails autorizados a entrar no painel.
 * Mantém o e-mail antigo como fallback para não bloquear quem já usava o site.
 */
export const ADMIN_EMAILS = Array.from(
  new Set(
    [
      ADMIN_EMAIL,
      'andretec26@gmail.com',
      'andretsc26@gmail.com',
      ...(String(import.meta.env.VITE_ADMIN_EMAILS ?? '')
        .split(',')
        .map((item: string) => item.trim().toLowerCase())
        .filter(Boolean)),
    ].map((item) => item.toLowerCase()),
  ),
)

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'Andre@4869'

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}

export function validateAdminCredentials(email: string, password: string) {
  return isAdminEmail(email) && password === ADMIN_PASSWORD
}

export function isAdminSessionActive() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function getAdminSyncPassword() {
  // Sempre usa a senha do build (Vercel), evita sessão antiga com senha diferente
  return ADMIN_PASSWORD
}
