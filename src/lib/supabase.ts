import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function isCloudEnabled() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export const supabase: SupabaseClient | null =
  isCloudEnabled() ? createClient(supabaseUrl!, supabaseAnonKey!) : null
