'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const IDLE_MINUTES = 30 // ✅ vaihda halutuksi: 15 / 30 / 60

export default function IdleLogout() {
  const router = useRouter()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const reset = async () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)

      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) return

      timerRef.current = window.setTimeout(async () => {
        await supabase.auth.signOut()
        router.replace('/kirjaudu?reason=idle')
        router.refresh()
      }, IDLE_MINUTES * 60 * 1000)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))

    reset()

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset as any))
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [router])

  return null
}