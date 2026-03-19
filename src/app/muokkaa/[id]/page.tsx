'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { fi } from 'date-fns/locale'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import KuvanLataaja from '@/components/KuvanLataaja'

type IlmoitusRow = {
  id: string
  otsikko: string | null
  kuvaus: string | null
  sijainti: string | null
  kategoria: string | null
  maksuluokka: string | null

  kuva_url: string | null
  kuvat?: string | null // JSON string array

  premium?: boolean | null
  premium_alku?: string | null
  premium_loppu?: string | null
  premium_tyyppi?: string | null

  tapahtuma_alku?: string | null
  tapahtuma_loppu?: string | null

  voimassa_alku?: string | null
  voimassa_loppu?: string | null

  puhelin?: string | null
  sahkoposti?: string | null
  linkki?: string | null
}

type ImageItem =
  | { kind: 'existing'; url: string }
  | { kind: 'new'; file: File; previewUrl: string }

export default function MuokkaaIlmoitusta() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const ilmoitusId = params?.id ?? ''

  const wrapperRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)

  // FORM: Perustiedot
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kategoria, setKategoria] = useState('')

  // Yhteystiedot
  const [puhelin, setPuhelin] = useState('')
  const [sahkoposti, setSahkoposti] = useState('')
  const [linkki, setLinkki] = useState('')
  const [cta, setCta] = useState<'puhelin' | 'email' | 'linkki' | 'ei'>('puhelin') // UI-only

  // Kuvat (max 4)
  const [images, setImages] = useState<ImageItem[]>([])
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)

  // Näkyvyys
  const [tyyppi, setTyyppi] = useState<'perus' | 'premium'>('perus')
  const [originalTyyppi, setOriginalTyyppi] = useState<'perus' | 'premium'>('perus')
  

  // Tapahtumat
  const [tapahtumaAlku, setTapahtumaAlku] = useState<Date | null>(null)
  const [tapahtumaLoppu, setTapahtumaLoppu] = useState<Date | null>(null)

  // Ehdotukset + submit
  const [sijaintiehdotukset, setSijaintiehdotukset] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)



  // ---------- helpers ----------
  const isSafeUrl = (raw: string) => {
    const v = raw.trim()
    if (!v) return true
    if (!v.startsWith('https://')) return false
    if (v.includes('bit.ly') || v.includes('tinyurl') || v.includes('t.co')) return false
    try {
      const u = new URL(v)
      return !!u.hostname && u.hostname.includes('.')
    } catch {
      return false
    }
  }

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
      setTimeout(() => el.focus?.(), 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const parseKuvatFromRow = (row: IlmoitusRow): string[] => {
    // 1) yritä kuvat JSON
    if (row.kuvat) {
      try {
        const arr = JSON.parse(row.kuvat)
        if (Array.isArray(arr)) {
          return arr.filter((x) => typeof x === 'string' && x.trim().length > 0)
        }
      } catch {
        // ignore
      }
    }
    // 2) fallback: kuva_url
    if (row.kuva_url) return [row.kuva_url]
    return []
  }

  // ---------- auth ----------
  useEffect(() => {
    const haeKayttaja = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user) setUser(sessionData.session.user)
      else setUser(null)
    }
    void haeKayttaja()
  }, [])

  // ---------- fetch ilmoitus ----------
  useEffect(() => {
    if (!ilmoitusId) return

    const hae = async () => {
      setLoading(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('id', ilmoitusId)
        .single()

      if (error || !data) {
        setLoading(false)
        alert('Ilmoitusta ei löytynyt.')
        router.push('/profiili')
        return
      }

      const row = data as IlmoitusRow

      setOtsikko(row.otsikko ?? '')
      setKuvaus(row.kuvaus ?? '')
      setSijainti(row.sijainti ?? '')
      setKategoria(row.kategoria ?? '')
            const rowTyyppi = row.maksuluokka === 'premium' ? 'premium' : 'perus'
      setTyyppi(rowTyyppi)
      setOriginalTyyppi(rowTyyppi)

      setPuhelin(row.puhelin ?? '')
      setSahkoposti(row.sahkoposti ?? '')
      setLinkki(row.linkki ?? '')


      // Tapahtumat
      if (row.tapahtuma_alku) setTapahtumaAlku(new Date(row.tapahtuma_alku))
      if (row.tapahtuma_loppu) setTapahtumaLoppu(new Date(row.tapahtuma_loppu))

      // Kuvat -> ImageItem existing
      const urls = parseKuvatFromRow(row).slice(0, 4)
      setImages(urls.map((u) => ({ kind: 'existing', url: u })))

      setLoading(false)
    }

    void hae()
  }, [ilmoitusId, router])

    useEffect(() => {
    if (kategoria !== 'Tapahtumat') {
      setTapahtumaAlku(null)
      setTapahtumaLoppu(null)
    }
  }, [kategoria])

  useEffect(() => {
  if (tapahtumaAlku && !tapahtumaLoppu) {
    setTapahtumaLoppu(tapahtumaAlku)
  }
}, [tapahtumaAlku, tapahtumaLoppu])

  // ---------- sijaintiehdotukset ----------
  useEffect(() => {
    if (sijainti.length === 0) {
      setSijaintiehdotukset([])
      return
    }
    const ehdotukset = (paikkakunnat as string[])
      .filter((nimi) => nimi.toLowerCase().startsWith(sijainti.toLowerCase()))
      .slice(0, 10)
    setSijaintiehdotukset(ehdotukset)
  }, [sijainti])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSijaintiehdotukset([])
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // ---------- image helpers ----------
    const removeImageAt = (idx: number) => {
    setImages((prev) => {
      const item = prev[idx]
      if (item?.kind === 'new') {
        URL.revokeObjectURL(item.previewUrl)
      }
      return prev.filter((_, i) => i !== idx)
    })

    setReplaceIndex((current) => {
      if (current === null) return null
      if (current === idx) return null
      if (current > idx) return current - 1
      return current
    })
  }

    const uploadOne = async (file: File): Promise<string> => {
    const tiedostonimi = `${Date.now()}_${Math.random().toString(16).slice(2)}_${file.name}`
    const { error: uploadError } = await supabase.storage.from('kuvat').upload(tiedostonimi, file)
    if (uploadError) throw new Error('Kuvan lataus epäonnistui: ' + uploadError.message)

    const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
    if (!publicUrl?.publicUrl) throw new Error('Kuvan public URL epäonnistui.')
    return publicUrl.publicUrl
  }

  // ---------- submit ----------
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

    if (!user) {
      setSubmitError('Kirjautuminen vaaditaan.')
      return
    }

    setIsSubmitting(true)

    try {

                  if (tyyppi === 'premium' && originalTyyppi !== 'premium') {
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


      // 2) Kuvat: uploadataan vain "new", pidetään existing urlit
      const finalUrls: string[] = []
      for (const item of images.slice(0, 4)) {
        if (item.kind === 'existing') {
          finalUrls.push(item.url)
        } else {
          const url = await uploadOne(item.file)
          finalUrls.push(url)
        }
      }

      // 3) Päivät
      

      const tapahtumaLoppuFinal =
        kategoria === 'Tapahtumat' ? (tapahtumaLoppu ?? tapahtumaAlku) : null

      


      // 4) Update
      const payload = {
        otsikko,
        kuvaus,
        sijainti,
        kategoria,
        maksuluokka: tyyppi,

        kuva_url: finalUrls[0] || null,
        kuvat: finalUrls.length > 0 ? JSON.stringify(finalUrls) : null,

               premium: tyyppi === 'premium',
        premium_alku: null,
        premium_loppu: null,
        premium_tyyppi: tyyppi === 'premium' ? 'etusivu' : null,

        tapahtuma_alku: kategoria === 'Tapahtumat' ? tapahtumaAlku?.toISOString() : null,
        tapahtuma_loppu: kategoria === 'Tapahtumat' ? tapahtumaLoppuFinal?.toISOString() : null,


        puhelin: puhelin || null,
        sahkoposti: sahkoposti || null,
        linkki: linkki || null,
      }

      const { error } = await supabase.from('ilmoitukset').update(payload).eq('id', ilmoitusId)
      if (error) throw new Error(error.message)

      setSubmitSuccess('Ilmoitus päivitetty!')
      await new Promise((r) => setTimeout(r, 700))
      router.push('/profiili')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Päivitys epäonnistui. Yritä uudelleen.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submitNow()
  }

  if (loading) return <p className="text-center py-8">Ladataan...</p>

  return (
<main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-12 my-8">      {!user ? (
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold mb-4">Kirjautuminen vaaditaan</h1>
          <p className="mb-6">Sinun täytyy olla kirjautunut muokataksesi ilmoitusta.</p>
          <button
            onClick={() => router.push('/kirjaudu')}
            className="bg-[#F5A3B3] text-[#1E3A41] px-6 py-3 rounded hover:bg-[#3f704d]"
          >
            Siirry kirjautumaan
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Muokkaa ilmoitusta</h1>

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
                maxLength={80}
                className="w-full border px-4 py-2 rounded break-words"
              />
              <p className="text-sm text-gray-500 text-right">{otsikko.length}/80 merkkiä</p>
              {errors.otsikko && <p className="text-sm text-red-600 mt-1">{errors.otsikko}</p>}

              <textarea
                name="kuvaus"
                placeholder="Kuvaus"
                value={kuvaus}
                onChange={(e) => setKuvaus(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.kuvaus && <p className="text-sm text-red-600 mt-1">{errors.kuvaus}</p>}
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

              {errors.sijainti && <p className="text-sm text-red-600 mt-1">{errors.sijainti}</p>}

              <select
                name="kategoria"
                value={kategoria}
                onChange={(e) => setKategoria(e.target.value)}
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
              {errors.kategoria && <p className="text-sm text-red-600 mt-1">{errors.kategoria}</p>}

              {kategoria === 'Tapahtumat' && (
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

                  {errors.tapahtumaAlku && <p className="text-sm text-red-600 mt-1">{errors.tapahtumaAlku}</p>}
                  {errors.tapahtumaLoppu && <p className="text-sm text-red-600 mt-1">{errors.tapahtumaLoppu}</p>}
                </>
              )}
            </div>

            {/* STEP 2: Yhteystiedot */}
            <div className="space-y-4" data-error="yhteys">
              

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

          
            </div>

            {/* STEP 3: Kuva */}
            <div className="space-y-4">
              <label className="block font-medium">
                Kuva
                <span className="ml-2 text-sm font-normal text-gray-500">
                  Suosittelemme kuvaa – ilman kuvaa näytetään Mainoskylä-placeholder.
                </span>
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
                  if (images.length >= 4 && replaceIndex === null) {
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

                    setImages((prev) => {
                      const next = [...prev]
                      if (replaceIndex !== null) {
                        const old = next[replaceIndex]
                        if (old?.kind === 'new') URL.revokeObjectURL(old.previewUrl)
                        next[replaceIndex] = { kind: 'new', file: pakattu, previewUrl }
                      } else {
                        next.push({ kind: 'new', file: pakattu, previewUrl })
                      }
                      return next.slice(0, 4)
                    })

                    setReplaceIndex(null)
                  } catch (err) {
                    console.error('Kuvan pakkaus epäonnistui:', err)
                    alert('Kuvan pakkaus epäonnistui.')
                  }
                }}
              />

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, idx) => {
                    const src = img.kind === 'existing' ? img.url : img.previewUrl
                    return (
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
                            setReplaceIndex(idx)
                            // käyttäjä valitsee uuden kuvan KuvanLataajalla
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="absolute top-2 left-2 z-20 rounded bg-white/95 px-2 py-1 text-xs shadow"
                        >
                          Vaihda
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="absolute top-2 right-2 z-20 rounded bg-white/95 px-2 py-1 text-xs shadow"
                        >
                          Poista
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <p className="text-sm text-gray-600">Lisätty {images.length}/4 kuvaa.</p>
            </div>

            {/* STEP 4: Näkyvyys */}
<div className="space-y-4">
  <label className="block font-medium">Valitse ilmoitustyyppi:</label>

  <select
    value={tyyppi}
    onChange={(e) => setTyyppi(e.target.value === 'premium' ? 'premium' : 'perus')}
    className="w-full border px-4 py-2 rounded"
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

            {/* Nappi */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={submitNow}
                disabled={isSubmitting}
                className={`rounded-xl px-6 py-3 font-semibold text-white bg-[#4F6763] ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95'
                }`}
              >
                {isSubmitting ? 'Tallennetaan...' : 'Tallenna muutokset'}
              </button>
            </div>
          </form>
        </>
      )}
    </main>
  )
}
