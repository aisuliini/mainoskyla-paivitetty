'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { addDays } from 'date-fns'
import { fi } from 'date-fns/locale'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'
import imageCompression from 'browser-image-compression'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import Image from 'next/image'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kategoria: string
  maksuluokka: string
  kuva_url: string | null
  premium_alku?: string | null
  premium_loppu?: string | null
  premium_tyyppi?: string | null
  tapahtuma_alku?: string | null
  tapahtuma_loppu?: string | null
  voimassa_alku?: string | null
  voimassa_loppu?: string | null
}

export default function MuokkaaIlmoitusta() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const ilmoitusId = params?.id ?? ''


  const wrapperRef = useRef<HTMLDivElement>(null)

  const [ilmoitus, setIlmoitus] = useState<Ilmoitus | null>(null)
  const [loading, setLoading] = useState(true)

  // FORM STATE (sama idea kuin LisääIlmoitus)
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kategoria, setKategoria] = useState('')
  const [tyyppi, setTyyppi] = useState<'perus' | 'premium'>('perus')

  // Perus näkyvyys
  const [voimassaAlku, setVoimassaAlku] = useState<Date | undefined>(undefined)
  const [voimassaKesto, setVoimassaKesto] = useState('30')

  // Premium näkyvyys
  const [alku, setAlku] = useState<Date | undefined>(undefined)
  const [kesto, setKesto] = useState('7')
  const [varatutPaivat, setVaratutPaivat] = useState<Date[]>([])

  // Tapahtumat
  const [tapahtumaAlku, setTapahtumaAlku] = useState<Date | undefined>(undefined)
  const [tapahtumaLoppu, setTapahtumaLoppu] = useState<Date | undefined>(undefined)

  // Kuva + rajaus
  const [kuva, setKuva] = useState<File | null>(null)
  const [esikatselu, setEsikatselu] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  // Ehdotukset + submit
  const [sijaintiehdotukset, setSijaintiehdotukset] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Loppupäivät (näytettävä/logiikka)
  const premiumLoppuDate = useMemo(() => {
    if (!alku) return null
    const days = parseInt(kesto || '0', 10) || 0
    return new Date(alku.getTime() + days * 86400000)
  }, [alku, kesto])

  const perusLoppuDate = useMemo(() => {
    const start = voimassaAlku ?? new Date()
    const days = parseInt(voimassaKesto || '0', 10) || 0
    return new Date(start.getTime() + days * 86400000)
  }, [voimassaAlku, voimassaKesto])

  // 1) HAE ILMOITUS
  useEffect(() => {
    if (!ilmoitusId) return

    const haeIlmoitus = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('id', ilmoitusId)
        .single()

      if (error || !data) {
        alert('Ilmoitusta ei löytynyt.')
        setLoading(false)
        return
      }

      const row = data as Ilmoitus
      setIlmoitus(row)

      setOtsikko(row.otsikko ?? '')
      setKuvaus(row.kuvaus ?? '')
      setSijainti(row.sijainti ?? '') // ✅ korjaus: oli "sijaint"
      setKategoria(row.kategoria ?? '')
      setTyyppi((row.maksuluokka === 'premium' ? 'premium' : 'perus') as 'perus' | 'premium')
      setEsikatselu(row.kuva_url ?? '')

      // Premium pvm + kesto
      if (row.premium_alku) setAlku(new Date(row.premium_alku))
      if (row.premium_alku && row.premium_loppu) {
        const a = new Date(row.premium_alku)
        const l = new Date(row.premium_loppu)
        const kestoPaivia = Math.round((l.getTime() - a.getTime()) / 86400000)
        setKesto(String(Math.max(1, kestoPaivia)))
      }

      // Tapahtumat pvm
      if (row.tapahtuma_alku) setTapahtumaAlku(new Date(row.tapahtuma_alku))
      if (row.tapahtuma_loppu) setTapahtumaLoppu(new Date(row.tapahtuma_loppu))

      // Perus voimassaolo (jos löytyy)
      if (row.voimassa_alku) setVoimassaAlku(new Date(row.voimassa_alku))
      if (row.voimassa_alku && row.voimassa_loppu) {
        const a = new Date(row.voimassa_alku)
        const l = new Date(row.voimassa_loppu)
        const kestoPaivia = Math.round((l.getTime() - a.getTime()) / 86400000)
        setVoimassaKesto(String(Math.max(1, kestoPaivia)))
      }

      setLoading(false)
    }

    void haeIlmoitus()
  }, [ilmoitusId])

  // 2) SIJAINTI-EHDOTUKSET
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

  // 3) VARATUT PREMIUM-PÄIVÄT (etusivu)
  useEffect(() => {
    const haeVaratut = async () => {
      const nytISO = new Date().toISOString()
      const { data } = await supabase
        .from('ilmoitukset')
        .select('premium_alku, premium_loppu, premium_tyyppi')
        .eq('premium_tyyppi', 'etusivu')
        .gte('premium_loppu', nytISO)

      const paivaLaskuri: Record<string, number> = {}
      ;(data ?? []).forEach((r) => {
        const row = r as { premium_alku: string; premium_loppu: string }
        const a = new Date(row.premium_alku)
        const l = new Date(row.premium_loppu)
        for (let d = a; d <= l; d = addDays(d, 1)) {
          const key = d.toISOString().split('T')[0]
          paivaLaskuri[key] = (paivaLaskuri[key] || 0) + 1
        }
      })

      const punaiset = Object.entries(paivaLaskuri)
        .filter(([, count]) => count >= 52) // sama raja kuin LisääIlmoitus
        .map(([paiva]) => new Date(paiva))

      setVaratutPaivat(punaiset)
    }

    if (tyyppi === 'premium') {
      void haeVaratut()
    }
  }, [tyyppi])



  // 5) SUBMIT
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (isSubmitting) return

  setSubmitError(null)
  setErrors({})

  if (!validateForm()) return
  if (!ilmoitus) return

  setIsSubmitting(true)

  try {
    // 1) Jos premium -> tarkista kalenteri (ettei ylitä 52)
    if (tyyppi === 'premium' && alku && premiumLoppuDate) {
      const nytISO = new Date().toISOString()
      const { data: aktiiviset, error: calErr } = await supabase
        .from('ilmoitukset')
        .select('id, premium_alku, premium_loppu')
        .eq('premium', true)
        .eq('premium_tyyppi', 'etusivu')
        .gte('premium_loppu', nytISO)
        .not('premium_alku', 'is', null)
        .not('premium_loppu', 'is', null)

      if (calErr) throw new Error(calErr.message)

      const paivaLaskuri: Record<string, number> = {}
      ;(aktiiviset ?? []).forEach((r) => {
        const row = r as { id: string; premium_alku: string; premium_loppu: string }
        // ✅ jos muokkaat tätä samaa ilmoitusta, ei lasketa sitä mukaan
        if (row.id === ilmoitusId) return

        const a = new Date(row.premium_alku)
        const l = new Date(row.premium_loppu)
        for (let d = a; d <= l; d = addDays(d, 1)) {
          const key = d.toISOString().split('T')[0]
          paivaLaskuri[key] = (paivaLaskuri[key] || 0) + 1
        }
      })

      const valitut: Date[] = []
      for (let d = new Date(alku); d <= premiumLoppuDate; d = addDays(d, 1)) {
        valitut.push(new Date(d))
      }

      const ylitykset = valitut.filter((p) => {
        const key = p.toISOString().split('T')[0]
        return (paivaLaskuri[key] || 0) >= 52
      })

      if (ylitykset.length > 0) {
        throw new Error('Valituilla päivillä ei ole enää vapaata premium-näkyvyyspaikkaa.')
      }
    }

    // 2) Upload kuva jos valittu
    let kuvaUrl: string | null = ilmoitus.kuva_url

    if (kuva) {
      const tiedostonimi = `${Date.now()}_${kuva.name}`
      const { error: uploadError } = await supabase.storage.from('kuvat').upload(tiedostonimi, kuva)
      if (uploadError) throw new Error('Kuvan lataus epäonnistui: ' + uploadError.message)

      const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
      kuvaUrl = publicUrl.publicUrl
    }

    // 3) Päivämäärät
    const premiumLoppu =
      alku ? new Date(alku.getTime() + (parseInt(kesto || '0', 10) || 0) * 86400000) : null

    const perusAlku = voimassaAlku ?? new Date()
    const perusLoppu = new Date(perusAlku.getTime() + (parseInt(voimassaKesto || '0', 10) || 0) * 86400000)

    const tapahtumaLoppuFinal =
      kategoria === 'Tapahtumat' ? (tapahtumaLoppu ?? tapahtumaAlku) : null

    const voimassaLoppuFinal =
      kategoria === 'Tapahtumat' && tapahtumaLoppuFinal
        ? tapahtumaLoppuFinal
        : (tyyppi === 'premium' ? premiumLoppu : perusLoppu)

    // 4) Update
    const { error } = await supabase
      .from('ilmoitukset')
      .update({
        otsikko,
        kuvaus,
        sijainti,
        kategoria,
        maksuluokka: tyyppi,
        kuva_url: kuvaUrl,

        premium: tyyppi === 'premium' && !!alku && alku <= new Date(),
        premium_alku: tyyppi === 'premium' ? alku?.toISOString() : null,
        premium_loppu: tyyppi === 'premium' ? premiumLoppu?.toISOString() : null,
        premium_tyyppi: tyyppi === 'premium' ? 'etusivu' : null,

        tapahtuma_alku: kategoria === 'Tapahtumat' ? tapahtumaAlku?.toISOString() : null,
        tapahtuma_loppu: kategoria === 'Tapahtumat' ? tapahtumaLoppuFinal?.toISOString() : null,

        voimassa_alku:
          tyyppi === 'premium'
            ? (alku?.toISOString() ?? null)
            : perusAlku.toISOString(),

        voimassa_loppu: voimassaLoppuFinal ? voimassaLoppuFinal.toISOString() : null,
      })
      .eq('id', ilmoitusId)

    if (error) throw new Error(error.message)

    alert('Ilmoitus päivitetty!')
    router.push('/profiili')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Päivitys epäonnistui.'
    setSubmitError(message)
  } finally {
    setIsSubmitting(false)
  }
}


  if (loading) return <p className="text-center py-8">Ladataan...</p>

  return (
    <main className="max-w-xl mx-auto px-4 py-8 bg-white rounded shadow my-12">
      <h1 className="text-2xl font-bold mb-4">Muokkaa ilmoitusta</h1>

      {submitError && (
        <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3 text-sm mb-3">
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

        {/* OTSIKKO */}
        <input
          type="text"
          placeholder="Otsikko"
          value={otsikko}
          onChange={(e) => setOtsikko(e.target.value)}
          maxLength={80}
          className="w-full border px-4 py-2 rounded"
        />
        <p className="text-sm text-gray-500 text-right">{otsikko.length}/80 merkkiä</p>
        {errors.otsikko && <p className="text-sm text-red-600">{errors.otsikko}</p>}

        {/* KUVAUS */}
        <textarea
          placeholder="Kuvaus"
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        {errors.kuvaus && <p className="text-sm text-red-600">{errors.kuvaus}</p>}

        {/* SIJAINTI */}
        <div ref={wrapperRef} className="relative">
          <input
            type="text"
            placeholder="Sijainti (esim. Tampere)"
            value={sijainti}
            onChange={(e) => setSijainti(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && sijaintiehdotukset.length > 0) {
                e.preventDefault()
                const exact = sijaintiehdotukset.find((p) => p.toLowerCase() === sijainti.toLowerCase())
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
                  onMouseDown={(ev) => ev.preventDefault()}
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
        {errors.sijainti && <p className="text-sm text-red-600">{errors.sijainti}</p>}

        {/* KATEGORIA */}
        <select value={kategoria} onChange={(e) => setKategoria(e.target.value)} className="w-full border px-4 py-2 rounded">
          <option value="">Valitse kategoria</option>
          <option value="Palvelut">Palvelut</option>
          <option value="Hyvinvointi ja Kauneus">Hyvinvointi ja Kauneus</option>
          <option value="Koti ja Remontointi">Koti ja Remontointi</option>
          <option value="Eläinpalvelut">Eläinpalvelut</option>
          <option value="Käsityöläiset">Käsityöläiset</option>
          <option value="Media ja Luovuus">Media ja Luovuus</option>
          <option value="Vuokratilat ja Juhlapaikat">Vuokratilat ja Juhlapaikat</option>
          <option value="Tapahtumat">Tapahtumat</option>
        </select>
        {errors.kategoria && <p className="text-sm text-red-600">{errors.kategoria}</p>}

        {/* TAPAHTUMAT */}
        {kategoria === 'Tapahtumat' && (
          <>
            <label className="block">Tapahtuman alkupäivä:</label>
            <DayPicker selected={tapahtumaAlku} onSelect={setTapahtumaAlku} locale={fi} mode="single" />
            {errors.tapahtumaAlku && <p className="text-sm text-red-600">{errors.tapahtumaAlku}</p>}

            <label className="block">Tapahtuman loppupäivä:</label>
            <DayPicker selected={tapahtumaLoppu} onSelect={setTapahtumaLoppu} locale={fi} mode="single" />
            {errors.tapahtumaLoppu && <p className="text-sm text-red-600">{errors.tapahtumaLoppu}</p>}
          </>
        )}

        {/* KUVA */}
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
                const result = event.target?.result
                if (typeof result === 'string') {
                  setEsikatselu(result)
                  setShowCropper(true)
                }
              }
              reader.readAsDataURL(pakattu)
            } catch (err: unknown) {
              console.error('Kuvan pakkaus epäonnistui:', err)
              alert('Kuvan pakkaus epäonnistui.')
            }
          }}
          className="w-full"
        />

        {showCropper && esikatselu && (
          <div className="relative w-full h-64 bg-gray-200 rounded overflow-hidden">
            <Cropper
              image={esikatselu}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, area) => setCroppedAreaPixels(area)}
            />
            <button
              type="button"
              onClick={async () => {
                if (!esikatselu || !croppedAreaPixels) return
                const out = await getCroppedImg(esikatselu, croppedAreaPixels)

                // out voi olla File tai Blob -> tehdään varmasti File
                const file =
                  out instanceof File
                    ? out
                    : new File([out], 'rajaus.jpg', { type: 'image/jpeg' })

                setKuva(file)
                setEsikatselu(URL.createObjectURL(file))
                setShowCropper(false)
              }}
              className="absolute bottom-2 right-2 bg-[#3f704d] text-white px-4 py-2 rounded"
            >
              Käytä rajattua kuvaa
            </button>
          </div>
        )}

        {esikatselu && !showCropper && (
          <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
            <Image
              src={esikatselu}
              alt="Esikatselu"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        )}

        {/* NÄKYVYYS */}
        <label className="block font-medium">Valitse ilmoitustyyppi:</label>
        <select
          value={tyyppi}
          onChange={(e) => setTyyppi(e.target.value === 'premium' ? 'premium' : 'perus')}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="perus">Perusilmoitus</option>
          <option value="premium">Premium näkyvyys</option>
        </select>

        {tyyppi === 'perus' && (
          <>
            <label className="block">Näkyvyysaika:</label>
            <select
              value={voimassaKesto}
              onChange={(e) => setVoimassaKesto(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="7">7 päivää</option>
              <option value="14">14 päivää</option>
              <option value="30">30 päivää</option>
              <option value="60">60 päivää</option>
              <option value="90">90 päivää</option>
            </select>

            <label className="block">Ilmoituksen alkupäivä:</label>
            <DayPicker mode="single" selected={voimassaAlku} onSelect={setVoimassaAlku} locale={fi} />

            <p className="text-sm text-gray-600">
              Näkyy: <strong>{(voimassaAlku ?? new Date()).toLocaleDateString('fi-FI')} – {perusLoppuDate.toLocaleDateString('fi-FI')}</strong>
            </p>
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

            <label className="block">Premium-alkupäivä:</label>
            <DayPicker
            mode="single"
            selected={alku}
            onSelect={setAlku}
            disabled={varatutPaivat}
            modifiers={{ varattu: varatutPaivat }}
            modifiersClassNames={{ varattu: 'bg-red-500 text-white' }}
            locale={fi}
            />

            {errors.alku && <p className="text-sm text-red-600">{errors.alku}</p>}

            {alku && premiumLoppuDate && (
              <p className="text-sm text-gray-600">
                Premium: <strong>{alku.toLocaleDateString('fi-FI')} – {premiumLoppuDate.toLocaleDateString('fi-FI')}</strong>
              </p>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-[#3f704d] text-white px-6 py-2 rounded hover:bg-[#2f5332] ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Tallennetaan...' : 'Tallenna muutokset'}
        </button>
      </form>
    </main>
  )
}
