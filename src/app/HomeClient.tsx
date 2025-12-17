'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Katselukerrat from '@/components/Katselukerrat';
import { supabase } from '@/lib/supabaseClient'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import ehdotukset from '@/data/ehdotusdata.json'
import { Search } from "lucide-react";


import {
  Hammer,
  PawPrint,
  Scissors,
  Camera,
  PartyPopper,
  Heart,
  Home as HomeIcon,
  Book,
  Megaphone,
  Calendar,
  Smile,
  Package
} from "lucide-react";


type PremiumIlmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string
  nayttoja?: number
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hakusana, setHakusana] = useState(searchParams.get('sijainti') || '')
  const [premiumIlmoitukset, setPremiumIlmoitukset] = useState<PremiumIlmoitus[]>([])
  const [suositukset, setSuositukset] = useState<string[]>([])

  useEffect(() => {
    const nyt = new Date().toISOString()
    const haePremiumit = async () => {
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('premium', true)
        .eq('premium_tyyppi', 'etusivu')
        .lte('premium_alku', nyt)
        .gte('premium_loppu', nyt)
        .order('premium_alku', { ascending: true })
        .order('id', { ascending: true })
        .limit(52)

      if (!error && data) {
        const taydelliset = [...data]
        while (taydelliset.length < 52) {
          taydelliset.push({
            id: `tyhja-${taydelliset.length}`,
            otsikko: 'Vapaa mainospaikka',
            kuvaus: 'Tämä paikka voi olla sinun!',
            sijainti: '',
            kuva_url: '',
            nayttoja: 0
          })
        }
        setPremiumIlmoitukset(taydelliset)
      }
    }
    haePremiumit()
  }, [])

  useEffect(() => {
    if (hakusana.length > 1) {
      const filtered = ehdotukset.filter((e) =>
        e.toLowerCase().includes(hakusana.toLowerCase())
      )
      setSuositukset(filtered.slice(0, 5))
    } else {
      setSuositukset([])
    }
  }, [hakusana])

  const hae = () => {
  const query = hakusana.trim()
  if (query) {
    router.push(`/aluehaku?sijainti=${encodeURIComponent(query)}`)
    setSuositukset([]) // tämä piilottaa dropdownin jos haku tehdään Enterillä
  }
}


const kategoriat = [
  { nimi: "Palvelut",          ikoni: <Hammer size={20} /> },
  { nimi: "Eläinpalvelut",     ikoni: <PawPrint size={20} /> },
  { nimi: "Käsityöläiset",     ikoni: <Scissors size={20} /> },
  { nimi: "Media ja Luovuus",  ikoni: <Camera size={20} /> },
  { nimi: "Vuokratilat ja Juhlapaikat", ikoni: <PartyPopper size={20} /> },
  { nimi: "Hyvinvointi ja Kauneus", ikoni: <Heart size={20} /> },
  { nimi: "Koti ja Remontointi", ikoni: <HomeIcon size={20} /> },
  { nimi: "Kurssit ja Koulutukset", ikoni: <Book size={20} /> },
  { nimi: "Ilmoitustaulu",     ikoni: <Megaphone size={20} /> },
  { nimi: "Tapahtumat",        ikoni: <Calendar size={20} /> },
  { nimi: "Pientuottajat",     ikoni: <Package size={20} /> },
].map((kategoria) => ({
  ...kategoria,
bg: `
  bg-[#4F6763]
  hover:bg-[#6A837F]
  text-white
  shadow
  hover:shadow-md
  transition-all
  duration-200
  ring-1 ring-black/5
`
}));


  const urlSafeKategoria = (kategoria: string) =>
    encodeURIComponent(kategoria.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, '-'))

  return (
<main className="min-h-screen font-sans text-charcoal bg-white">



  <div className="relative z-10">
<section className="relative overflow-hidden px-4 sm:px-6 pt-10 pb-8">
  
        <div className="max-w-screen-xl mx-auto">
<div className="flex flex-col items-center gap-6 text-center">
<div className="w-full text-center flex flex-col items-center">
<h1 className="
  text-3xl sm:text-4xl md:text-5xl
  font-medium
  text-[#1E3A41]
  mb-3
  tracking-tight
  leading-snug
  max-w-3xl
">
  Löydä tai mainosta paikallisesti
</h1>


<div className="
  flex flex-col
  sm:flex-row
  items-center
  justify-center
  gap-2
  text-[#1E3A41]/75
  text-base sm:text-lg
  mb-4
">
  <span>Mainoskylä yhdistää ihmiset ja paikalliset yritykset</span>
  <span className="hidden sm:inline">•</span>
  <span>Paikallinen mainospaikka yrittäjille ja tekijöille</span>
</div>




<div className="relative w-full max-w-lg mx-auto mt-6 mb-8">
<div className="relative w-full max-w-lg mx-auto mt-4 mb-6">
  <input
    type="text"
    placeholder="Hae paikkakunta tai sana..."
    value={hakusana}
    onChange={(e) => setHakusana(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && hae()}
    className="w-full rounded-full border border-charcoal/20 pl-5 pr-12 py-3 text-charcoal placeholder:text-charcoal/50 focus:ring-2 focus:ring-persikka"
  />
  <button
    onClick={hae}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal hover:text-persikka transition"
  >
   <Search size={20} />
  </button>
</div>

                {suositukset.length > 0 && (
                  <ul className="absolute bg-white border rounded shadow w-full mt-1 z-10 max-h-40 overflow-y-auto">
                    {suositukset.map((ehto, idx) => (
                      <li
  key={idx}
  className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer text-left"
  onClick={() => {
    setHakusana(ehto)
    setSuositukset([])   // piilota dropdown
    hae()                // tee haku heti 
  }}
>
  {ehto}
</li>

                    ))}
                  </ul>
                )}
              </div>



                {/* Pallokategoria nappulat */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-4 mt-8 justify-items-center">
  {kategoriat.map((k) => (
    <div key={k.nimi} className="flex flex-col items-center">
      <button
  onClick={() => router.push(`/kategoriat/${urlSafeKategoria(k.nimi)}`)}
  className={`
    ${k.bg}
    flex items-center justify-center
    w-12 h-12 rounded-full
    transition hover:shadow-md
  `}
>
  {k.ikoni}
</button>

      <span className="mt-1 text-xs text-center text-[#1E3A41]">
        {k.nimi}
      </span>
    </div>
  ))}
</div>



            </div>
          </div>
        </div>
      </section>

<section className="bg-[#F6F7F7] px-4 sm:px-6 py-10">
  <div className="max-w-screen-xl mx-auto">
    <h2 className="text-xl font-semibold text-[#2f5332] mb-4">Etusivun Premium-ilmoitukset</h2>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {premiumIlmoitukset.map((ilmo) => (
<div key={ilmo.id} className="bg-white/60 border border-[#D9EDE3]
 rounded-xl p-4 shadow hover:shadow-lg transition duration-300">
          {ilmo.kuva_url ? (
            <div className="relative w-full h-32 rounded overflow-hidden mb-2 bg-white">
              <Image
                src={ilmo.kuva_url || '/placeholder.jpg'}
                alt={ilmo.otsikko}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>
          ) : (
            <div className="h-32 bg-white rounded mb-2" />
          )}
          <h3 className="font-semibold text-sm text-gray-900 truncate">{ilmo.otsikko}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
          <Katselukerrat count={ilmo.nayttoja || 0} small />

          {!ilmo.id.startsWith('tyhja-') && (
            <button
  onClick={() => router.push(`/ilmoitukset/${ilmo.id}`)}
  className="mt-2 w-full px-3 py-1 text-xs bg-[#FDF6EF] text-[#1E3A41] border border-[#1E3A41] rounded hover:bg-[#1E3A41] hover:text-white transition hover:shadow-lg"
>
  Näytä
</button>



          )}
          {ilmo.id.startsWith('tyhja-') && (
            <button
  onClick={() => router.push('/lisaa')}
  className="mt-2 w-full px-3 py-1 text-xs bg-[#FDF6EF] text-[#1E3A41] border border-[#1E3A41] rounded hover:bg-[#1E3A41] hover:text-white transition hover:shadow-lg"
>
  Lisää oma ilmoitus
</button>



          )}
        </div>
      ))}
    </div>
  </div>
</section>




<section className="bg-cream px-6 py-12 text-charcoal">


  <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-8">
    <div className="md:w-1/2 text-center md:text-left">
      <h3 className="text-2xl md:text-3xl font-extrabold mb-4">
        Lisää oma ilmoituksesi helposti!
      </h3>
      <p className="text-base md:text-lg text-[#333] mb-6">
        Kerro palveluistasi tai tuotteistasi Mainoskylässä ja tavoita paikalliset asiakkaat. Ilmoituksen tekeminen on nyt täysin ilmaista!
      </p>
      <button
  onClick={() => router.push('/lisaa')}
  className="bg-persikka text-white px-6 py-3 rounded-full hover:bg-persikka-dark transition"
>
  Lisää ilmoitus nyt
</button>

    </div>
    <div className="md:w-1/2">
      <Image
        src="/mainoskylalogo.png"
        alt="Mainoskylä Logo"
        width={300}
        height={300}
        className="mx-auto"
      />
    </div>
  </div>
</section>

<section className="px-6 py-4 beige border-t border-persikka text-sm text-charcoal text-center">


  ⚠️ Muistutus: Älä koskaan anna pankkitunnuksia tai siirrä rahaa ilmoittajalle. Ilmoituksiin liittyvät maksupyynnöt voivat olla huijausyrityksiä.
</section>


      <footer className="bg-beige text-sm text-[#1E3A41]
 text-center py-8 mt-12">

        <div className="space-y-4">
          <nav className="flex flex-wrap justify-center gap-4 font-medium">
            <Link href="/tietoa" className="hover:underline">Tietoa meistä</Link>
            <Link href="/hinnasto" className="hover:underline">Hinnasto</Link>
            <Link href="/ehdot" className="hover:underline">Käyttöehdot</Link>
            <Link href="/tietosuoja" className="hover:underline">Tietosuoja</Link>
            <Link href="/turvallisuus" className="text-blue-600 underline">Turvallisuusohjeet</Link>
            <Link href="/yhteystiedot" className="hover:underline">Yhteystiedot</Link>
          </nav>
          <div className="flex justify-center gap-6 text-xl">
            <a href="https://facebook.com/mainoskyla" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="hover:text-blue-600" />
            </a>
            <a href="https://tiktok.com/@mainoskyla" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok className="hover:text-black" />
            </a>
            <a href="https://instagram.com/mainoskyla" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="hover:text-pink-500" />
            </a>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              Ilmoitukset ovat maksuttomia ja alusta on vielä kehitysvaiheessa.
            </p>
            <p>&copy; {new Date().getFullYear()} Mainoskylä</p>
          </div>
        </div>
      </footer>
      </div>
    </main>
)
}
