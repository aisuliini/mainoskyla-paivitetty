'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus?: string | null
  sijainti?: string | null
  kuva_url?: string | null
  kategoria?: string | null
  luotu?: string | null
  nayttoja?: number | null
}

export default function IlmoituksetClient({
  initialIlmoitukset,
  city,
}: {
  initialIlmoitukset: Ilmoitus[]
  city?: string
}) {
  const cityNorm = useMemo(() => (city ?? '').trim().toLowerCase(), [city])

  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [loadingBanner, setLoadingBanner] = useState(false)

  useEffect(() => {
    let cancelled = false

    const haeBanneri = async () => {
      if (!cityNorm) {
        setBannerUrl(null)
        setLoadingBanner(false)
        return
      }

      setLoadingBanner(true)

      try {
        const nowIso = new Date().toISOString()

        const { data, error } = await supabase
          .from('city_banners')
          .select('banner_url, city, status, starts_at, ends_at')
          .eq('status', 'active')
          .lte('starts_at', nowIso)
          .gte('ends_at', nowIso)
          .ilike('city', cityNorm) // case-insensitive match

        if (cancelled) return

        if (error) {
          console.error('Banner fetch error:', error)
          setBannerUrl(null)
          return
        }

        // jos useampi osuu, valitaan uusin alkupäivä
        const best =
          (data ?? []).sort((a: any, b: any) =>
            new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
          )[0] ?? null

        setBannerUrl(best?.banner_url ?? null)
      } catch (e) {
        if (cancelled) return
        console.error('Banner fetch failed:', e)
        setBannerUrl(null)
      } finally {
        if (!cancelled) setLoadingBanner(false)
      }
    }

    haeBanneri()

    return () => {
      cancelled = true
    }
  }, [cityNorm])

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {city ? `${city} ilmoitukset` : 'Kaikki ilmoitukset'}
      </h1>

      {/* Kaupunkibanneri */}
      {!loadingBanner && bannerUrl && (
        <div className="mb-8 relative overflow-hidden rounded-2xl shadow-sm border bg-white">
          <img
            src={bannerUrl}
            alt={`${city ?? ''} banneri`}
            className="w-full h-[200px] object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
          <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Mainos
          </span>
        </div>
      )}

      {/* Ilmoitukset */}
      {initialIlmoitukset.map((ilmoitus) => (
        <div key={ilmoitus.id} className="mb-4">
          <h2 className="font-semibold">{ilmoitus.otsikko}</h2>

          <Link className="underline" href={`/ilmoitukset/${ilmoitus.id}`}>
            Katso ilmoitus
          </Link>
        </div>
      ))}
    </section>
  )
}