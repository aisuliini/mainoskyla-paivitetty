'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackClient() {
  const router = useRouter()
  const sp = useSearchParams()
  const code = sp.get('code')

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          if (!cancelled) {
            router.replace('/kirjaudu?error=oauth_exchange')
          }
          return
        }
      }

      const { data } = await supabase.auth.getSession()

      if (cancelled) return

      if (data.session?.user) {
        router.replace('/profiili')
        router.refresh()
      } else {
        router.replace('/kirjaudu?error=auth')
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [router, code])

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold">Vahvistetaan kirjautuminen…</h1>
      <p className="text-sm opacity-70 mt-2">Hetki vielä.</p>
    </main>
  )
}