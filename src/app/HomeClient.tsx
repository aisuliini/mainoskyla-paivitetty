'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Katselukerrat from '@/components/Katselukerrat';
import { supabase } from '@/lib/supabaseClient'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import ehdotukset from '@/data/ehdotusdata.json'
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
  sijaint: string
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
  { nimi: "Palvelut",          ikoni: <Hammer size={20} />,     bg: "bg-minttu hover:bg-minttu-dark text-white" },
  { nimi: "Eläinpalvelut",     ikoni: <PawPrint size={20} />,   bg: "bg-persikka hover:bg-persikka-dark text-white" },
  { nimi: "Käsityöläiset",     ikoni: <Scissors size={20} />,   bg: "bg-minttu hover:bg-minttu-dark text-white" },
  { nimi: "Media ja Luovuus",  ikoni: <Camera size={20} />,     bg: "bg-persikka hover:bg-persikka-dark text-white" },
  { nimi: "Vuokratilat ja Juhlapaikat", ikoni: <PartyPopper size={20} />, bg: "bg-minttu hover:bg-minttu-dark text-white" },
  { nimi: "Hyvinvointi ja Kauneus", ikoni: <Heart size={20} />,     bg: "bg-persikka hover:bg-persikka-dark text-white" },
  { nimi: "Koti ja Remontointi", ikoni: <HomeIcon size={20} />,    bg: "bg-minttu hover:bg-minttu-dark text-white" },
  { nimi: "Kurssit ja Koulutukset", ikoni: <Book size={20} />,      bg: "bg-persikka hover:bg-persikka-dark text-white" },
  { nimi: "Ilmoitustaulu",      ikoni: <Megaphone size={20} />,   bg: "bg-minttu hover:bg-minttu-dark text-white" },
  { nimi: "Tapahtumat",        ikoni: <Calendar size={20} />,   bg: "bg-persikka hover:bg-persikka-dark text-white" },
  { nimi: "Vapaa-aika",        ikoni: <Smile size={20} />,      bg: "bg-minttu hover:bg-minttu-dark text-white" },
  { nimi: "Pientuottajat",     ikoni: <Package size={20} />,    bg: "bg-persikka hover:bg-persikka-dark text-white" },
  { nimi: "Muut",              ikoni: null,                    bg: "bg-minttu hover:bg-minttu-dark text-white" },
]




  const urlSafeKategoria = (kategoria: string) =>
    encodeURIComponent(kategoria.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, '-'))

  return (
<main className="min-h-screen font-sans text-[#1E3A41] bg-[#F7FAF9]">





  
  <div className="relative z-10">
      <section className="py-8 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex-shrink-0">
              <Image
  src="/mainoskylalogo.png"
  alt="Mainoskylä"
  width={250}
  height={250}
  priority
/>


            </div>
            <div className="w-full text-center md:text-left">
              <h1
  className="text-3xl md:text-4xl font-extrabold leading-snug mb-6 text-[#1E3A41] drop-shadow-sm"
>

  Löydä tai mainosta paikallisesti – Mainoskylä yhdistää ihmiset ja yritykset.
</h1>


              <p className="text-base md:text-lg text-gray-700 mt-2">
  Oletko paikallinen yrittäjä tai harrastaja? Liity mukaan Mainoskylään – juuri nyt kaikki ilmoitukset ovat ilmaisia!
</p>


            <div className="relative max-w-lg mx-auto md:mx-0 mt-4 mb-6">
  <div className="flex flex-col md:flex-row gap-2">
    <input
      type="text"
      placeholder="Hae paikkakunta tai sana..."
      value={hakusana}
      onChange={(e) => setHakusana(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && hae()}
      className="w-full px-3 py-1 text-sm border border-[#D1E2D2] rounded-full focus:ring-2 focus:ring-[#F99584]/50"

    />
    <button
  onClick={hae}
  className="bg-[#1E3A41] text-white px-6 py-3 rounded-full text-lg hover:bg-[#27494e] transition"
>
  Hae
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
    hae()                // tee haku heti (jos haluat automaattisesti hakea)
  }}
>
  {ehto}
</li>

                    ))}
                  </ul>
                )}
              </div>



                <div className="flex flex-wrap justify-center gap-6 mt-4">
  {kategoriat.map((kategoria) => (
    <div key={kategoria.nimi} className="flex flex-col items-center">
      <button
        onClick={() => router.push(`/kategoriat/${urlSafeKategoria(kategoria.nimi)}`)}
        className={`
          flex items-center justify-center
          w-20 h-20 rounded-full
          ${kategoria.bg}
          transition transform hover:scale-105
        `}
      >
        <div className="text-xl">
          {kategoria.ikoni}
        </div>
      </button>
      <span className="mt-2 text-xs text-center text-[#1E3A41]">
        {kategoria.nimi}
      </span>
    </div>
  ))}
</div>


            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-8">
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

      <section className="px-6 py-4 bg-[#FFE5E1] border-t border-[#f1c0bd] text-sm text-[#a94442] text-center">

  ⚠️ Muistutus: Älä koskaan anna pankkitunnuksia tai siirrä rahaa ilmoittajalle. Ilmoituksiin liittyvät maksupyynnöt voivat olla huijausyrityksiä.
</section>


<section className="bg-[#FBE7E3] px-6 py-12 text-[#1E3A41]">

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
        className="bg-[#F99584] text-white px-6 py-3 rounded-full hover:bg-[#E86E5B] transition"
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


      <footer className="bg-[#F7FAF9] text-sm text-[#1E3A41]
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
