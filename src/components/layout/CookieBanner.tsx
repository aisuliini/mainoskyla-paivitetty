'use client'

import { useEffect, useMemo, useState } from 'react'
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/consent/events'
import Link from 'next/link'
import {
  getAcceptAllConsent,
  getNecessaryOnlyConsent,
  readConsent,
  writeConsent,
} from '@/lib/consent/consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
  const openSettings = () => {
    const saved = readConsent()

    if (saved) {
      setAnalytics(saved.analytics)
      setMarketing(saved.marketing)
    }

    setVisible(true)
    setShowSettings(true)
  }

  window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)

  return () => {
    window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)
  }
}, [])

  useEffect(() => {
    const saved = readConsent()

    if (!saved) {
      setVisible(true)
      return
    }

    setAnalytics(saved.analytics)
    setMarketing(saved.marketing)
    setVisible(false)
  }, [])

  const saveCustom = () => {
    writeConsent({
      necessary: true,
      analytics,
      marketing,
      version: 1,
      updatedAt: new Date().toISOString(),
    })
    setVisible(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    writeConsent(getAcceptAllConsent())
    setVisible(false)
    setShowSettings(false)
  }

  const acceptNecessaryOnly = () => {
    writeConsent(getNecessaryOnlyConsent())
    setVisible(false)
    setShowSettings(false)
  }

  const description = useMemo(() => {
    return 'Käytämme välttämättömiä evästeitä sivuston toimintaan sekä valintasi mukaan analytiikka- ja markkinointievästeitä palvelun kehittämiseen ja mainonnan mittaamiseen.'
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="max-w-3xl">
            <h2 className="text-sm sm:text-base font-semibold text-[#1E3A41]">
              Evästeasetukset
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-charcoal/75">
              {description}{' '}
              <Link
                href="/tietosuoja"
                className="font-medium text-[#1E3A41] underline underline-offset-2"
              >
                Lue lisää tietosuojasta
              </Link>
              .
            </p>
          </div>

          {showSettings && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-[#FAFCFB] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E3A41]">
                      Välttämättömät
                    </h3>
                    <p className="mt-1 text-sm text-charcoal/70">
                      Tarvitaan sivuston perustoimintoihin, kuten kirjautumiseen ja turvallisuuteen.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EDF5F2] px-2.5 py-1 text-xs font-medium text-[#1E3A41]">
                    Aina käytössä
                  </span>
                </div>
              </div>

              <label className="rounded-2xl border border-black/10 bg-[#FAFCFB] p-4 cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E3A41]">
                      Analytiikka
                    </h3>
                    <p className="mt-1 text-sm text-charcoal/70">
                      Auttaa ymmärtämään, miten sivustoa käytetään ja mitä kannattaa parantaa.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </label>

              <label className="rounded-2xl border border-black/10 bg-[#FAFCFB] p-4 cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E3A41]">
                      Markkinointi
                    </h3>
                    <p className="mt-1 text-sm text-charcoal/70">
                      Käytetään mainonnan mittaamiseen ja mahdolliseen kohdentamiseen.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </label>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {!showSettings && (
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A41] hover:bg-[#F5F8F6] transition"
              >
                Muokkaa asetuksia
              </button>
            )}

            {showSettings && (
              <button
                type="button"
                onClick={saveCustom}
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A41] hover:bg-[#F5F8F6] transition"
              >
                Tallenna valinnat
              </button>
            )}

            <button
              type="button"
              onClick={acceptNecessaryOnly}
              className="inline-flex items-center justify-center rounded-full bg-[#EDF5F2] px-4 py-2.5 text-sm font-semibold text-[#1E3A41] ring-1 ring-[#4F8F7A]/20 hover:bg-[#DCEEE8] transition"
            >
              Salli vain välttämättömät
            </button>

            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex items-center justify-center rounded-full bg-[#4F6763] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
            >
              Hyväksy kaikki
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}