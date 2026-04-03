'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { signOutAndRedirect } from '@/lib/auth/signOutAndRedirect'


const IDLE_MINUTES = 60

export default function IdleLogout() {
  const router = useRouter()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const armTimer = async () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)

      const { data } = await supabase.auth.getSession()
      if (!data.session?.user || cancelled) return

      timerRef.current = window.setTimeout(async () => {
        const { data: latest } = await supabase.auth.getSession()
        if (!latest.session?.user) return

        await signOutAndRedirect(router, 'idle')
      }, IDLE_MINUTES * 60 * 1000)
    }

    const onActivity = () => {
      void armTimer()
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))

    void armTimer()

    return () => {
      cancelled = true
      events.forEach((e) => window.removeEventListener(e, onActivity))
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [router])

  return null
}