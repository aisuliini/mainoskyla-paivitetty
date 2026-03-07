'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CityBanner({ city }: { city?: string }) {
  const cityNorm = useMemo(() => (city ?? '').trim().toLowerCase(), [city])
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
          .select('banner_url, starts_at')
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
    <div className="mb-6 relative overflow-hidden rounded-2xl shadow-sm border bg-white">
      <img
        src={bannerUrl}
        alt={`${city ?? ''} banneri`}
        className="w-full h-[200px] object-cover"
      />
      <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Mainos
      </span>
    </div>
  )
}