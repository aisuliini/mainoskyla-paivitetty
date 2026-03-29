'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { fi } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import KuvanLataaja from '@/components/KuvanLataaja'
import ShareButtons from '@/components/ShareButtons'
import { CATEGORY_CONFIG } from '@/lib/categories/category-config'


export default function LisaaIlmoitus() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kuvat, setKuvat] = useState<File[]>([])
  const [esikatselut, setEsikatselut] = useState<string[]>([])
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)

  const [tyyppi, setTyyppi] = useState<'perus' | 'premium'>('perus')


  
  const [kategoria, setKategoria] = useState('')
  
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
  

  const [publishedId, setPublishedId] = useState<string | null>(null)
  const [saaJakaaSomessa, setSaaJakaaSomessa] = useState(false)

  

  const inputClass =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#1E3A41] placeholder:text-gray-400 outline-none focus:border-[#4F6763] focus:ring-0'

const sectionClass =
  'rounded-2xl border border-black/5 bg-[#FAFCFB] p-4 sm:p-5 space-y-4'

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


if (kategoria === 'tapahtumat-ja-juhlapalvelut') {    if (!tapahtumaAlku) e.tapahtumaAlku = 'Valitse tapahtuman alkupäivä.'
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


const submitNow = async () => {
  if (isSubmitting) return

  setPublishedId(null)
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
    esikatselut.forEach((u) => URL.revokeObjectURL(u))
  }
}, [esikatselut])




// Päivitä sijaintiehdotukset, kun käyttäjä kirjoittaa
useEffect(() => {
  if (sijainti.length === 0) {
    setSijaintiehdotukset([])
    return
  }

    const ehdotukset = (paikkakunnat as string[])
    .filter((nimi) =>
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
    void haeKayttaja()
}, [])


useEffect(() => {
  if (tapahtumaAlku && !tapahtumaLoppu) {
    setTapahtumaLoppu(tapahtumaAlku)
  }
}, [tapahtumaAlku, tapahtumaLoppu])

useEffect(() => {
  if (kategoria !== 'tapahtumat-ja-juhlapalvelut') {
  setTapahtumaAlku(null)
  setTapahtumaLoppu(null)
}
}, [kategoria])


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


const handleUpload = async (): Promise<void> => {
  console.log('handleUpload käynnissä')
  if (!user) {
  throw new Error('Kirjautuminen vaaditaan.')
}

  const nykyhetki = new Date()
const kuvaUrls: string[] = []

  if (tyyppi === 'premium') {
    const { count, error: countError } = await supabase
      .from('ilmoitukset')
      .select('*', { count: 'exact', head: true })
      .eq('maksuluokka', 'premium')
      .eq('premium', true)
      .eq('premium_tyyppi', 'etusivu')

    if (countError) {
      throw new Error('Premium-paikkojen tarkistus epäonnistui: ' + countError.message)
    }

    if ((count ?? 0) >= 60) {
      throw new Error('Etusivun premium-paikat ovat tällä hetkellä täynnä.')
    }
  }

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


  const tapahtumaLoppuDate =
  kategoria === 'tapahtumat-ja-juhlapalvelut'
    ? (tapahtumaLoppu ?? tapahtumaAlku)
    : null

  const voimassaLoppuFinal =
  kategoria === 'tapahtumat-ja-juhlapalvelut'
    ? (tapahtumaLoppuDate ?? tapahtumaAlku)
    : null


    

  const ilmoitus = {
  user_id: user.id,
  otsikko,
  kuvaus,
  sijainti,
  kuva_url: kuvaUrls[0] || null,
  kuvat: kuvaUrls.length > 0 ? JSON.stringify(kuvaUrls) : null,

  visible: true,

  maksuluokka: tyyppi,
  kategoria,
  premium: tyyppi === 'premium',
  premium_alku: null,
  premium_loppu: null,
  voimassa_alku: kategoria === 'tapahtumat-ja-juhlapalvelut'
    ? nykyhetki.toISOString()
    : null,
  voimassa_loppu: voimassaLoppuFinal ? voimassaLoppuFinal.toISOString() : null,
  premium_tyyppi: tyyppi === 'premium' ? 'etusivu' : null,
  nayttoja: 0,
  luotu: nykyhetki.toISOString(),
  tapahtuma_alku: kategoria === 'tapahtumat-ja-juhlapalvelut' ? tapahtumaAlku?.toISOString() : null,
  tapahtuma_loppu: tapahtumaLoppuDate ? tapahtumaLoppuDate.toISOString() : null,
    puhelin: puhelin || null,
  sahkoposti: sahkoposti || null,
  linkki: linkki || null,
  saa_jakaa_somessa: saaJakaaSomessa,
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

if (data?.id) {
  setPublishedId(data.id)
}

return


} 

  return (
<main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-12 my-8">    {!user ? (
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
        <div className="mb-8">
  <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A41]">
    Lisää ilmoitus
  </h1>
</div>
        
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


{/*  Perustiedot */}
<div className={sectionClass}>
  <h2 className="text-lg font-semibold text-[#1E3A41]">Perustiedot</h2>

<select
  name="kategoria"
  value={kategoria}
  onChange={(e) => setKategoria(e.target.value)}
  required
  className={inputClass}
>
  <option value="">Valitse kategoria</option>
  {CATEGORY_CONFIG.map((category) => (
    <option key={category.slug} value={category.slug}>
      {category.name}
    </option>
  ))}
</select>

          {errors.kategoria && (
  <p className="text-sm text-red-600 mt-1">
    {errors.kategoria}
  </p>
)}


          <input
  name="otsikko"
  type="text"
  placeholder="Otsikko"
  value={otsikko}
  onChange={(e) => setOtsikko(e.target.value)}
  required
  maxLength={80}
  className={inputClass}/>
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
    className={inputClass}
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
className={inputClass}/>

            {sijaintiehdotukset.length > 0 && (
              <ul className="absolute z-10 bg-white border border-black/10 w-full mt-2 rounded-2xl shadow-md text-sm max-h-48 overflow-y-auto">
                {sijaintiehdotukset.map((ehdotus, i) => (
                  <li
                    key={i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSijainti(ehdotus)
                      setSijaintiehdotukset([])
                    }}
                    className="px-4 py-3 hover:bg-black/5 cursor-pointer"
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


{kategoria === 'tapahtumat-ja-juhlapalvelut' && (
  <div className="rounded-2xl bg-white border border-black/5 p-4 space-y-4">
    <div data-error="tapahtumaAlku" tabIndex={-1}>
      <label className="block text-sm font-medium mb-2 text-[#1E3A41]">
        Alkupäivä
      </label>
      <DayPicker
        mode="single"
        selected={tapahtumaAlku ?? undefined}
        onSelect={(d) => setTapahtumaAlku(d ?? null)}
        locale={fi}
      />
    </div>

    <div data-error="tapahtumaLoppu" tabIndex={-1}>
      <label className="block text-sm font-medium mb-2 text-[#1E3A41]">
        Loppupäivä
      </label>
      <DayPicker
        mode="single"
        selected={tapahtumaLoppu ?? undefined}
        onSelect={(d) => setTapahtumaLoppu(d ?? null)}
        locale={fi}
      />
    </div>

    {errors.tapahtumaAlku && (
      <p className="text-sm text-red-600">{errors.tapahtumaAlku}</p>
    )}

    {errors.tapahtumaLoppu && (
      <p className="text-sm text-red-600">{errors.tapahtumaLoppu}</p>
    )}
  </div>
)}

</div>


{/* STEP 2: Yhteystiedot */}
<div className={sectionClass} data-error="yhteys">
  <h2 className="text-lg font-semibold text-[#1E3A41]">Yhteystiedot</h2>


  <input
    type="text"
    placeholder="Puhelin (esim. 040 123 4567)"
    value={puhelin}
    onChange={(e) => setPuhelin(e.target.value)}
className={inputClass}  />

  <input
  name="sahkoposti"
  type="email"
  placeholder="Sähköposti"
  value={sahkoposti}
  onChange={(e) => setSahkoposti(e.target.value)}
className={inputClass}/>

  {errors.sahkoposti && <p className="text-sm text-red-600">{errors.sahkoposti}</p>}

  <input
  name="linkki"
  type="text"
  placeholder="Linkki (https://instagram.com/... tai https://yritys.fi)"
  value={linkki}
  onChange={(e) => setLinkki(e.target.value)}
className={inputClass}/>

  {errors.linkki && <p className="text-sm text-red-600">{errors.linkki}</p>}

  {errors.yhteys && <p className="text-sm text-red-600">{errors.yhteys}</p>}

</div>



{/* STEP 3: Kuva */}
<div className={sectionClass}>
  <h2 className="text-lg font-semibold text-[#1E3A41]">Kuvat</h2>

<label className="block font-medium">
  Kuva (ilmoituksella on parempi menestys, kun siinä on kuva)
</label>

<p className="text-xs text-gray-500">
  Voit lisätä enintään 4 kuvaa. Ensimmäinen kuva näkyy listauksessa.
</p>

{replaceIndex !== null && (
  <div className="rounded-lg border border-[#4F6763]/30 bg-[#4F6763]/10 p-3 text-sm text-[#1E3A41]">
    Vaihdat kuvaa <strong>{replaceIndex + 1}</strong>. Valitse uusi kuva yllä olevasta lataajasta.
    <button
      type="button"
      onClick={() => setReplaceIndex(null)}
      className="ml-3 underline"
    >
      Peruuta
    </button>
  </div>
)}

          <KuvanLataaja
  onImageCropped={async (rajattuBlob) => {
    if (kuvat.length >= 4 && replaceIndex === null) {
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

    setReplaceIndex((current) => {
      if (current === null) return null
      if (current === idx) return null
      if (current > idx) return current - 1
      return current
    })
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
<div className={sectionClass}>
  <h2 className="text-lg font-semibold text-[#1E3A41]">Näkyvyys</h2>
  <label className="block font-medium">Valitse ilmoitustyyppi:</label>

  <select
    value={tyyppi}
    onChange={(e) => setTyyppi(e.target.value === 'premium' ? 'premium' : 'perus')}
    className={inputClass}
  >
    <option value="perus">Perusilmoitus (ilmainen)</option>
    <option value="premium">Etusivu-ilmoitus (ilmainen)</option>
  </select>

    {tyyppi === 'perus' && (
    <p className="text-sm text-gray-600">
      Perusilmoitus näkyy kategorioissa ja hauissa, kunnes poistat sen.
    </p>
  )}

  {tyyppi === 'premium' && (
    <p className="text-sm text-gray-600">
      Etusivu-ilmoitus näkyy etusivulla sekä lisäksi kategorioissa ja hauissa, kunnes poistat sen.
    </p>
  )}
</div>

<div className={sectionClass}>
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={saaJakaaSomessa}
      onChange={(e) => setSaaJakaaSomessa(e.target.checked)}
      className="mt-1 h-4 w-4 rounded border-gray-300"
    />
    <span className="text-sm text-[#1E3A41]">
  Ilmoituksen saa jakaa Mainoskylän somekanavissa
</span>
  </label>
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

{publishedId && (
  <div className="mt-4 border rounded-xl p-4 bg-green-50">
    <p className="font-semibold mb-2">Ilmoitus julkaistu 🎉</p>
    <p className="text-sm text-gray-600 mb-3">
      Jaa ilmoitus helposti WhatsAppiin, Instagramiin tai kopioi linkki.
    </p>

    <ShareButtons
      title={otsikko}
      text={`${otsikko} – löytyi Mainoskylästä`}
      url={`${window.location.origin}/ilmoitukset/${publishedId}`}
    />

    <div className="mt-3 flex gap-2">
      <button
        type="button"
        onClick={() => router.push(`/ilmoitukset/${publishedId}`)}
        className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-[#4F6763] hover:opacity-95"
      >
        Avaa ilmoitus
      </button>

      <button
        type="button"
        onClick={() => router.push('/profiili?created=1&city=' + encodeURIComponent(sijainti.trim()))}
        className="rounded-xl px-4 py-2 text-sm font-semibold border hover:bg-gray-50"
      >
        Siirry profiiliin
      </button>
    </div>
  </div>
)}

        </form>
            </>
    )}
  </main>
  )
}
