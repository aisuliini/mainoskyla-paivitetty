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
const [kuvat, setKuvat] = useState<File[]>([])  // AJA KAIKKI VALIDOINNIT + PALAUTA VIRHEET (ei jää "stale errors" -ongelmaa)
  const [esikatselut, setEsikatselut] = useState<string[]>([])
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)

  const [tyyppi, setTyyppi] = useState('perus')
const [alku, setAlku] = useState<Date | null>(null)
  const [kesto, setKesto] = useState('7')
  const [kategoria, setKategoria] = useState('')
  const [varatutPaivat, setVaratutPaivat] = useState<Date[]>([])
  const [sijaintiehdotukset, setSijaintiehdotukset] = useState<string[]>([])
 const [tapahtumaAlku, setTapahtumaAlku] = useState<Date | null>(null)
const [tapahtumaLoppu, setTapahtumaLoppu] = useState<Date | null>(null)
const [user, setUser] = useState<{ id: string } | null>(null)
const [isSubmitting, setIsSubmitting] = useState(false)
const [errors, setErrors] = useState<Record<string, string>>({})
const [submitError, setSubmitError] = useState<string | null>(null)
const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

const [puhelin, setPuhelin] = useState('')
const [sahkoposti, setSahkoposti] = useState('')
const [linkki, setLinkki] = useState('') // verkkosivu / some
const [cta, setCta] = useState<'puhelin' | 'email' | 'linkki' | 'ei'>('puhelin')

// AJA KAIKKI VALIDOINNIT + PALAUTA VIRHEET (ei jää "stale errors" -ongelmaa)
const validateAll = () => {
  const e: Record<string, string> = {}

  const ots = otsikko.trim()
  const kuv = kuvaus.trim()
  const sij = sijainti.trim()

  if (!ots) e.otsikko = 'Otsikko on pakollinen.'
  else if (ots.length < 5) e.otsikko = 'Otsikon pitää olla vähintään 5 merkkiä.'

  if (!kuv) e.kuvaus = 'Kuvaus on pakollinen.'
  else if (kuv.length < 20) e.kuvaus = 'Kuvauksen pitää olla vähintään 20 merkkiä.'

  if (!sij) e.sijainti = 'Sijainti on pakollinen.'
  if (!kategoria) e.kategoria = 'Valitse kategoria.'

  if (tyyppi === 'premium' && !alku) e.alku = 'Valitse premium-alkupäivä.'

  if (kategoria === 'Tapahtumat') {
    if (!tapahtumaAlku) e.tapahtumaAlku = 'Valitse tapahtuman alkupäivä.'
    if (tapahtumaAlku && tapahtumaLoppu && tapahtumaLoppu < tapahtumaAlku) {
      e.tapahtumaLoppu = 'Loppupäivä ei voi olla ennen alkupäivää.'
    }
  }


  const p = puhelin.trim()
  const s = sahkoposti.trim()
  const l = linkki.trim()

  if (!p && !s && !l) e.yhteys = 'Lisää vähintään yksi yhteystieto (puhelin, sähköposti tai linkki).'
  if (s && !/^\S+@\S+\.\S+$/.test(s)) e.sahkoposti = 'Sähköposti ei näytä oikealta.'
  if (l && !isSafeUrl(l)) {
    e.linkki = 'Linkin täytyy alkaa https:// ja lyhytlinkit (bit.ly/tinyurl/t.co) eivät ole sallittuja.'
  }

    return e
}


const scrollToFirstError = (errs: Record<string, string>) => {
  const firstErrorKey = Object.keys(errs)[0]
  if (!firstErrorKey) return

  const el =
    document.querySelector(`[name="${firstErrorKey}"]`) ||
    document.querySelector(`[data-error="${firstErrorKey}"]`)

  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // pieni viive auttaa mobiilissa fokuksen kanssa
    setTimeout(() => {
      el.focus?.()
    }, 100)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}


// Tämä tekee julkaisun (vain kun kutsutaan nappia painamalla)
const submitNow = async () => {
  if (isSubmitting) return

    setSubmitError(null)
  setSubmitSuccess(null)

  const errs = validateAll()
  if (Object.keys(errs).length > 0) {
    setErrors(errs)
    setTimeout(() => scrollToFirstError(errs), 50)
    return
  }

  setErrors({})



  setIsSubmitting(true)
  try {
    await handleUpload()
    setSubmitSuccess('Ilmoitus julkaistu!')
    await new Promise((r) => setTimeout(r, 700))
    router.push('/profiili')
  } catch (err: unknown) {
    console.error('Julkaisu epäonnistui:', err)
    const message = err instanceof Error ? err.message : 'Julkaisu epäonnistui. Yritä uudelleen.'
    setSubmitError(message)
  } finally {
    setIsSubmitting(false)
  }
}

// Form submit (Enter jne.) ohjataan samaan funktioon
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  await submitNow()
}


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

useEffect(() => {
  return () => {
    // vapauta kaikki esikatselu-URL:t kun poistutaan sivulta
    esikatselut.forEach((u) => URL.revokeObjectURL(u))
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .filter(([, count]) => count >= 52) // Näytä punaisena vain jos 52+ varattu
      .map(([päivä]) => new Date(päivä))

    setVaratutPaivat(punaiset)
  }

  if (tyyppi === 'premium') {
    haePremiumKalenteri()
  }
}, [tyyppi])

useEffect(() => {
  if (tapahtumaAlku && !tapahtumaLoppu) {
    setTapahtumaLoppu(tapahtumaAlku)
  }
}, [tapahtumaAlku, tapahtumaLoppu])



const isSafeUrl = (raw: string) => {
  const v = raw.trim()
  if (!v) return true

  // estä lyhytlinkit / epäselvät protokollat
  if (!v.startsWith('https://')) return false
  if (v.includes('bit.ly') || v.includes('tinyurl') || v.includes('t.co')) return false

  try {
    const u = new URL(v)
    return !!u.hostname && u.hostname.includes('.')
  } catch {
    return false
  }
}


const handleUpload = async () => {
  console.log('handleUpload käynnissä')
  if (!user) {
  throw new Error('Kirjautuminen vaaditaan.')
}

  const nykyhetki = new Date()
const kuvaUrls: string[] = []

if (kuvat.length > 0) {
  // ladataan max 4
  const files = kuvat.slice(0, 4)

  for (const f of files) {
    const tiedostonimi = `${Date.now()}_${Math.random().toString(16).slice(2)}_${f.name}`
    const { error: uploadError } = await supabase.storage.from('kuvat').upload(tiedostonimi, f)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Kuvan lataus epäonnistui: ' + uploadError.message)
    }

    const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
    if (publicUrl?.publicUrl) {
      kuvaUrls.push(publicUrl.publicUrl)
    }
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
      return maara >= 6
    }) //Premium-paikkoja on 6 kpl per päivä

    if (ylitykset.length > 0) {
      throw new Error('Valituilla päivillä ei ole enää vapaata premium-näkyvyyspaikkaa.')
    }
  }

  const tapahtumaLoppuDate =
  kategoria === 'Tapahtumat'
    ? (tapahtumaLoppu ?? tapahtumaAlku)
    : null

const voimassaLoppuFinal =
  kategoria === 'Tapahtumat' && tapahtumaLoppuDate
    ? tapahtumaLoppuDate
    : loppuDate

    

  const ilmoitus = {
  user_id: user.id,
  otsikko,
  kuvaus,
  sijainti,
  kuva_url: kuvaUrls[0] || null,
kuvat: kuvaUrls.length > 0 ? JSON.stringify(kuvaUrls) : null,

  maksuluokka: tyyppi,
  kategoria,
  premium: tyyppi === 'premium' && !!alku && alku <= nykyhetki,
  premium_alku: tyyppi === 'premium' ? alku?.toISOString() : null,
  premium_loppu: tyyppi === 'premium' ? loppuDate?.toISOString() : null,
  voimassa_alku: (tyyppi === 'premium' ? (alku?.toISOString() ?? nykyhetki.toISOString()) : nykyhetki.toISOString()),
  voimassa_loppu: voimassaLoppuFinal?.toISOString(),
  premium_tyyppi: tyyppi === 'premium' ? 'etusivu' : null,
  nayttoja: 0,
  luotu: nykyhetki.toISOString(),
  tapahtuma_alku: kategoria === 'Tapahtumat' ? tapahtumaAlku?.toISOString() : null,
  tapahtuma_loppu: kategoria === 'Tapahtumat' ? tapahtumaLoppu?.toISOString() : null,
  puhelin: puhelin || null,
  sahkoposti: sahkoposti || null,
  linkki: linkki || null,

}


  console.log('INSERT payload:', ilmoitus)

const { data, error } = await supabase
  .from('ilmoitukset')
  .insert(ilmoitus)
  .select('id')
  .single()

if (error) {
  console.error('Insert error FULL:', error)
  // näytetään mahdollisimman informatiivinen virhe
  throw new Error(
    error.message +
      (error.details ? ` | details: ${error.details}` : '') +
      (error.hint ? ` | hint: ${error.hint}` : '')
  )
}

console.log('Insert OK:', data)
return


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
        {submitSuccess && (
  <div className="mb-3 border border-green-200 bg-green-50 text-green-800 rounded p-3 text-sm">
    {submitSuccess}
  </div>
)}

        {submitError && (
          
  <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3 text-sm">
    {submitError}
  </div>
)}

<form
  onSubmit={handleSubmit}
  noValidate
  onKeyDown={(e) => {
    if (e.key !== 'Enter') return
    const t = e.target as HTMLElement
    if (t.tagName !== 'TEXTAREA') e.preventDefault()
  }}
  className="space-y-4"
>



{/* STEP 1: Perustiedot */}
<div className="space-y-4">



          <input
  name="otsikko"
  type="text"
  placeholder="Otsikko"
  value={otsikko}
  onChange={(e) => setOtsikko(e.target.value)}
  required
  maxLength={80}
  className="w-full border px-4 py-2 rounded break-words"
/>
<p className="text-sm text-gray-500 text-right">{otsikko.length}/80 merkkiä</p>

{errors.otsikko && (
  <p className="text-sm text-red-600 mt-1">
    {errors.otsikko}
  </p>
)}

    <textarea
    name="kuvaus"
    placeholder="Kuvaus"
    value={kuvaus}
    onChange={(e) => setKuvaus(e.target.value)}
    required
    className="w-full border px-4 py-2 rounded"
    />

         {errors.kuvaus && (
         <p className="text-sm text-red-600 mt-1">
         {errors.kuvaus}
        </p>
         )} 
        <p className="text-sm text-gray-500 text-right">{kuvaus.length} merkkiä</p> 

          <div ref={wrapperRef} className="relative">
            <input
  name="sijainti"
  type="text"
  placeholder="Sijainti (esim. Porvoo)"
  value={sijainti}
  onChange={(e) => setSijainti(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && sijaintiehdotukset.length > 0) {
      e.preventDefault()
      const exact = sijaintiehdotukset.find(
        (p) => p.toLowerCase() === sijainti.toLowerCase()
      )
      const valittu = exact || sijaintiehdotukset[0]
      setSijainti(valittu)
      setSijaintiehdotukset([])
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
  onMouseDown={(e) => e.preventDefault()}
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

          {errors.sijainti && (
  <p className="text-sm text-red-600 mt-1">
    {errors.sijainti}
  </p>
)}


<select
  name="kategoria"
  value={kategoria}
  onChange={(e) => setKategoria(e.target.value)}
  required
  className="w-full border px-4 py-2 rounded"
>



            <option value="">Valitse kategoria</option>
            <option value="Arjen palvelut">Arjen palvelut</option>
            <option value="Hyvinvointi ja Kauneus">Hyvinvointi ja Kauneus</option>
            <option value="Koti ja Remontointi">Koti ja Remontointi</option>
            <option value="Eläinpalvelut">Eläinpalvelut</option>
            <option value="Käsityöläiset">Käsityöläiset</option>
            <option value="Media ja Luovuus">Media ja Luovuus</option>
            <option value="Vuokratilat ja Juhlapaikat">Vuokratilat ja Juhlapaikat</option>
            <option value="Tapahtumat">Tapahtumat</option>    
          </select>

          {errors.kategoria && (
  <p className="text-sm text-red-600 mt-1">
    {errors.kategoria}
  </p>
)}

          { kategoria === 'Tapahtumat' && (
  <>
    <div data-error="tapahtumaAlku" tabIndex={-1}>
      <label className="block">Tapahtuman alkupäivä:</label>
      <DayPicker
        mode="single"
        selected={tapahtumaAlku ?? undefined}
        onSelect={(d) => setTapahtumaAlku(d ?? null)}
        locale={fi}
      />
    </div>

    <div data-error="tapahtumaLoppu" tabIndex={-1}>
      <label className="block">Tapahtuman loppupäivä:</label>
      <DayPicker
        mode="single"
        selected={tapahtumaLoppu ?? undefined}
        onSelect={(d) => setTapahtumaLoppu(d ?? null)}
        locale={fi}
      />
    </div>

    {errors.tapahtumaAlku && (
      <p className="text-sm text-red-600 mt-1">
        {errors.tapahtumaAlku}
      </p>
    )}

    {errors.tapahtumaLoppu && (
      <p className="text-sm text-red-600 mt-1">
        {errors.tapahtumaLoppu}
      </p>
    )}
  </>
)}

</div>


{/* STEP 2: Yhteystiedot */}
<div className="space-y-4" data-error="yhteys">

  <p className="text-sm text-gray-600">
    Valitse ensisijainen tapa, jolla haluat asiakkaan ottavan yhteyttä.
    Lisää vähintään yksi yhteystieto.
  </p>

  <label className="block font-medium">Ensisijainen yhteydenotto:</label>
  <select
    value={cta}
    onChange={(e) => setCta(e.target.value as 'puhelin' | 'email' | 'linkki' | 'ei')}
    className="w-full border px-4 py-2 rounded"
  >
    <option value="puhelin">Soitto / tekstiviesti</option>
    <option value="email">Sähköposti</option>
    <option value="linkki">Verkkosivu tai some</option>
    <option value="ei">Ei yhteydenottoa (vain info)</option>
  </select>

  <input
    type="text"
    placeholder="Puhelin (esim. 040 123 4567)"
    value={puhelin}
    onChange={(e) => setPuhelin(e.target.value)}
    className="w-full border px-4 py-2 rounded"
  />

  <input
  name="sahkoposti"
  type="email"
  placeholder="Sähköposti"
  value={sahkoposti}
  onChange={(e) => setSahkoposti(e.target.value)}
  className="w-full border px-4 py-2 rounded"
/>

  {errors.sahkoposti && <p className="text-sm text-red-600">{errors.sahkoposti}</p>}

  <input
  name="linkki"
  type="text"
  placeholder="Linkki (https://instagram.com/... tai https://yritys.fi)"
  value={linkki}
  onChange={(e) => setLinkki(e.target.value)}
  className="w-full border px-4 py-2 rounded"
/>

  {errors.linkki && <p className="text-sm text-red-600">{errors.linkki}</p>}

  {errors.yhteys && <p className="text-sm text-red-600">{errors.yhteys}</p>}

  <p className="text-xs text-gray-500">
    Turvallisuus: linkkien täytyy alkaa https:// ja lyhytlinkit (bit.ly/tinyurl/t.co) estetään.
  </p>
</div>



{/* STEP 3: Kuva */}
<div className="space-y-4">

<label className="block font-medium">
  Kuva (valinnainen)
  <span className="ml-2 text-sm font-normal text-gray-500">
    Suosittelemme kuvaa – ilman kuvaa näytetään Mainoskylä-placeholder.
  </span>
</label>

<p className="text-xs text-gray-500">
  Voit lisätä enintään 4 kuvaa. Ensimmäinen kuva näkyy listauksessa.
</p>


          <KuvanLataaja
  onImageCropped={async (rajattuBlob) => {
    if (kuvat.length >= 4) {
      alert('Voit lisätä enintään 4 kuvaa.')
      return
    }

    const tiedosto = new File([rajattuBlob], `kuva_${Date.now()}.jpg`, { type: 'image/jpeg' })

    try {
      const pakattu = await imageCompression(tiedosto, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })

      const previewUrl = URL.createObjectURL(pakattu)

if (replaceIndex !== null) {
  // vapauta vanha preview
  const oldUrl = esikatselut[replaceIndex]
  if (oldUrl) URL.revokeObjectURL(oldUrl)

  setKuvat((prev) => prev.map((f, i) => (i === replaceIndex ? pakattu : f)))
  setEsikatselut((prev) => prev.map((u, i) => (i === replaceIndex ? previewUrl : u)))
  setReplaceIndex(null)
} else {
  setKuvat((prev) => [...prev, pakattu])
  setEsikatselut((prev) => [...prev, previewUrl])
}

    } catch (err) {
      console.error('Kuvan pakkaus epäonnistui:', err)
      alert('Kuvan pakkaus epäonnistui.')
    }
  }}
/>




          {esikatselut.length > 0 && (
  <div className="grid grid-cols-2 gap-3">
    {esikatselut.map((src, idx) => (
      <div key={idx} className="relative aspect-[4/3] w-full bg-gray-100 rounded overflow-hidden">
        <Image
  src={src}
  alt={`Esikatselu ${idx + 1}`}
  fill
  className="object-cover pointer-events-none"
  sizes="50vw"
/>

<button
  type="button"
  onClick={() => {
    const urlToRemove = esikatselut[idx]
    if (urlToRemove) URL.revokeObjectURL(urlToRemove)

    setEsikatselut((prev) => prev.filter((_, i) => i !== idx))
    setKuvat((prev) => prev.filter((_, i) => i !== idx))
  }}
  className="absolute top-2 right-2 z-20 rounded bg-white/95 px-2 py-1 text-xs shadow"
>
  Poista
</button>

      </div>
    ))}
  </div>
)}

<p className="text-sm text-gray-600">
  Lisätty {esikatselut.length}/4 kuvaa.
</p>

</div>

{/* STEP 4: Näkyvyys */}
<div className="space-y-4">
  <label className="block font-medium">Valitse ilmoitustyyppi:</label>
  <select
    value={tyyppi}
    onChange={(e) => setTyyppi(e.target.value)}
    className="w-full border px-4 py-2 rounded"
  >
    <option value="perus">Kategoriailmoitus</option>
    <option value="premium">Etusivun näkyvyys</option>
  </select>

  {tyyppi === 'perus' && (
    <>

    <label className="block">Näkyvyysaika (päiviä):</label>
    <select
      value={kesto}
      onChange={(e) => setKesto(e.target.value)}
      className="w-full border px-4 py-2 rounded"
    >
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
                <option value="30">30 päivää</option>
                <option value="60">60 päivää</option>
                <option value="90">90 päivää</option>
              </select>

              <div data-error="alku" tabIndex={-1}>
  <label className="block">Valitse premium-alkupäivä:</label>
  <DayPicker
    mode="single"
    selected={alku ?? undefined}
    onSelect={(d) => setAlku(d ?? null)}
    modifiers={{ varattu: varatutPaivat }}
    modifiersClassNames={{ varattu: 'bg-red-500 text-white' }}
    locale={fi}
  />
</div>



              {errors.alku && (
               <p className="text-sm text-red-600 mt-1">
              {errors.alku}
               </p>
             )}
           </>
         )}

          {/* <p className="text-right font-semibold text-sm">Hinta: {hinta}</p> */}
          {tyyppi === 'perus' && loppuDate && (
            <p>
            Ilmoituksesi näkyy ajalla:
    <strong> {new Date().toLocaleDateString('fi-FI')} – {loppuDate.toLocaleDateString('fi-FI')}</strong>
  </p>
)}



</div>

{/* Desktop: Julkaise ilmoitus */}
<div className="flex justify-end pt-6 border-t">
  <button
    type="button"
    onClick={submitNow}
    disabled={isSubmitting}
    className={`rounded-xl px-6 py-3 font-semibold text-white bg-[#4F6763] ${
      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95'
    }`}
  >
    {isSubmitting ? 'Julkaistaan...' : 'Julkaise ilmoitus'}
  </button>
</div>

        </form>
            </>
    )}
  </main>
  )
}

