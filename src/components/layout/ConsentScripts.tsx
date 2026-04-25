'use client'

import { useEffect, useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { readConsent, type CookieConsent } from '@/lib/consent/consent'

export default function ConsentScripts() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const syncConsent = () => {
      setConsent(readConsent())
      setReady(true)
    }

    syncConsent()
    window.addEventListener('cookie-consent-updated', syncConsent)

    return () => {
      window.removeEventListener('cookie-consent-updated', syncConsent)
    }
  }, [])

  const allowAnalytics = useMemo(() => consent?.analytics === true, [consent])

  if (!ready) return null

  return <>{allowAnalytics && <Analytics />}</>
}