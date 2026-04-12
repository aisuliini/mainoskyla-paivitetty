'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

export default function CityBanner({ city }: { city?: string }) {
  const cityNorm = useMemo(() => (city ?? '').trim(), [city])
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!cityNorm) {
        setBannerUrl(null)
        return
      }

      try {
        const nowIso = new Date().toISOString()

        const { data, error } = await supabase
  .from('city_banners')
  .select('banner_url, starts_at, ends_at')
  .eq('status', 'active')
  .lte('starts_at', nowIso)
  .gte('ends_at', nowIso)
  .ilike('city', cityNorm)
  .order('starts_at', { ascending: false })
  .limit(1)
  .maybeSingle()

        if (cancelled) return

        if (error) {
          console.error('CityBanner error:', error)
          setBannerUrl(null)
          return
        }

        setBannerUrl(data?.banner_url ?? null)
      } catch (e) {
        if (!cancelled) {
          console.error('CityBanner failed:', e)
          setBannerUrl(null)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [cityNorm])

  if (!bannerUrl) return null

  return (
  <div className="mb-6">
    <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border bg-white shadow-sm">
      <Image
        src={bannerUrl}
        alt={`${city ?? ''} banneri`}
        width={1200}
        height={400}
        className="w-full h-[140px] sm:h-[180px] object-cover"
        unoptimized
      />
      <span className="absolute top-3 left-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
        Bannerimainos
      </span>
    </div>
  </div>
)
}