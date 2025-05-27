'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LisaaIlmoitus() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kuva, setKuva] = useState<File | null>(null)
  const [esikatselu, setEsikatselu] = useState<string>('')
  const [tyyppi, setTyyppi] = useState('perus')
  const [alku, setAlku] = useState('')
  const [kesto, setKesto] = useState('7')
  const [kategoria, setKategoria] = useState('')
  const [tapahtumaAlku, setTapahtumaAlku] = useState('')
  const [tapahtumaLoppu, setTapahtumaLoppu] = useState('')

  useEffect(() => {
    const hae = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
      else router.push('/kirjaudu')
    }
    hae()
  }, [router])

  const tarkistaPremiumPaikat = async (alkuISO: string, loppuISO: string) => {
    const { data, error } = await supabase
      .from('ilmoitukset')
      .select('premium_alku, premium_loppu')
      .eq('premium', true)

    if (error) return false

    const alkuUusi = new Date(alkuISO)
    const loppuUusi = new Date(loppuISO)
    const paallekkaisia = data.filter((ilmo: any) => {
      const alku = new Date(ilmo.premium_alku)
      const loppu = new Date(ilmo.premium_loppu)
      return !(loppu <= alkuUusi || alku >= loppuUusi)
    })

    return paallekkaisia.length < 12
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const nykyhetki = new Date()

    let kuvaUrl = ''
    if (kuva) {
      const tiedostonimi = `${Date.now()}_${kuva.name}`
      const { data, error } = await supabase.storage.from('kuvat').upload(tiedostonimi, kuva)
      if (error) {
        alert('Virhe kuvan latauksessa: ' + error.message)
        return
      }
      const { data: publicUrl } = supabase.storage.from('kuvat').getPublicUrl(tiedostonimi)
      kuvaUrl = publicUrl.publicUrl
    }

    const alkuDate = tyyppi === 'premium' ? new Date(alku) : null
    const loppuDate = alkuDate && kesto ? new Date(alkuDate.getTime() + parseInt(kesto) * 86400000) : null

    if (tyyppi === 'premium' && alkuDate && loppuDate) {
      const mahtuu = await tarkistaPremiumPaikat(alkuDate.toISOString(), loppuDate.toISOString())
      if (!mahtuu) {
        alert('Premium-paikat ovat täynnä valitulla aikavälillä.')
        return
      }
    }

    const ilmoitus: any = {
      user_id: user.id,
      otsikko,
      kuvaus,
      sijainti,
      kuva_url: kuvaUrl,
      maksuluokka: tyyppi,
      kategoria,
      nostettu_at: tyyppi === 'nosto' ? nykyhetki.toISOString() : null,
      premium: tyyppi === 'premium',
      premium_alku: tyyppi === 'premium' ? alkuDate?.toISOString() : null,
      premium_loppu: tyyppi === 'premium' ? loppuDate?.toISOString() : null,
      luotu: nykyhetki.toISOString()
    }

    if (kategoria === 'Tapahtumat') {
      ilmoitus.tapahtuma_alku = tapahtumaAlku || null
      ilmoitus.tapahtuma_loppu = tapahtumaLoppu || null
    }

    const { error } = await supabase.from('ilmoitukset').insert(ilmoitus)
    if (!error) {
      alert('Ilmoitus lisätty!')
      router.push('/')
    } else {
      alert('Virhe: ' + error.message)
    }
  }

  const handleKuva = (e: any) => {
    const tiedosto = e.target.files?.[0]
    if (!tiedosto) return

    const img = new Image()
    img.onload = () => {
      if (img.width < 800) {
        alert('Kuvan leveys on alle 800px. Laatu voi olla heikko.')
      }
    }
    img.src = URL.createObjectURL(tiedosto)
    setEsikatselu(img.src)
    setKuva(tiedosto)
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
          <option value="Pientuottajat">Pientuottajat</option>
          <option value="Palvelut">Palvelut</option>
          <option value="Käsityöläiset">Käsityöläiset</option>
          <option value="Kurssit">Kurssit</option>
          <option value="Juhlatilat">Juhlatilat</option>
          <option value="Hyvinvointi">Hyvinvointi</option>
          <option value="Tapahtumat">Tapahtumat</option>
          <option value="Vapaa-aika">Vapaa-aika</option>
          <option value="Muut">Muut</option>
        </select>

        {kategoria === 'Tapahtumat' && (
          <div>
            <label className="block mt-2">Tapahtuman alkupäivä:</label>
            <input type="date" value={tapahtumaAlku} onChange={(e) => setTapahtumaAlku(e.target.value)} className="w-full border px-4 py-2 rounded" />
            <label className="block mt-2">Tapahtuman loppupäivä:</label>
            <input type="date" value={tapahtumaLoppu} onChange={(e) => setTapahtumaLoppu(e.target.value)} className="w-full border px-4 py-2 rounded" />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleKuva} className="w-full" />
        {esikatselu && <img src={esikatselu} alt="Esikatselu" className="h-32 rounded shadow" />}

        <div className="space-y-2">
          <label className="block font-medium">Valitse ilmoitustyyppi:</label>
          <select value={tyyppi} onChange={(e) => setTyyppi(e.target.value)} className="w-full border px-4 py-2 rounded">
            <option value="perus">Perusilmoitus (4,90 €)</option>
            <option value="nosto">Nosto haun kärkeen (9,90 €)</option>
            <option value="premium">Premium-etusivu (alkaen 19,90 €)</option>
          </select>
        </div>

        {tyyppi === 'premium' && (
          <>
            <label className="block">Valitse premium-alkupäivä:</label>
            <input type="date" value={alku} onChange={(e) => setAlku(e.target.value)} required className="w-full border px-4 py-2 rounded" />
            <label className="block mt-2">Näkyvyysaika:</label>
            <select value={kesto} onChange={(e) => setKesto(e.target.value)} className="w-full border px-4 py-2 rounded">
              <option value="7">7 päivää</option>
              <option value="14">14 päivää</option>
              <option value="30">30 päivää</option>
            </select>
          </>
        )}

        <button type="submit" className="bg-[#3f704d] text-white px-6 py-2 rounded hover:bg-[#2f5332]">
          Julkaise ilmoitus
        </button>
      </form>
    </main>
  )
}
