'use client'

import { useEffect, useMemo, useState } from 'react'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { readConsent, type CookieConsent } from '@/lib/consent/consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

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
  const allowMarketing = useMemo(() => consent?.marketing === true, [consent])

  if (!ready) return null

  return (
    <>
      {(allowAnalytics || allowMarketing) && (
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      )}

      {allowMarketing && (
        <>
          <Script
            id="google-ads-src"
            src="https://www.googletagmanager.com/gtag/js?id=AW-17851457912"
            strategy="afterInteractive"
          />
          <Script
            id="google-ads-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', 'AW-17851457912');
              `,
            }}
          />
        </>
      )}

      {allowAnalytics && <Analytics />}
    </>
  )
}