'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import KuvanLataaja from '@/components/KuvanLataaja'
import imageCompression from 'browser-image-compression'
import { DayPicker } from 'react-day-picker'
import { fi } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'



export default function LisaaBanneri() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [city, setCity] = useState('')
  const [days, setDays] = useState<'30' | '90'>('30')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [citySearch, setCitySearch] = useState('')
  const [showCityList, setShowCityList] = useState(false)
  const [reservedRanges, setReservedRanges] = useState<any[]>([])

  const filteredCities = paikkakunnat
  .filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  )
  .slice(0, 20)
    
  //  Hae käyttäjä aina sivulle tullessa
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session?.user) {
        router.push('/kirjaudu')
        return
      }
      setUser(data.session.user)
    }
    getUser()
  }, [router])

useEffect(() => {

  if (!city) return

  const fetchReserved = async () => {

    const { data } = await supabase
      .from('city_banners')
      .select('starts_at, ends_at')
      .eq('city', city)
      .in('status', ['active','scheduled'])

    if (!data) return

    const ranges = data.map((b) => {
  const from = new Date(b.starts_at)
  const to = new Date(b.ends_at)

  from.setHours(0,0,0,0)
  to.setHours(0,0,0,0)

  return { from, to }
})

    setReservedRanges(ranges)
  }

  fetchReserved()

}, [city, startDate])


  const handleReserve = async () => {
    if (!user) return

    if (!city || !imageFile) {
      setError('Valitse kaupunki ja lisää bannerikuva.')
      return
    }

    setLoading(true)
    setError(null)

    // 1️⃣ Upload kuva
    const fileName = `banner_${Date.now()}.jpg`
    const { error: uploadError } = await supabase
      .storage
      .from('bannerit')
      .upload(fileName, imageFile, { contentType: 'image/jpeg' })

    if (uploadError) {
      setError(uploadError.message)
      setLoading(false)
      return
    }

    const { data: publicUrl } = supabase
      .storage
      .from('bannerit')
      .getPublicUrl(fileName)

    // 2️⃣ Päivämäärät (käytä valittua alkupäivää)
if (!startDate) {
  setError('Valitse alkupäivä.')
  setLoading(false)
  return
}

const startsAt = new Date(startDate)
startsAt.setHours(0, 0, 0, 0)

const endsAt = new Date(startsAt.getTime() + Number(days) * 86400000)

// status: scheduled jos alkaa tulevaisuudessa
const now = new Date()
const status = startsAt > now ? 'scheduled' : 'active'

// 2.5️⃣ Tarkista päällekkäisyydet (active/scheduled)
const { data: overlaps, error: overlapErr } = await supabase
  .from('city_banners')
  .select('id')
  .eq('city', city)
  .in('status', ['active', 'scheduled'])
  .lt('starts_at', endsAt.toISOString())
  .gt('ends_at', startsAt.toISOString())

if (overlapErr) {
  setError(overlapErr.message)
  setLoading(false)
  return
}

if (overlaps && overlaps.length > 0) {
  setError('Valitussa kaupungissa on jo bannerivaraus tälle ajalle. Valitse toinen alkupäivä tai myöhempi ajankohta.')
  setLoading(false)
  return
}

// 3️⃣ Tallenna
const { error: insertError } = await supabase
  .from('city_banners')
  .insert({
    user_id: user.id,
    city,
    banner_url: publicUrl.publicUrl,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    status,
    payment_status: 'free',
  })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.replace('/profiili/bannerit')
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow my-12">
      <h1 className="text-2xl font-bold mb-6">
        Varaa kaupunkibanneri
      </h1>

      <p className="text-sm text-gray-600 mb-6">
Kaupunkibanneri näkyy Mainoskylän sivuilla valitussa kaupungissa.
Yhdessä kaupungissa voi olla vain yksi aktiivinen banneri samalla ajanjaksolla.
</p>

     <label className="block text-sm font-medium mb-1">
Kaupunki
</label>

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
<div className="px-4 py-2 text-sm text-gray-500">
Ei tuloksia
</div>
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

  disabled={[
    { before: new Date() },
    ...reservedRanges
  ]}

  modifiers={{
  reserved: (date) =>
    reservedRanges.some(
      (r) =>
        date >= r.from &&
        date <= r.to
    )
}}

modifiersStyles={{
  reserved: {
    backgroundColor: "#f87171",
    color: "white"
  }
}}
/>
    </div>

      <p className="text-sm text-gray-600 mb-2">
        Bannerin suosituskoko: 1200 x 400 (3:1)
      </p>

      

      <KuvanLataaja
        aspectRatio={3 / 1}
        onImageCropped={async (blob) => {
          const file = new File([blob], 'banner.jpg', { type: 'image/jpeg' })
          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600
          })
          setImageFile(compressed)
        }}
      />

      {error && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}

      <button
        onClick={handleReserve}
        disabled={loading}
        className="w-full mt-6 rounded-xl px-5 py-3 font-semibold text-white bg-[#4F6763]"
      >
        {loading ? 'Tallennetaan...' : 'Varaa banneri'}
      </button>
    </main>
  )
}