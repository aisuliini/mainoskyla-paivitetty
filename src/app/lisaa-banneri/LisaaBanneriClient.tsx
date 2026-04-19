'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import KuvanLataaja from '@/features/listings/components/KuvanLataaja'
import imageCompression from 'browser-image-compression'
import { DayPicker } from 'react-day-picker'
import { fi } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'

type Props = {
  userId: string
}

export default function LisaaBanneriClient({ userId }: Props) {
  const router = useRouter()

  const [city, setCity] = useState('')
  const [days, setDays] = useState<'30' | '90'>('30')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [citySearch, setCitySearch] = useState('')
  const [showCityList, setShowCityList] = useState(false)
  const [reservedRanges, setReservedRanges] = useState<{ from: Date; to: Date }[]>([])

  const filteredCities = paikkakunnat
    .filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
    .slice(0, 20)

  useEffect(() => {
    if (!city) {
      setReservedRanges([])
      return
    }

    const fetchReserved = async () => {
      const { data } = await supabase
        .from('city_banners')
        .select('starts_at, ends_at')
        .eq('city', city)
        .in('status', ['active', 'scheduled'])

      if (!data) {
        setReservedRanges([])
        return
      }

      const ranges = data
        .filter((b) => b.starts_at && b.ends_at)
        .map((b) => {
          const from = new Date(b.starts_at)
          const to = new Date(b.ends_at)

          from.setHours(0, 0, 0, 0)
          to.setHours(0, 0, 0, 0)

          return { from, to }
        })

      setReservedRanges(ranges)
    }

    void fetchReserved()
  }, [city])

  const handleReserve = async () => {
    if (!userId) {
      setError('Kirjaudu sisään ennen bannerihakemuksen lähettämistä.')
      return
    }

    if (!city) {
      setError('Valitse kaupunki.')
      return
    }

    if (!imageFile) {
      setError('Lisää bannerikuva.')
      return
    }

    if (!startDate) {
      setError('Valitse alkupäivä.')
      return
    }

    setLoading(true)
    setError(null)

    const startsAt = new Date(startDate)
    startsAt.setHours(0, 0, 0, 0)

    const endsAt = new Date(startsAt.getTime() + Number(days) * 86400000)

    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    if (!accessToken) {
      setError('Istunto puuttuu. Kirjaudu uudelleen.')
      setLoading(false)
      return
    }

    const filePath = `${userId}/banner_${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('bannerit')
      .upload(filePath, imageFile, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      setError(uploadError.message)
      setLoading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('bannerit')
      .getPublicUrl(filePath)

    const bannerUrl = publicUrlData?.publicUrl ?? null

    if (!bannerUrl) {
      await supabase.storage.from('bannerit').remove([filePath])
      setError('Bannerikuvan julkisen osoitteen muodostaminen epäonnistui.')
      setLoading(false)
      return
    }

    const response = await fetch('/api/city-banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        city: city.trim(),
        banner_url: bannerUrl,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
      }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      await supabase.storage.from('bannerit').remove([filePath])
      setError(result?.error || 'Bannerihakemuksen tallennus epäonnistui.')
      setLoading(false)
      return
    }

    setLoading(false)
    router.replace('/profiili/bannerit')
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow my-12">
      <h1 className="text-2xl font-bold mb-6">Lähetä kaupunkibannerihakemus</h1>

      <p className="text-sm text-gray-600 mb-6">
        Kaupunkibanneri näkyy Mainoskylän sivuilla valitussa kaupungissa.
        Yhdessä kaupungissa voi olla vain yksi aktiivinen tai ajastettu banneri samalla ajanjaksolla.
        Hakemus tarkistetaan ennen hyväksyntää.
      </p>

      <label className="block text-sm font-medium mb-1">Kaupunki</label>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Kirjoita kaupunki (esim. Kerava)"
          value={citySearch}
          onChange={(e) => {
            setCitySearch(e.target.value)
            setShowCityList(true)
          }}
          className="w-full border px-4 py-2 rounded"
        />

        {showCityList && citySearch.length > 0 && (
          <div className="absolute z-20 bg-white border w-full rounded shadow max-h-60 overflow-y-auto">
            {filteredCities.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">Ei tuloksia</div>
            )}

            {filteredCities.map((kaupunki) => (
              <button
                key={kaupunki}
                type="button"
                onClick={() => {
                  setCity(kaupunki)
                  setCitySearch(kaupunki)
                  setShowCityList(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                {kaupunki}
              </button>
            ))}
          </div>
        )}
      </div>

      <select
        value={days}
        onChange={(e) => setDays(e.target.value as '30' | '90')}
        className="w-full border px-4 py-2 rounded mb-4"
      >
        <option value="30">30 päivää</option>
        <option value="90">90 päivää</option>
      </select>

      <label className="block text-sm font-medium mt-4">Alkupäivä</label>

      <div className="border rounded-lg p-3 bg-white">
        <DayPicker
          mode="single"
          selected={startDate ?? undefined}
          onSelect={(d) => setStartDate(d ?? null)}
          locale={fi}
          disabled={[{ before: new Date() }, ...reservedRanges]}
          modifiers={{
            reserved: (date) =>
              reservedRanges.some((r) => date >= r.from && date <= r.to),
          }}
          modifiersStyles={{
            reserved: {
              backgroundColor: '#f87171',
              color: 'white',
            },
          }}
        />
      </div>

      <p className="text-sm text-gray-600 mb-2 mt-4">
        Bannerin suosituskoko: 1200 × 400 (3:1)
      </p>

      <KuvanLataaja
        aspectRatio={3 / 1}
        onImageCropped={async (blob) => {
          const file = new File([blob], 'banner.jpg', { type: 'image/jpeg' })

          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
          })

          setImageFile(compressed)
        }}
      />

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        type="button"
        onClick={handleReserve}
        disabled={loading}
        className="w-full mt-6 rounded-xl px-5 py-3 font-semibold text-white bg-[#4F6763] disabled:opacity-60"
      >
        {loading ? 'Lähetetään...' : 'Lähetä bannerihakemus'}
      </button>
    </main>
  )
}