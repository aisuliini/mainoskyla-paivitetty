'use client'

import { useEffect, useMemo, useState } from 'react'
import KuvaCarousel from '@/components/KuvaCarousel'
import { FaInstagram, FaGlobe } from 'react-icons/fa'
import ShareButtons from '@/components/ShareButtons'
import type { ListingDetail } from '@/lib/listings/getListingById'
import type { ListingProfile } from '@/lib/listings/getListingProfile'

type Ilmoitus = ListingDetail
type Profiili = ListingProfile

export default function IlmoitusClient({
  initialIlmoitus,
}: {
  initialIlmoitus: Ilmoitus
  initialProfiili: Profiili | null
}) {
  const ilmoitus = initialIlmoitus
  const id = ilmoitus.id
  const [naytot, setNaytot] = useState(ilmoitus.nayttoja ?? 0)

  const kuvatRaw = ilmoitus.kuvat ?? null

  const kuvatArr = useMemo(() => {
    if (!kuvatRaw) return null
    try {
      const parsed = JSON.parse(kuvatRaw)
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).slice(0, 4) as string[]
      }
      return null
    } catch {
      return null
    }
  }, [kuvatRaw])

  useEffect(() => {
  if (!id) return

  const key = `viewed_${id}`
  const last = sessionStorage.getItem(key)
  const now = Date.now()
  const THIRTY_MIN = 30 * 60 * 1000

  if (!last || now - Number(last) > THIRTY_MIN) {
    sessionStorage.setItem(key, String(now))

    fetch('/api/ilmoitus/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      cache: 'no-store',
    })
      .then((res) => {
        if (res.ok) {
          setNaytot((prev) => prev + 1)
        }
      })
      .catch(() => {})
  }
}, [id])

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/ilmoitukset/${ilmoitus.id}`
      : ''

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-12">
      <div className="mb-4">
        <KuvaCarousel
          kuvaUrl={ilmoitus.kuva_url ?? null}
          kuvat={kuvatArr}
          autoMs={5000}
          max={4}
          alt={ilmoitus.otsikko ?? 'Ilmoitus'}
        />
      </div>

      <h1 className="text-2xl font-bold break-words">{ilmoitus.otsikko}</h1>

      <div className="mt-3 flex items-center gap-2">
        <ShareButtons
          title={ilmoitus.otsikko}
          text="Löytyi Mainoskylästä!"
          url={shareUrl}
        />

        {ilmoitus.linkki && (
          <a
            href={ilmoitus.linkki.startsWith('http') ? ilmoitus.linkki : `https://${ilmoitus.linkki}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
            aria-label="Avaa linkki"
            title="Linkki"
          >
            {ilmoitus.linkki.includes('instagram.com') ? <FaInstagram /> : <FaGlobe />}
          </a>
        )}
      </div>

      <p className="mt-4 text-gray-800 whitespace-pre-line">{ilmoitus.kuvaus}</p>

  <p className="mt-2 text-sm text-gray-500">Katselukerrat: {naytot}</p>
      {(ilmoitus.puhelin || ilmoitus.sahkoposti || ilmoitus.linkki) && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Yhteystiedot</h2>

          {ilmoitus.puhelin && (
            <p className="text-sm text-gray-800">
              <b>Puhelin:</b>{' '}
              <a className="underline" href={`tel:${ilmoitus.puhelin}`}>
                {ilmoitus.puhelin}
              </a>
            </p>
          )}

          {ilmoitus.sahkoposti && (
            <p className="text-sm text-gray-800">
              <b>Sähköposti:</b>{' '}
              <a className="underline" href={`mailto:${ilmoitus.sahkoposti}`}>
                {ilmoitus.sahkoposti}
              </a>
            </p>
          )}

          {ilmoitus.linkki && (
            <p className="text-sm text-gray-800">
              <b>Linkki:</b>{' '}
              <a
                className="underline"
                href={ilmoitus.linkki.startsWith('http') ? ilmoitus.linkki : `https://${ilmoitus.linkki}`}
                target="_blank"
                rel="noreferrer"
              >
                {ilmoitus.linkki}
              </a>
            </p>
          )}
        </div>
      )}
    </main>
  )
}