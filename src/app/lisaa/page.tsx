'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { format, addDays, isSameDay } from 'date-fns'
import { fi } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function LisaaIlmoitus() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kuva, setKuva] = useState<File | null>(null)
  const [esikatselu, setEsikatselu] = useState<string>('')
  const [tyyppi, setTyyppi] = useState('perus')
  const [alku, setAlku] = useState<Date | undefined>()
  const [kesto, setKesto] = useState('7')
  const [kategoria, setKategoria] = useState('')
  const [premiumTyyppi, setPremiumTyyppi] = useState('etusivu')
  const [varatutPaivat, setVaratutPaivat] = useState<Date[]>([])
  const [hinta, setHinta] = useState('0 €')

  useEffect(() => {
    const hae = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
      else router.push('/kirjaudu')
    }
    hae()
  }, [router])

  useEffect(() => {
    const haePremiumKalenteri = async () => {
      const { data } = await supabase.from('ilmoitukset').select('premium_alku, premium_loppu, premium_tyyppi')
      const paivat: Date[] = []

      data?.forEach((ilmo: any) => {
        if (ilmo.premium_tyyppi === premiumTyyppi) {
          const alku = new Date(ilmo.premium_alku)
          const loppu = new Date(ilmo.premium_loppu)
          for (let d = alku; d <= loppu; d = addDays(d, 1)) {
            paivat.push(new Date(d))
          }
        }
      })

      setVaratutPaivat(paivat)
    }

    if (tyyppi === 'premium') {
      haePremiumKalenteri()
    }
  }, [tyyppi, premiumTyyppi])

  useEffect(() => {
    if (tyyppi === 'perus') {
      if (kesto === '7') setHinta('0,90 €')
      else if (kesto === '14') setHinta('1,40 €')
      else if (kesto === '30') setHinta('1,90 €')
    } else if (tyyppi === 'nosto') setHinta('0,90 €')
    else if (tyyppi === 'premium') {
      if (premiumTyyppi === 'etusivu') {
        if (kesto === '7') setHinta('6,90 €')
        else if (kesto === '14') setHinta('9,90 €')
        else if (kesto === '30') setHinta('14,90 €')
      } else if (premiumTyyppi === 'kategoria') {
        if (kesto === '7') setHinta('4,90 €')
        else if (kesto === '14') setHinta('6,90 €')
        else if (kesto === '30') setHinta('9,90 €')
      }
    }
  }, [tyyppi, kesto, premiumTyyppi])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const nykyhetki = new Date()
    let kuvaUrl = ''

    if (kuva) {
      const tiedostonimi = `${Date.now()}_${kuva.name}`
      const { data, error } = await supabase.storage.from('kuvat').upload(tiedostonimi, kuva)
      if (!error) {
        const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
        kuvaUrl = publicUrl.publicUrl
      }
    }

    const loppuDate = alku ? new Date(alku.getTime() + parseInt(kesto) * 86400000) : null

    if (tyyppi === 'premium' && alku && loppuDate) {
      const paallekkaisia = varatutPaivat.filter(p => isSameDay(p, alku))
      if (paallekkaisia.length > 0) {
        alert('Valitulla päivällä on jo Premium näkyvyys valitussa tyypissä.')
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
      premium: tyyppi === 'premium',
      premium_alku: tyyppi === 'premium' ? alku?.toISOString() : null,
      premium_loppu: tyyppi === 'premium' ? loppuDate?.toISOString() : null,
      premium_tyyppi: tyyppi === 'premium' ? premiumTyyppi : null,
      luotu: nykyhetki.toISOString()
    }

    const { error } = await supabase.from('ilmoitukset').insert(ilmoitus)
    if (!error) router.push('/')
    else alert('Virhe tallennuksessa: ' + error.message)
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow my-12">
      <h1 className="text-2xl font-bold mb-4">Lisää uusi ilmoitus</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Otsikko" value={otsikko} onChange={(e) => setOtsikko(e.target.value)} required className="w-full border px-4 py-2 rounded" />
        <textarea placeholder="Kuvaus" value={kuvaus} onChange={(e) => setKuvaus(e.target.value)} required className="w-full border px-4 py-2 rounded" />
        <input type="text" placeholder="Sijainti (esim. Porvoo)" value={sijainti} onChange={(e) => setSijainti(e.target.value)} required className="w-full border px-4 py-2 rounded" />

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

        <input type="file" accept="image/*" onChange={(e) => {
          const tiedosto = e.target.files?.[0]
          if (tiedosto) {
            setEsikatselu(URL.createObjectURL(tiedosto))
            setKuva(tiedosto)
          }
        }} className="w-full" />

        {esikatselu && <img src={esikatselu} alt="Esikatselu" className="h-32 rounded shadow" />}

        <label className="block font-medium">Valitse ilmoitustyyppi:</label>
        <select value={tyyppi} onChange={(e) => setTyyppi(e.target.value)} className="w-full border px-4 py-2 rounded">
          <option value="perus">Perusilmoitus (kampanjassa nyt ilmainen)</option>
          <option value="nosto">Nosto haun kärkeen (0,90 €)</option>
          <option value="premium">Premium näkyvyys</option>
        </select>

        {tyyppi === 'premium' && (
          <>
            <label className="block">Premium näkyvyystyyppi:</label>
            <select value={premiumTyyppi} onChange={(e) => setPremiumTyyppi(e.target.value)} className="w-full border px-4 py-2 rounded">
              <option value="etusivu">Etusivu</option>
              <option value="kategoria">Kategoria</option>
            </select>

            <label className="block">Näkyvyysaika:</label>
            <select value={kesto} onChange={(e) => setKesto(e.target.value)} className="w-full border px-4 py-2 rounded">
              <option value="7">7 päivää</option>
              <option value="14">14 päivää</option>
              <option value="30">30 päivää</option>
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

        <p className="text-right font-semibold text-sm">Hinta: {hinta}</p>

        <button type="submit" className="bg-[#3f704d] text-white px-6 py-2 rounded hover:bg-[#2f5332]">
          Julkaise ilmoitus
        </button>
      </form>
    </main>
  )
}
