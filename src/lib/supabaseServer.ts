import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY missing')
}

// Julkisiin server-hakuihin
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Kirjautuneen käyttäjän server-client
export async function getSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({
            name,
            value,
            ...options,
          })
        } catch {
          // Server component -kontekstissa tämä voi joskus olla read-only.
          // Middleware hoitaa varsinaisen session synkronoinnin.
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        } catch {
          // Middleware hoitaa varsinaisen session synkronoinnin.
        }
      },
    },
  })
}