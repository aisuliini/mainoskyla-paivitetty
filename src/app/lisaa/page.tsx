'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { fi } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { addDays } from 'date-fns'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import KuvanLataaja from '@/components/KuvanLataaja'




export default function LisaaIlmoitus() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kuva, setKuva] = useState<File | null>(null)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsSubmitting(true)
  console.log('Lomake lähetetty')
  await handleUpload()
}

  const [esikatselu, setEsikatselu] = useState<string>('')
  const [tyyppi, setTyyppi] = useState('perus')
  const [alku, setAlku] = useState<Date | undefined>()
  const [kesto, setKesto] = useState('7')
  const [kategoria, setKategoria] = useState('')
  const [varatutPaivat, setVaratutPaivat] = useState<Date[]>([])
  const [sijaintiehdotukset, setSijaintiehdotukset] = useState<string[]>([])
  const [tapahtumaAlku, setTapahtumaAlku] = useState<Date | undefined>()
const [tapahtumaLoppu, setTapahtumaLoppu] = useState<Date | undefined>()
const [user, setUser] = useState<{ id: string } | null>(null)
const [isSubmitting, setIsSubmitting] = useState(false)



const ilmoituksenAlku =
  tyyppi === 'premium'
    ? alku
    : new Date()

const loppuDate =
  ilmoituksenAlku
    ? new Date(ilmoituksenAlku.getTime() + (parseInt(kesto || '0') || 0) * 86400000)
    : null

  


// Sulkee ehdotuslistan kun klikataan ulos
useEffect(() => {
  function onClickOutside(e: MouseEvent) {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setSijaintiehdotukset([])
    }
  }
  document.addEventListener('mousedown', onClickOutside)
  return () => {
    document.removeEventListener('mousedown', onClickOutside)
  }
}, [])

// Päivitä sijaintiehdotukset, kun käyttäjä kirjoittaa
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
  const haeKayttaja = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session?.user) {
  setUser(sessionData.session.user)
}

  }
  haeKayttaja()
}, [])


  useEffect(() => {
  const haePremiumKalenteri = async () => {
    const nytISO = new Date().toISOString()
    const { data } = await supabase
  .from('ilmoitukset')
  .select('*')
  .eq('premium', true)
  .eq('premium_tyyppi', 'etusivu')
  .gte('premium_loppu', nytISO)


    const paivaLaskuri: { [päivä: string]: number } = {}


    type PremiumIlmoitus = {
  premium_alku: string
  premium_loppu: string
}

data?.forEach((ilmo: PremiumIlmoitus) => {
  const alku = new Date(ilmo.premium_alku)
  const loppu = new Date(ilmo.premium_loppu)
  for (let d = alku; d <= loppu; d = addDays(d, 1)) {
    const key = d.toISOString().split('T')[0]
    paivaLaskuri[key] = (paivaLaskuri[key] || 0) + 1
  }
})


    const punaiset = Object.entries(paivaLaskuri)
      .filter(([, count]) => count >= 20) // Näytä punaisena vain jos 20+ varattu
      .map(([päivä]) => new Date(päivä))

    setVaratutPaivat(punaiset)
  }

  if (tyyppi === 'premium') {
    haePremiumKalenteri()
  }
}, [tyyppi])

useEffect(() => {
  if (tyyppi === 'perus' && !alku) {
    setAlku(new Date())
  }
}, [tyyppi, alku])

useEffect(() => {
  if (tapahtumaAlku && !tapahtumaLoppu) {
    setTapahtumaLoppu(tapahtumaAlku)
  }
}, [tapahtumaAlku, tapahtumaLoppu])


const handleUpload = async () => {
  console.log('handleUpload käynnissä')
  const nykyhetki = new Date()
  let kuvaUrl = ''

  if (!user) {
    alert('Käyttäjätietoja ei saatu. Yritä hetken päästä uudelleen.')
    setIsSubmitting(false)
   return
  }

  // Lataa kuva jos valittu
  if (kuva) {
    const tiedostonimi = `${Date.now()}_${kuva.name}`
    const { error } = await supabase.storage.from('kuvat').upload(tiedostonimi, kuva)

    if (!error) {
      const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
      kuvaUrl = publicUrl.publicUrl
    }
  }


  if (tyyppi === 'premium' && alku && loppuDate) {
    const { data: aktiiviset } = await supabase
      .from('ilmoitukset')
      .select('premium_alku, premium_loppu')
      .eq('premium', true)
      .eq('premium_tyyppi', 'etusivu')
      .not('premium_alku', 'is', null)
      .not('premium_loppu', 'is', null)

    const paivaLaskuri: { [päivä: string]: number } = {}
    aktiiviset?.forEach((ilmo) => {
      const alkuPvm = new Date(ilmo.premium_alku)
      const loppuPvm = new Date(ilmo.premium_loppu)
      for (let d = new Date(alkuPvm); d <= loppuPvm; d = addDays(d, 1)) {
        const key = d.toISOString().split('T')[0]
        paivaLaskuri[key] = (paivaLaskuri[key] || 0) + 1
      }
    })

    const valitutPaivat: Date[] = []
    for (let d = new Date(alku); d <= loppuDate; d = addDays(d, 1)) {
      valitutPaivat.push(new Date(d))
    }

    const ylitykset = valitutPaivat.filter((p) => {
      const key = p.toISOString().split('T')[0]
      const maara = paivaLaskuri[key] || 0
      return maara >= 20
    })

    if (ylitykset.length > 0) {
      alert('Valituilla päivillä ei ole enää vapaata premium-näkyvyyspaikkaa.')
      setIsSubmitting(false)
      return
    }
  }

  const ilmoitus = {
  user_id: user.id,
  otsikko,
  kuvaus,
  sijainti,
  kuva_url: kuvaUrl,
  maksuluokka: tyyppi,
  kategoria,
  premium: tyyppi === 'premium' && (!alku || alku <= nykyhetki),
  premium_alku: tyyppi === 'premium' ? alku?.toISOString() : null,
  premium_loppu: tyyppi === 'premium' ? loppuDate?.toISOString() : null,
  voimassa_alku: tyyppi !== 'premium' ? nykyhetki.toISOString() : null,
  voimassa_loppu: tyyppi !== 'premium' ? loppuDate?.toISOString() : null,
  premium_tyyppi: tyyppi === 'premium' ? 'etusivu' : null,
  nayttoja: 0,
  luotu: nykyhetki.toISOString(),
  tapahtuma_alku: kategoria === 'Tapahtumat' ? tapahtumaAlku?.toISOString() : null,
  tapahtuma_loppu: kategoria === 'Tapahtumat' ? tapahtumaLoppu?.toISOString() : null,
}


  const { error } = await supabase.from('ilmoitukset').insert(ilmoitus)
  console.log('Insert error:', error)

  if (!error) {
  alert('Ilmoitus päivitetty!')
  router.push('/profiili')
} else {
  alert('Päivitys epäonnistui: ' + error.message)
}
setIsSubmitting(false)
} 

  return (
  <main className="max-w-xl mx-auto px-4 sm:px-6 py-8 bg-white rounded shadow my-12">
    {!user ? (
      <div className="text-center py-16">
        <h1 className="text-2xl font-semibold mb-4">Kirjautuminen vaaditaan</h1>
        <p className="mb-6">Sinun täytyy olla kirjautunut lisätäksesi ilmoituksen.</p>
        <button
          onClick={() => router.push('/kirjaudu')}
          className="bg-[#F5A3B3] text-[#1E3A41] px-6 py-3 rounded hover:bg-[#3f704d]"
        >
          Siirry kirjautumaan
        </button>
      </div>
    ) : (
      <>
        <h1 className="text-2xl font-bold mb-4">Lisää uusi ilmoitus</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
  type="text"
  placeholder="Otsikko"
  value={otsikko}
  onChange={(e) => setOtsikko(e.target.value)}
  required
  maxLength={80}
  className="w-full border px-4 py-2 rounded break-words"
/>
<p className="text-sm text-gray-500 text-right">{otsikko.length}/80 merkkiä</p>

          <textarea placeholder="Kuvaus" value={kuvaus} onChange={(e) => setKuvaus(e.target.value)} required className="w-full border px-4 py-2 rounded" />
          
          <div ref={wrapperRef} className="relative">
            <input
              type="text"
              placeholder="Sijainti (esim. Porvoo)"
              value={sijainti}
              onChange={(e) => setSijainti(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const match = sijaintiehdotukset.find(p => p.toLowerCase() === sijainti.toLowerCase())
                  if (match) {
                    e.preventDefault()
                    setSijainti(match)
                    setSijaintiehdotukset([])
                  }
                }
              }}
              required
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

          { kategoria === 'Tapahtumat' && (
  <>
    <label className="block">Tapahtuman alkupäivä:</label>
    <DayPicker
      mode="single"
      selected={tapahtumaAlku}
      onSelect={setTapahtumaAlku}
      locale={fi}
    />

    <label className="block">Tapahtuman loppupäivä:</label>
    <DayPicker
      mode="single"
      selected={tapahtumaLoppu}
      onSelect={setTapahtumaLoppu}
      locale={fi}
    />
  </>
)}


          <KuvanLataaja
  onImageCropped={async (rajattuBlob) => {
    const tiedosto = new File([rajattuBlob], 'rajaus.jpg', { type: 'image/jpeg' })

    try {
      const pakattu = await imageCompression(tiedosto, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })

      setEsikatselu(URL.createObjectURL(pakattu))
      setKuva(pakattu)
    } catch (err) {
      console.error('Kuvan pakkaus epäonnistui:', err)
      alert('Kuvan pakkaus epäonnistui.')
    }
  }}
/>



          {esikatselu && (
  <div className="relative aspect-[4/3] w-full bg-gray-100 rounded overflow-hidden mb-4">
    <Image
      src={esikatselu}
      alt="Esikatselu"
      fill
      className="object-cover rounded shadow"
      sizes="100vw"
    />
  </div>
)}



          <label className="block font-medium">Valitse ilmoitustyyppi:</label>
          <select value={tyyppi} onChange={(e) => setTyyppi(e.target.value)} className="w-full border px-4 py-2 rounded">
            <option value="perus">Perusilmoitus </option>
            <option value="premium">Premium näkyvyys</option>
          </select>

          {tyyppi === 'perus' && (
  <>
    <label className="block">Näkyvyysaika (päiviä):</label>
    <select
      value={kesto}
      onChange={(e) => setKesto(e.target.value)}
      className="w-full border px-4 py-2 rounded"
    >
      <option value="7">7 päivää</option>
      <option value="14">14 päivää</option>
      <option value="30">30 päivää</option>
      <option value="60">60 päivää</option>
      <option value="90">90 päivää</option>
    </select>
  </>
)}


          {tyyppi === 'premium' && (
            <>
              <label className="block">Näkyvyysaika:</label>
              <select value={kesto} onChange={(e) => setKesto(e.target.value)} className="w-full border px-4 py-2 rounded">
                <option value="7">7 päivää</option>
                <option value="14">14 päivää</option>
                <option value="30">30 päivää</option>
                <option value="60">60 päivää</option>
                <option value="90">90 päivää</option>
              </select>

              <label className="block">Valitse premium-alkupäivä:</label>
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

          {/* <p className="text-right font-semibold text-sm">Hinta: {hinta}</p> */}
          {tyyppi === 'perus' && loppuDate && (
  <p>
    Ilmoituksesi näkyy ajalla:
    <strong> {new Date().toLocaleDateString('fi-FI')} – {loppuDate.toLocaleDateString('fi-FI')}</strong>
  </p>
)}

          <button
  type="submit"
  disabled={isSubmitting}
  className={`bg-[#3f704d] text-white px-6 py-2 rounded hover:bg-[#2f5332] ${
    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {isSubmitting ? 'Tallennetaan...' : 'Julkaise ilmoitus'}
</button>

        </form>
            </>
    )}
  </main>
  )
}

