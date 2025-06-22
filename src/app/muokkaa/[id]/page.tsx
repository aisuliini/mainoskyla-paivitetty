'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { addDays } from 'date-fns'
import { fi } from 'date-fns/locale'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'
import imageCompression from 'browser-image-compression'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import { Area } from 'react-easy-crop'


type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kategoria: string
  maksuluokka: string
  kuva_url: string | null
  premium_alku?: string
  premium_loppu?: string
  premium_tyyppi?: string
  tapahtuma_alku?: string
  tapahtuma_loppu?: string
}

export default function MuokkaaIlmoitusta() {
  const router = useRouter()
  const params = useParams()
  const ilmoitusId = params?.id as string

  const [ilmoitus, setIlmoitus] = useState<Ilmoitus | null>(null)
  const [loading, setLoading] = useState(true)

  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kategoria, setKategoria] = useState('')
  const [tyyppi, setTyyppi] = useState('perus')
  const [kuva, setKuva] = useState<File | null>(null)
  const [esikatselu, setEsikatselu] = useState('')
  const [alku, setAlku] = useState<Date | undefined>()
  const [kesto, setKesto] = useState('7')
  const [varatutPaivat, setVaratutPaivat] = useState<Date[]>([])
  const [tapahtumaAlku, setTapahtumaAlku] = useState<Date | undefined>()
  const [tapahtumaLoppu, setTapahtumaLoppu] = useState<Date | undefined>()
  const [sijaintiehdotukset, setSijaintiehdotukset] = useState<string[]>([])
const [crop, setCrop] = useState({ x: 0, y: 0 })
const [zoom, setZoom] = useState(1)
const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
const [showCropper, setShowCropper] = useState(false)

  useEffect(() => {
    if (!ilmoitusId) return

    const haeIlmoitus = async () => {
      const { data, error } = await supabase.from('ilmoitukset').select('*').eq('id', ilmoitusId).single()
      if (error || !data) return alert('Ilmoitusta ei löytynyt.')
      setIlmoitus(data)
      setOtsikko(data.otsikko || '')
      setKuvaus(data.kuvaus || '')
      setSijainti(data.sijaint || '')
      setKategoria(data.kategoria || '')
      setTyyppi(data.maksuluokka || 'perus')
      setEsikatselu(data.kuva_url || '')
      if (data.premium_alku) setAlku(new Date(data.premium_alku))
      if (data.premium_alku && data.premium_loppu) {
        const alkuDate = new Date(data.premium_alku)
        const loppuDate = new Date(data.premium_loppu)
        const kestoPaivia = Math.round((loppuDate.getTime() - alkuDate.getTime()) / (1000 * 60 * 60 * 24))
        setKesto(kestoPaivia.toString())
      }
      if (data.tapahtuma_alku) setTapahtumaAlku(new Date(data.tapahtuma_alku))
      if (data.tapahtuma_loppu) setTapahtumaLoppu(new Date(data.tapahtuma_loppu))
      setLoading(false)
    }

    haeIlmoitus()
  }, [ilmoitusId])

  useEffect(() => {
    if (sijainti.length === 0) {
      setSijaintiehdotukset([])
      return
    }

    const ehdotukset = paikkakunnat
      .filter((nimi: string) =>
        nimi.toLowerCase().startsWith(sijainti.toLowerCase())
      )
      .slice(0, 10)

    setSijaintiehdotukset(ehdotukset)
  }, [sijainti])

  useEffect(() => {
    const haeVaratut = async () => {
      const nytISO = new Date().toISOString()
      const { data } = await supabase
        .from('ilmoitukset')
        .select('premium_alku, premium_loppu, premium_tyyppi')
        .eq('premium_tyyppi', 'etusivu')
        .gte('premium_loppu', nytISO)

      const paivaLaskuri: { [päivä: string]: number } = {}
      data?.forEach((ilmo: { premium_alku: string; premium_loppu: string }) => {
        const alku = new Date(ilmo.premium_alku)
        const loppu = new Date(ilmo.premium_loppu)
        for (let d = alku; d <= loppu; d = addDays(d, 1)) {
          const key = d.toISOString().split('T')[0]
          paivaLaskuri[key] = (paivaLaskuri[key] || 0) + 1
        }
      })

      const punaiset = Object.entries(paivaLaskuri)
        .filter(([, count]) => count >= 20)
        .map(([päivä]) => new Date(päivä))

      setVaratutPaivat(punaiset)
    }

    if (tyyppi === 'premium') {
      haeVaratut()
    }
  }, [tyyppi])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  if (!ilmoitus) {
    alert('Ilmoitus ei ole ladattu vielä.')
    return
  }

  let kuvaUrl = ilmoitus.kuva_url


    if (kuva) {
      const tiedostonimi = `${Date.now()}_${kuva.name}`
      const { error } = await supabase.storage.from('kuvat').upload(tiedostonimi, kuva)
      if (!error) {
        const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
        kuvaUrl = publicUrl.publicUrl
      }
    }

    const loppuDate = alku ? new Date(alku.getTime() + parseInt(kesto) * 86400000) : null

    const { error } = await supabase
      .from('ilmoitukset')
      .update({
        otsikko,
        kuvaus,
        sijainti,
        kategoria,
        maksuluokka: tyyppi,
        kuva_url: kuvaUrl,
        premium: tyyppi === 'premium',
        premium_alku: tyyppi === 'premium' ? alku?.toISOString() : null,
        premium_loppu: tyyppi === 'premium' ? loppuDate?.toISOString() : null,
        premium_tyyppi: tyyppi === 'premium' ? 'etusivu' : null,
        tapahtuma_alku: kategoria === 'Tapahtumat' ? tapahtumaAlku?.toISOString() : null,
        tapahtuma_loppu: kategoria === 'Tapahtumat' ? tapahtumaLoppu?.toISOString() : null,
      })
      .eq('id', ilmoitusId)

    if (!error) {
      alert('Ilmoitus päivitetty!')
      router.push('/profiili')
    } else {
      alert('Päivitys epäonnistui: ' + error.message)
    }
  }

  if (loading) return <p className="text-center py-8">Ladataan...</p>

  return (
    <main className="max-w-xl mx-auto px-4 py-8 bg-white rounded shadow my-12">
      <h1 className="text-2xl font-bold mb-4">Muokkaa ilmoitusta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Otsikko"
          value={otsikko}
          onChange={(e) => setOtsikko(e.target.value)}
          maxLength={80}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <p className="text-sm text-gray-500 text-right">{otsikko.length}/80 merkkiä</p>

        <textarea
          placeholder="Kuvaus"
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <div className="relative">
          <input
            type="text"
            placeholder="Sijainti (esim. Tampere)"
            value={sijainti}
            onChange={(e) => setSijainti(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          {sijaintiehdotukset.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow text-sm max-h-40 overflow-y-auto">
              {sijaintiehdotukset.map((ehdotus, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setSijainti(ehdotus)
                    setSijaintiehdotukset([])
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {ehdotus}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select value={kategoria} onChange={(e) => setKategoria(e.target.value)} required className="w-full border px-4 py-2 rounded">
          <option value="">Valitse kategoria</option>
          <option value="Palvelut">Palvelut</option>
          <option value="Hyvinvointi ja Kauneus">Hyvinvointi ja Kauneus</option>
          <option value="Koti ja Remontointi">Koti ja Remontointi</option>
          <option value="Eläinpalvelut">Eläinpalvelut</option>
          <option value="Pientuottajat">Pientuottajat</option>
          <option value="Käsityöläiset">Käsityöläiset</option>
          <option value="Media ja Luovuus">Media ja Luovuus</option>
          <option value="Kurssit ja Koulutukset">Kurssit ja Koulutukset</option>
          <option value="Vuokratilat ja Juhlapaikat">Vuokratilat ja Juhlapaikat</option>
          <option value="Ilmoitustaulu">Ilmoitustaulu</option>
          <option value="Tapahtumat">Tapahtumat</option>
          <option value="Vapaa-aika">Vapaa-aika</option>
          <option value="Muut">Muut</option>
        </select>

        {kategoria === 'Tapahtumat' && (
          <>
            <label>Tapahtuman alkupäivä:</label>
            <DayPicker selected={tapahtumaAlku} onSelect={setTapahtumaAlku} locale={fi} mode="single" />
            <label>Tapahtuman loppupäivä:</label>
            <DayPicker selected={tapahtumaLoppu} onSelect={setTapahtumaLoppu} locale={fi} mode="single" />
          </>
        )}

        <input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const tiedosto = e.target.files?.[0]
    if (!tiedosto) return

    try {
      const pakattu = await imageCompression(tiedosto, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })

      const reader = new FileReader()
reader.onload = (event: ProgressEvent<FileReader>) => {
  const tulos = event.target?.result
  if (typeof tulos === 'string') {
    setEsikatselu(tulos)
    setShowCropper(true)
  }
}
reader.readAsDataURL(pakattu)


    
    } catch (err) {
      console.error('Kuvan pakkaus epäonnistui:', err)
      alert('Kuvan pakkaus epäonnistui.')
    }
  }}
  className="w-full"
/>

{showCropper && esikatselu && (
  <div className="relative w-full h-64 bg-gray-200">
    <Cropper
      image={esikatselu}
      crop={crop}
      zoom={zoom}
      aspect={4 / 3}
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={(_: Area, croppedAreaPixels: Area) => setCroppedAreaPixels(croppedAreaPixels)}

    />
    <button
      type="button"
      onClick={async () => {
        if (!esikatselu || !croppedAreaPixels) return
        const croppedFile = await getCroppedImg(esikatselu, croppedAreaPixels)
        setKuva(croppedFile)
        setEsikatselu(URL.createObjectURL(croppedFile))
        setShowCropper(false)
      }}
      className="absolute bottom-2 right-2 bg-green-600 text-white px-4 py-2 rounded"
    >
      Käytä rajattua kuvaa
    </button>
  </div>
)}

{esikatselu && !showCropper && (
  <img
    src={esikatselu}
    alt="Esikatselu"
    className="h-32 rounded shadow object-cover"
  />
)}

        <label>Valitse ilmoitustyyppi:</label>
        <select value={tyyppi} onChange={(e) => setTyyppi(e.target.value)} className="w-full border px-4 py-2 rounded">
          <option value="perus">Perusilmoitus</option>
          <option value="nosto">Nosto haun kärkeen</option>
          <option value="premium">Premium näkyvyys</option>
        </select>

        {tyyppi === 'premium' && (
          <>
            <label>Näkyvyysaika:</label>
            <select value={kesto} onChange={(e) => setKesto(e.target.value)} className="w-full border px-4 py-2 rounded">
              <option value="7">7 päivää</option>
              <option value="14">14 päivää</option>
              <option value="30">30 päivää</option>
            </select>

            <label>Premium-alkupäivä:</label>
            <DayPicker
              mode="single"
              selected={alku}
              onSelect={setAlku}
              modifiers={{ varattu: varatutPaivat }}
              modifiersClassNames={{ varattu: 'bg-red-500 text-white' }}
              locale={fi}
            />
          </>
        )}

        <button type="submit" className="bg-[#3f704d] text-white px-6 py-2 rounded hover:bg-[#2f5332]">
          Tallenna muutokset
        </button>
      </form>
    </main>
  )
}
