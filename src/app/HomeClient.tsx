'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Katselukerrat from '@/components/Katselukerrat';
import { supabase } from '@/lib/supabaseClient'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'
import CategoryCarousel from '@/components/CategoryCarousel'
import { Search, Eye } from "lucide-react";




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

type SuosittuIlmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string | null
  nayttoja?: number | null
  kategoria?: string | null
}


export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hakusana, setHakusana] = useState(searchParams.get('sijainti') || '')
  const [mode, setMode] = useState<'hae' | 'ilmoita'>('hae')

  const [premiumIlmoitukset, setPremiumIlmoitukset] = useState<PremiumIlmoitus[]>([])
  const [suositukset, setSuositukset] = useState<string[]>([])
  const [nytSuosittua, setNytSuosittua] = useState<SuosittuIlmoitus[]>([])
  const nytSuosittuaRef = useRef<HTMLDivElement | null>(null)

const scrollNytSuosittua = (dir: 'left' | 'right') => {
    const el = nytSuosittuaRef.current
    if (!el) return
    const amount = 320
    el.scrollBy({
      left: dir === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

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
  const haeNytSuosittua = async () => {
    const { data, error } = await supabase
  .from('ilmoitukset')
  .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja, kategoria')
  .not('kuva_url', 'is', null)
  .neq('kuva_url', '')
  .order('nayttoja', { ascending: false })
  .order('luotu', { ascending: false })
  .limit(20)

  console.log('Nyt suosittua error:', error)
console.log('Nyt suosittua data:', data)


    if (!error && data) setNytSuosittua(data as SuosittuIlmoitus[])
  }

  haeNytSuosittua()
}, [])


  useEffect(() => {
    if (hakusana.length > 1) {
      const filtered = (paikkakunnat as string[]).filter((p) =>
  p.toLowerCase().includes(hakusana.toLowerCase())
)
setSuositukset(filtered.slice(0, 6))

    } else {
      setSuositukset([])
    }
  }, [hakusana])


const hae = () => {
  const query = hakusana.trim()
  if (!query) return

  router.push(`/aluehaku?sijainti=${encodeURIComponent(query)}`)
  setSuositukset([]) // piilota dropdown
}



const kategoriat = [
  {
    nimi: "Palvelut",
    href: "/kategoriat/palvelut",
    ikoni: <Hammer className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Eläinpalvelut",
    href: "/kategoriat/elainpalvelut",
    ikoni: <PawPrint className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Käsityöläiset",
    href: "/kategoriat/kasityolaiset",
    ikoni: <Scissors className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Media ja Luovuus",
    href: "/kategoriat/media-ja-luovuus",
    ikoni: <Camera className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Vuokratilat ja Juhlapaikat",
    href: "/kategoriat/vuokratilat-ja-juhlapaikat",
    ikoni: <PartyPopper className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Hyvinvointi ja Kauneus",
    href: "/kategoriat/hyvinvointi-ja-kauneus",
    ikoni: <Heart className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Koti ja Remontointi",
    href: "/kategoriat/koti-ja-remontointi",
    ikoni: <HomeIcon className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },

  // Piiloon alkuun:
  {
    nimi: "Kurssit ja Koulutukset",
    href: "/kategoriat/kurssit-ja-koulutukset",
    ikoni: <Book className="h-6 w-6 text-[#1E3A41]" />,
    enabled: false,
  },
  {
    nimi: "Ilmoitustaulu",
    href: "/kategoriat/ilmoitustaulu",
    ikoni: <Megaphone className="h-6 w-6 text-[#1E3A41]" />,
    enabled: false,
  },
  {
    nimi: "Tapahtumat",
    href: "/kategoriat/tapahtumat",
    ikoni: <Calendar className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
  },
  {
    nimi: "Pientuottajat",
    href: "/kategoriat/pientuottajat",
    ikoni: <Package className="h-6 w-6 text-[#1E3A41]" />,
    enabled: false,
  },
].map((kategoria) => ({
  ...kategoria,
  bg: `
  bg-[#E8EFEC]
  hover:bg-[#DCE7E2]
  text-[#1E3A41]
  ring-1 ring-black/5
  transition-all
  duration-200
`,

}));

const visibleKategoriat = kategoriat.filter((k) => k.enabled)


  const urlSafeKategoria = (kategoria: string) =>
    encodeURIComponent(kategoria.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, '-'))

  return (
<main className="min-h-screen font-sans text-charcoal bg-white">



  <div className="relative z-10">
<section className="relative px-4 sm:px-6 pt-4 sm:pt-8 pb-3 sm:pb-6">
  
        <div className="max-w-screen-xl mx-auto">
<div className="flex flex-col items-center gap-4 text-center">
<div className="w-full text-center flex flex-col items-center">
<h1 className="
  text-2xl sm:text-4xl md:text-5xl
  font-medium
  text-[#1E3A41]
  mb-1
  tracking-tight
  leading-tight
  max-w-3xl
">
  Löydä tai mainosta paikallisesti
</h1>


  <p className="mt-2 text-sm sm:text-base text-charcoal/70 leading-relaxed max-w-2xl text-center mx-auto">
  Mainoskylä yhdistää ihmiset ja paikalliset yritykset
  <span className="hidden sm:inline"> • </span>
  <span className="block sm:inline mt-1 sm:mt-0">
    Paikallinen mainospaikka yrittäjille ja tekijöille
  </span>
</p>


</div>




{/* 🔎 Hero-kortti: Hae / Ilmoita */}
  <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-3xl mx-auto mt-3 mb-2 sm:mt-4 sm:mb-4">
  <div className="bg-white/95 backdrop-blur rounded-3xl shadow-lg ring-1 ring-black/5 overflow-hidden">
    
    {/* Tabit */}
    <div className="flex">
      <button
        type="button"
        onClick={() => setMode('hae')}
        className={`flex-1 px-4 py-3 text-sm font-semibold transition
          ${mode === 'hae'
  ? 'bg-[#EDF5F2] text-[#1E3A41]'
  : 'bg-white text-charcoal/70 hover:text-[#1E3A41]'}

        `}
      >
        <span className="inline-flex items-center gap-2">
  <Search className="h-4 w-4" />
  Hae
</span>

      </button>

      <button
        type="button"
        onClick={() => setMode('ilmoita')}
        className={`flex-1 px-4 py-3 text-sm font-semibold transition
          ${mode === 'ilmoita'
  ? 'bg-[#EDF5F2] text-[#1E3A41]'
  : 'bg-white text-charcoal/70 hover:text-[#1E3A41]'}

        `}
      >
       <span className="inline-flex items-center gap-2">
  <span className="text-lg leading-none">+</span>
  Ilmoita
</span>

      </button>
    </div>

    {/* Sisältö */}
    <div className="p-5 sm:p-6">
      {mode === 'hae' ? (
        <>
          {/* Haku */}
            <div className="relative mt-1">
            <input
              type="text"
              placeholder="Hae paikkakunta tai sana..."
              value={hakusana}
              onChange={(e) => setHakusana(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && hae()}
              className="w-full rounded-2xl border border-charcoal/15 pl-4 pr-12 py-3 text-charcoal placeholder:text-charcoal/50 focus:ring-2 focus:ring-persikka"
            />
            <button
              onClick={hae}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal hover:text-persikka transition"
              aria-label="Hae"
            >
              <Search size={20} />
            </button>

            {suositukset.length > 0 && (
              <ul className="absolute bg-white border rounded-2xl shadow w-full mt-2 z-20 max-h-44 overflow-y-auto">
                {suositukset.map((ehto, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer text-left"
                    onClick={() => {
                      setHakusana(ehto)
                      setSuositukset([])
                      router.push(`/aluehaku?sijainti=${encodeURIComponent(ehto)}`)
                    }}
                  >
                    {ehto}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="mt-2 text-xs text-charcoal/60 text-left pl-1">
            Esim: “Tampere”, “valokuvaaja”, “koirahoitaja
          </p>

          {/* CTA-nappi */}
          <div className="mt-4">
            <button
              type="button"
              onClick={hae}
              className="w-full rounded-full bg-[#4F8F7A] hover:bg-[#437D6B]

 text-white font-semibold py-3 transition shadow-sm hover:shadow-md"
            >
              Etsi ilmoituksia
            </button>
          </div>
        </>
      ) : (
        <>
          {/* ILMOITA */}
    <div className="flex flex-col items-center gap-4 text-center py-6">
      <p className="text-sm text-charcoal/70 max-w-md">
        Kerro palveluistasi tai tuotteistasi ja tavoita paikalliset asiakkaat Mainoskylässä.
      </p>

      <button
        type="button"
        onClick={() => router.push('/lisaa')}
        className="
          w-full sm:w-auto
          px-8 py-3
          rounded-full
          bg-[#FDF6EF]
          hover:bg-[#F7EDE3]
          text-[#1E3A41]
          font-semibold
          ring-1 ring-black/10
          shadow-sm
          hover:shadow-md
          transition
        "
      >
        ➕ Ilmoita ilmaiseksi
      </button>

      <p className="text-[11px] text-charcoal/60">
        Ilmoituksen luominen vie alle 2 minuuttia.
      </p>
    </div>
  </>
)}
    </div>
  </div>
</div>




{/*  Nyt suosittua */}
{nytSuosittua.length > 0 && (
  <div className="w-full mt-2 sm:mt-5">
    <div className="flex items-center justify-between px-1">
      <div className="text-left">
        <h2 className="text-base font-semibold text-[#1E3A41]">
           Nyt suosittua Mainoskylässä
        </h2>
        
      </div>

      {/* Desktop: nuolinapit */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollNytSuosittua('left')}
          className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
          aria-label="Selaa vasemmalle"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollNytSuosittua('right')}
          className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
          aria-label="Selaa oikealle"
        >
          ›
        </button>
      </div>
    </div>

    {/* Yksi rivi: mobiili swipe + desktop myös scroll, mutta ohjataan nuolilla */}
    <div className="mt-2 sm:mt-3 -mx-4 px-4 pr-6">
      <div
  ref={nytSuosittuaRef}
  className="w-full flex flex-nowrap gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar"
  style={{ WebkitOverflowScrolling: 'touch' }}
>

        {nytSuosittua.map((ilmo) => (
          <button
            key={ilmo.id}
            type="button"
            onClick={() => router.push(`/ilmoitukset/${ilmo.id}`)}
            className="
  snap-start
  flex-none
  w-[220px] sm:w-[260px] lg:w-[300px]
  bg-white ring-1 ring-black/5
  rounded-2xl overflow-hidden
  shadow-sm hover:shadow-md transition
  text-left
"

          >
            <div className="relative w-full h-28 sm:h-36 bg-[#F6F7F7]">
              <Image
              src={ilmo.kuva_url || '/placeholder.jpg'}
              alt={ilmo.otsikko}
              fill
              className="object-cover object-center"
             sizes="240px"
              />

            </div>

            <div className="p-3">
              <div className="font-semibold text-sm text-[#1E3A41] truncate">
                {ilmo.otsikko}
              </div>
              <div className="text-xs text-charcoal/70 truncate">
                {ilmo.sijainti}
              </div>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-charcoal/60">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F7F7] px-2 py-1">
                <Eye className="h-4 w-4" />
                {ilmo.nayttoja ?? 0}
                </span>

                {ilmo.kategoria && (
                  <span className="truncate rounded-full bg-[#F6F7F7] px-2 py-1">
                    {ilmo.kategoria}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
)}




                {/* Pallokategoria nappulat */}
{/* Mobiili: kategoriat Tori-tyyliin (2 riviä + sivutus vasemmalle) */}
<div className="sm:hidden mt-3">
 <CategoryCarousel
  categories={visibleKategoriat.map((k) => ({
    name: k.nimi,
    href: `/kategoriat/${urlSafeKategoria(k.nimi)}`,
    icon: k.ikoni,
  }))}
/>
</div>


{/* Desktop: kaikki samalla rivillä */}
<div className="hidden sm:flex justify-center mt-8">
  <div className="flex gap-5 justify-center px-6">
    {visibleKategoriat.map((k) => (
      <div key={k.nimi} className="flex flex-col items-center shrink-0">
        <button
          onClick={() => router.push(`/kategoriat/${urlSafeKategoria(k.nimi)}`)}
className="
  flex items-center justify-center
  w-14 h-14 rounded-full
  bg-[#EDF5F2]
  hover:bg-[#DCEEE8]
  transition
  ring-1 ring-[#4F8F7A]/30
"
        >
          {k.ikoni}
        </button>

        <span className="mt-1 text-xs text-center text-[#1E3A41] max-w-[90px] leading-tight">
          {k.nimi}
        </span>
      </div>
    ))}
  </div>
</div>





            </div>
          </div>
   </section>   

<section className="bg-[#F6F7F7] px-4 sm:px-6 py-6">
  <div className="max-w-screen-xl mx-auto">
<h2 className="text-base sm:text-lg font-semibold text-[#1E3A41] mb-3">
  Premium-paikat
</h2>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {premiumIlmoitukset.map((ilmo) => (
  <div
    key={ilmo.id}
    role="button"
    tabIndex={0}
    onClick={() => {
      if (!ilmo.id.startsWith('tyhja-')) {
        router.push(`/ilmoitukset/${ilmo.id}`)
      }
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !ilmo.id.startsWith('tyhja-')) {
        router.push(`/ilmoitukset/${ilmo.id}`)
      }
    }}
    className="
      cursor-pointer
      group bg-white ring-1 ring-black/5

      rounded-xl p-3
      shadow-sm
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-xl
    "
  >

          {ilmo.kuva_url ? (
<div className="relative w-full h-36 rounded-lg overflow-hidden mb-1 bg-white">
              <Image
  src={ilmo.kuva_url || '/placeholder.jpg'}
  alt={ilmo.otsikko}
  fill
  className="object-cover transition-transform duration-300 group-hover:scale-105"
  sizes="(max-width: 768px) 100vw, 20vw"
/>

            </div>
          ) : (
            <div className="h-32 bg-white rounded mb-2" />
          )}
          <h3 className="font-semibold text-sm text-gray-900 truncate">{ilmo.otsikko}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
          <Katselukerrat count={ilmo.nayttoja || 0} small />

        
          {ilmo.id.startsWith('tyhja-') && (
            <button
  onClick={(e) => {
    e.stopPropagation()
    router.push('/lisaa')
  }}
className="
  mt-2 w-full px-3 py-2 text-xs font-semibold
  rounded-full
  bg-[#EDF5F2]
  text-[#1E3A41]
  ring-1 ring-[#4F8F7A]/35
  hover:bg-[#DCEEE8]
  hover:ring-[#4F8F7A]/55
  transition
"
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
  Lisää ilmoitus
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
