'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/consent/events'
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
    return 'Käytämme evästeitä sivuston toimintaan ja analytiikkaan valintasi mukaan.'
  }, [])

  if (!visible) return null

  return (
    <>
      {!showSettings && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 px-3 sm:px-4"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
        >
          <div className="mx-auto w-full max-w-sm rounded-[22px] border border-black/10 bg-white/95 p-3.5 shadow-[0_-10px_24px_rgba(0,0,0,0.10)] backdrop-blur supports-[backdrop-filter]:bg-white/88">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#1E3A41]">
                  Evästeasetukset
                </h2>

                <p className="mt-1 text-[13px] leading-5 text-charcoal/75">
                  {description}{' '}
                  <Link
                    href="/tietosuoja"
                    className="font-medium text-[#1E3A41] underline underline-offset-2"
                  >
                    Lue lisää
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="inline-flex min-h-[42px] w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A41] transition hover:bg-[#F5F8F6]"
                >
                  Muokkaa asetuksia
                </button>

                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex min-h-[42px] w-full items-center justify-center rounded-full bg-[#4F6763] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Hyväksy kaikki
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/20 px-2 sm:px-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mb-0 w-full max-w-md rounded-t-[24px] border border-black/10 bg-white p-4 shadow-2xl sm:mb-6 sm:rounded-[24px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#1E3A41]">
                  Evästeasetukset
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-charcoal/75">
                  Valitse sallittavat evästeet. Välttämättömät ovat aina käytössä.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#1E3A41] transition hover:bg-[#F5F8F6]"
                aria-label="Sulje evästeasetukset"
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid gap-2.5">
              <div className="rounded-2xl border border-black/10 bg-[#FAFCFB] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="pr-3">
                    <h3 className="text-sm font-semibold text-[#1E3A41]">
                      Välttämättömät
                    </h3>
                    <p className="mt-1 text-[13px] leading-5 text-charcoal/70">
                      Tarvitaan sivuston perustoimintoihin, kuten kirjautumiseen ja turvallisuuteen.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#EDF5F2] px-2.5 py-1 text-[11px] font-medium text-[#1E3A41]">
                    Aina käytössä
                  </span>
                </div>
              </div>

              <label className="cursor-pointer rounded-2xl border border-black/10 bg-[#FAFCFB] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="pr-3">
                    <h3 className="text-sm font-semibold text-[#1E3A41]">
                      Analytiikka
                    </h3>
                    <p className="mt-1 text-[13px] leading-5 text-charcoal/70">
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

              <label className="cursor-pointer rounded-2xl border border-black/10 bg-[#FAFCFB] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="pr-3">
                    <h3 className="text-sm font-semibold text-[#1E3A41]">
                      Markkinointi
                    </h3>
                    <p className="mt-1 text-[13px] leading-5 text-charcoal/70">
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

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={saveCustom}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A41] transition hover:bg-[#F5F8F6]"
              >
                Tallenna valinnat
              </button>

              <button
                type="button"
                onClick={acceptNecessaryOnly}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#EDF5F2] px-4 py-2.5 text-sm font-semibold text-[#1E3A41] ring-1 ring-[#4F8F7A]/20 transition hover:bg-[#DCEEE8]"
              >
                Salli vain välttämättömät
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#4F6763] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Hyväksy kaikki
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}