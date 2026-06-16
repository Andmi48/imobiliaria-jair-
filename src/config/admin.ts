export const AUTH_KEY = 'jairacosta-admin-auth'
export const SYNC_PASSWORD_KEY = 'jairacosta-admin-sync-password'

export const ADMIN_EMAIL = (
  import.meta.env.VITE_ADMIN_EMAIL ?? 'andretsc26@gmail.com'
).toLowerCase()

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'Andre@4869'

export function validateAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export function isAdminSessionActive() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function getAdminSyncPassword() {
  return sessionStorage.getItem(SYNC_PASSWORD_KEY) ?? ADMIN_PASSWORD
}
