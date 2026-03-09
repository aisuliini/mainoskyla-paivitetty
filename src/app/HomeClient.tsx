'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Katselukerrat from '@/components/Katselukerrat';
import { supabase } from '@/lib/supabaseClient'
import { FaFacebookF, FaInstagram, } from 'react-icons/fa'
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
  Calendar,
  Package
} from "lucide-react";

const heroBg = '/images/hero-mainoskyla.jpg'


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

const ESIMERKKIHAKUJA = [
  'kotiapu',
  'siivous',
  'remontti',
  'hieronta',
  'koirahoitaja',
  'valokuvaaja',
  'juhlatila',
  'pihanhoito',
] as const


export default function Home() {
  const router = useRouter()
  const [hakusana, setHakusana] = useState('')
  const [premiumIlmoitukset, setPremiumIlmoitukset] = useState<PremiumIlmoitus[]>([])
  const [showDesktopSuggest, setShowDesktopSuggest] = useState(false)


const query = hakusana.trim().toLowerCase()

// Palvelut/tekijät (ESIMERKKIHAKUJA)
const palveluEhdotukset = useMemo(() => {
  if (!query) return [...ESIMERKKIHAKUJA].slice(0, 8)
  return ESIMERKKIHAKUJA
    .filter((x) => x.toLowerCase().includes(query))
    .slice(0, 8)
}, [query])

// Paikkakunnat (json)
const paikkaEhdotukset = useMemo(() => {
  if (!query) return [] // tyhjällä ei tarvitse näyttää paikkakuntia
  return (paikkakunnat as string[])
    .filter((p) => p.toLowerCase().includes(query))
    .slice(0, 8)
}, [query])



  const [nytSuosittua, setNytSuosittua] = useState<SuosittuIlmoitus[]>([])
  const nytSuosittuaRef = useRef<HTMLDivElement | null>(null)
  const [uusimmat, setUusimmat] = useState<SuosittuIlmoitus[]>([])
  const uusimmatRef = useRef<HTMLDivElement | null>(null)

  





const scrollUusimmat = (dir: 'left' | 'right') => {
  const el = uusimmatRef.current
  if (!el) return
  const amount = 320
  el.scrollBy({
    left: dir === 'right' ? amount : -amount,
    behavior: 'smooth',
  })
}



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
        .limit(6) //Premium paikkoja yhteensä

   
        

      if (!error && data) {
        const taydelliset = [...data]
        while (taydelliset.length < 6) { // Premium paikkoja yhteensä 
          taydelliset.push({
            id: `tyhja-${taydelliset.length}`,
            otsikko: 'Varaa etusivupaikka',
            kuvaus: 'Nosta palvelusi näkyvästi esiin Mainoskylän etusivulla.',
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

  // ✅ Nyt suosittua
useEffect(() => {
  const haeNytSuosittua = async () => {
    const nytISO = new Date().toISOString()

    const { data, error } = await supabase
      .from('ilmoitukset')
      .select('*')
      .or(
        `and(voimassa_alku.is.null,voimassa_loppu.is.null),
         and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
         and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
         and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
      )
      .order('nayttoja', { ascending: false })
      .order('luotu', { ascending: false })
      .limit(20)

    if (!error && data) setNytSuosittua(data as SuosittuIlmoitus[])
  }

  haeNytSuosittua()
}, [])

// ✅ Uusimmat
useEffect(() => {
  const haeUusimmat = async () => {
    const nytISO = new Date().toISOString()

    const { data, error } = await supabase
      .from('ilmoitukset')
      .select('*')
      .or(
        `and(voimassa_alku.is.null,voimassa_loppu.is.null),
         and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
         and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
         and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
      )
      .order('luotu', { ascending: false })
      .limit(20)

    if (!error && data) setUusimmat(data as SuosittuIlmoitus[])
  }

  haeUusimmat()
}, [])



const hae = () => {
  const q = hakusana.trim()
  if (!q) return

  router.push(`/aluehaku?q=${encodeURIComponent(q)}`)
}







const kategoriat = [
  {
    nimi: "Arjen palvelut",
    href: "/kategoriat/arjen-palvelut",
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
  {
    nimi: "Tapahtumat",
    href: "/kategoriat/tapahtumat",
    ikoni: <Calendar className="h-6 w-6 text-[#1E3A41]" />,
    enabled: true,
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
}))

const visibleKategoriat = kategoriat.filter((k) => k.enabled)


    return (
    <main className="min-h-screen font-sans text-charcoal bg-white">



  
<section className="relative overflow-hidden px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-14">
  <div className="absolute inset-0">
    <Image
      src={heroBg}
      alt=""
      fill
      priority
      className="object-cover blur-[1px] scale-105 opacity-[0.30]"
      sizes="100vw"
    />
    <div className="absolute inset-0 bg-white/32" />
  </div>
  
        <div className="relative z-10 max-w-screen-xl mx-auto">
<div className="flex flex-col items-center gap-4 text-center">
<div className="w-full text-center flex flex-col items-center">
<h1
  className="
    text-2xl sm:text-4xl md:text-5xl
    font-medium
    text-[#1E3A41]
    mb-1
    tracking-tight
    leading-tight
    max-w-3xl
  "
>
  Löydä paikalliset palvelut – tai lisää omasi ilmaiseksi
</h1>

<p className="hidden sm:block mt-2 text-sm sm:text-base text-charcoal/70 leading-relaxed max-w-2xl text-center mx-auto">
  Ilmainen ilmoitus • valmis 2 minuutissa • näkyvyys paikallisille heti
</p>




</div>





{/* 🔎 Haku (ilman korttia) */}
<div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto mt-4 sm:mt-6 text-left">
  <div className="w-full">
    {/* ✅ MOBIILI: avaa erillinen haku */}
<div className="sm:hidden">
  <button
    type="button"
    onClick={() => router.push('/haku')}
    className="
      w-full rounded-full border border-charcoal/15 bg-white
      pl-5 pr-12 py-4 text-left
      text-charcoal/70
      relative
      "
    aria-label="Avaa haku"
  >
    Hae palvelua tai tekijää...
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/60">
      <Search size={20} />
    </span>
  </button>
</div>

{/* ✅ MOBIILI CTA */}
<div className="sm:hidden mt-3 flex justify-center">
  <button
    type="button"
    onClick={() => router.push('/lisaa')}
    className="
      rounded-full
      px-8 py-3
      text-sm font-semibold
      bg-[#EDF5F2] text-[#1E3A41]
      hover:bg-[#DCEEE8]
      transition
      ring-1 ring-[#4F8F7A]/35
    "
  >
    Lisää ilmoitus (ilmainen)
  </button>
</div>


{/* ✅ DESKTOP: haku etusivulla + CTA + paremmat ehdotukset */}
<div className="hidden sm:block">
  <form
    onSubmit={(e) => {
      e.preventDefault()
      hae()
    }}
    className="relative"
  >
    <input
      type="search"
      placeholder="Hae palvelua tai tekijää..."
      value={hakusana}
      onChange={(e) => {
        setHakusana(e.target.value)
        setShowDesktopSuggest(true)
      }}
      onFocus={() => setShowDesktopSuggest(true)}
      onBlur={() => {
        // pieni viive että ehtii klikata listasta
        setTimeout(() => setShowDesktopSuggest(false), 120)
      }}
      className="
        w-full rounded-full border border-charcoal/15 bg-white
        pl-5 pr-12 py-4 text-charcoal placeholder:text-charcoal/50
        outline-none focus:outline-none focus:ring-0 focus:border-charcoal/30
      "
      inputMode="search"
      enterKeyHint="search"
      autoCorrect="off"
      autoCapitalize="none"
      spellCheck={false}
    />

    <button
      type="submit"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/70 hover:text-persikka transition"
      aria-label="Hae"
    >
      <Search size={20} />
    </button>

    {/* ✅ Ehdotukset */}
    {showDesktopSuggest && (palveluEhdotukset.length > 0 || paikkaEhdotukset.length > 0) && (
      <div className="absolute left-0 right-0 mt-2 z-20">
        <div className="bg-white/95 backdrop-blur border border-black/10 rounded-2xl shadow-md overflow-hidden">
          <ul className="max-h-80 overflow-y-auto py-1">

            {/* Paikkakunnat */}
            {paikkaEhdotukset.length > 0 && (
              <li className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-wide text-charcoal/50">
                Paikkakunnat
              </li>
            )}

            {paikkaEhdotukset.slice(0, 8).map((p) => (
              <li key={`paikka-${p}`}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center justify-between"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHakusana(p)
                    setShowDesktopSuggest(false)
                    router.push(`/aluehaku?q=${encodeURIComponent(p)}`)
                  }}
                >
                  <span>{p}</span>
                  <span className="text-[11px] text-charcoal/40">alue</span>
                </button>
              </li>
            ))}

            {/* Palvelut/tekijät */}
            {palveluEhdotukset.length > 0 && (
              <li className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-wide text-charcoal/50">
                Palvelut ja tekijät
              </li>
            )}

            {palveluEhdotukset.slice(0, 8).map((x) => (
              <li key={`palvelu-${x}`}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center justify-between"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHakusana(x)
                    setShowDesktopSuggest(false)
                    router.push(`/aluehaku?q=${encodeURIComponent(x)}`)
                  }}
                >
                  <span>{x}</span>
                  <span className="text-[11px] text-charcoal/40">haku</span>
                </button>
              </li>
            ))}

            {/* Näytä kaikki */}
            <li className="border-t border-black/10 mt-1">
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-black/5 font-semibold text-[#1E3A41]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowDesktopSuggest(false)
                  hae()
                }}
              >
                Näytä kaikki tulokset →
              </button>
            </li>

          </ul>
        </div>
      </div>
    )}
  </form>

  {/* ✅ CTA */}
<div className="mt-4 flex items-center justify-center">
  <button
    type="button"
    onClick={() => router.push('/lisaa')}
    className="
      rounded-full px-7 py-3 text-sm font-semibold
      bg-[#EDF5F2] text-[#1E3A41]
      hover:bg-[#DCEEE8] transition
      ring-1 ring-[#4F8F7A]/35
    "
  >
    Lisää ilmoitus (ilmainen)
  </button>
  
</div>

</div>



  </div>
</div>




</div>

<div className="mt-4 text-xs sm:text-sm text-charcoal/60 text-center mx-auto max-w-md sm:max-w-2xl px-4">
  💚 Paikallisille tekijöille reilu näkyvyys – ei algoritmimörköä, vaan löydettävyys paikallisesti.
</div>

        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 py-6 sm:py-8">
  <div className="max-w-screen-xl mx-auto">

{/*  Nyt suosittua */}
{nytSuosittua.length > 0 && (

  <div className="w-full mt-2 sm:mt-5">
    <div className="flex items-center justify-between px-1">
      <div className="text-left">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#1E3A41]">
  Suosittua juuri nyt
</h2>

<p className="text-xs sm:text-sm text-charcoal/60 mt-1">
  Kurkatuimmat palvelut ja kiinnostavat löydöt Mainoskylässä.
</p>
        
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
className="w-full flex flex-nowrap gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
  style={{ WebkitOverflowScrolling: 'touch' }}
>

        {nytSuosittua.map((ilmo) => (
          <Link
  key={ilmo.id}
  href={`/ilmoitukset/${ilmo.id}`}
  className="
    group
    snap-start
    flex-none
    w-[220px] sm:w-[260px] lg:w-[300px]
    bg-white ring-1 ring-black/5
    rounded-[22px] overflow-hidden
    shadow-sm hover:shadow-lg
    hover:-translate-y-1
    transition-all duration-300
    text-left
  "
>
            <div className="relative w-full aspect-[4/3] bg-[#F6F7F7] overflow-hidden">
              <Image
              src={ilmo.kuva_url || '/placeholder.jpg'}
              alt={ilmo.otsikko}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
             sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

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
          </Link>
        ))}
      </div>
    </div>
  </div>
)}




                {/* Pallokategoria nappulat */}
{/* Mobiili: kategoriat Tori-tyyliin (2 riviä + sivutus vasemmalle) */}
<div className="sm:hidden mt-6 px-1 py-2">
 <CategoryCarousel
  categories={visibleKategoriat.map((k) => ({
    name: k.nimi,
    href: k.href, // ✅ käytä suoraan oikeaa polkua
    icon: k.ikoni,
  }))}
/>

</div>


{/* Desktop: kaikki samalla rivillä */}
<div className="hidden sm:flex justify-center mt-8 px-2 py-2">
  <div className="flex gap-5 justify-center px-6">
    {visibleKategoriat.map((k) => (
      <div key={k.nimi} className="flex flex-col items-center shrink-0">
        <button
        onClick={() => router.push(k.href)}
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
</section>

    {/* Uusimmat ilmoitukset (kategorioiden jälkeen, ennen etusivun ilmoituksia) */}
{uusimmat.length > 0 && (
  <section className="bg-white px-4 sm:px-6 py-8">
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between px-1">
        <div className="text-left">
          <h2 className="text-base sm:text-lg font-semibold text-[#1E3A41]">
            Uusimmat ilmoitukset
          </h2>
          <p className="text-xs text-charcoal/60">
           Tuoreimmat tekijät ja palvelut – lisääntyvät koko ajan
          </p>

        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollUusimmat('left')}
            className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
            aria-label="Selaa vasemmalle"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollUusimmat('right')}
            className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
            aria-label="Selaa oikealle"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-3 -mx-4 px-4 pr-6">
        <div
          ref={uusimmatRef}
          className="w-full flex flex-nowrap gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {uusimmat.map((ilmo) => (
  <Link
    key={ilmo.id}
    href={`/ilmoitukset/${ilmo.id}`}
    className="
      group
      snap-start flex-none
      w-[220px] sm:w-[260px] lg:w-[300px]
      bg-white ring-1 ring-black/5 rounded-[22px] overflow-hidden
      shadow-sm hover:shadow-lg hover:-translate-y-1
      transition-all duration-300 text-left
    "
  >
              <div className="relative w-full aspect-[4/3] bg-[#F6F7F7] overflow-hidden">
                <Image
  src={ilmo.kuva_url || '/placeholder.jpg'}
  alt={ilmo.otsikko}
  fill
  className="object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-[1.03]"
  sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
/>
<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />


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
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
)}


<section className="bg-gradient-to-b from-[#F4F8F6] to-[#FAFCFB] px-4 sm:px-6 py-10">
  <div className="max-w-screen-xl mx-auto">
<h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#1E3A41] mb-2">
  Etusivulla näkyvät ilmoitukset
</h2>

<p className="text-xs text-charcoal/60 mb-3">
  Ilmoituksia, jotka ovat tällä hetkellä etusivulla näkyvyysajalla.
</p>


    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">

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
    className={`
  group bg-white ring-1 ring-black/5
  rounded-[22px] overflow-hidden
  shadow-sm
  transition-all duration-300 ease-out
  ${ilmo.id.startsWith('tyhja-') ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
`}
  >

          {ilmo.kuva_url ? (
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F6F7F7]">
              {!ilmo.id.startsWith('tyhja-') && (
  <span className="absolute top-2 left-2 z-10 text-[10px] bg-[#EDF5F2] text-[#1E3A41] px-2 py-1 rounded-full">
    Etusivu
  </span>
)}
              <Image
  src={ilmo.kuva_url || '/placeholder.jpg'}
  alt={ilmo.otsikko}
  fill
  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
/>
<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

            </div>
          ) : (
  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#EEF6F2] via-[#F7FBF8] to-[#FFF6F2]">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#4F6763]/70">
        Etusivupaikka vapaana
      </div>
      <div className="mt-2 text-sm sm:text-base font-semibold text-[#1E3A41]">
        Varaa näkyvä paikka tähän
      </div>
      <div className="mt-2 text-xs text-charcoal/60 max-w-[220px]">
        Näy etusivulla ja tuo palvelusi esiin heti kävijöille.
      </div>
    </div>
  </div>
)}
          <div className="px-3 pb-3 pt-1.5">
  <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-[#1E3A41] line-clamp-2 min-h-[40px]">
    {ilmo.otsikko}
  </h3>

  {ilmo.sijainti && (
    <div className="mt-1 text-xs font-medium text-charcoal/65 truncate">
      {ilmo.sijainti}
    </div>
  )}

  {ilmo.kuvaus && (
    <p className="mt-1.5 text-[13px] leading-5 text-charcoal/75 line-clamp-2 min-h-[38px]">
      {ilmo.kuvaus}
    </p>
  )}

  {ilmo.id.startsWith('tyhja-') ? (
    <button
      onClick={(e) => {
        e.stopPropagation()
        router.push('/lisaa')
      }}
      className="
        mt-3 w-full px-3 py-2.5 text-xs font-semibold
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
  ) : (
    <div className="mt-2.5">
      <Katselukerrat count={ilmo.nayttoja || 0} small />
    </div>
  )}
</div>
        </div>
      ))}
    </div>
  </div>
</section>


<section className="px-4 sm:px-6 py-12">
  <div className="max-w-screen-lg mx-auto rounded-[28px] bg-gradient-to-br from-[#F5FAF7] to-[#FFF5F2] px-6 py-10 sm:px-10 sm:py-12 text-center ring-1 ring-black/5">
    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E3A41]">
      Haluatko näkyvyyttä omalle palvelullesi?
    </h3>

    <p className="mt-3 text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto">
      Lisää ilmoitus Mainoskylään ja tee palvelustasi helpompi löytää paikallisesti. Aloittaminen on täysin ilmaista.
    </p>

    <div className="mt-6 flex items-center justify-center">
      <button
        onClick={() => router.push('/lisaa')}
        className="bg-[#F29C8F] text-white px-7 py-3.5 rounded-full hover:bg-[#e78e81] transition shadow-sm hover:shadow-md font-semibold"
      >
        Lisää ilmoitus ilmaiseksi
      </button>
    </div>
  </div>
</section>

<section className="px-6 py-4 beige border-t border-persikka text-sm text-charcoal text-center">


  ⚠️ Muistutus: Älä koskaan anna pankkitunnuksia tai siirrä rahaa ilmoittajalle. Ilmoituksiin liittyvät maksupyynnöt voivat olla huijausyrityksiä.
</section>


      <footer className="bg-beige text-sm text-[#1E3A41] text-center py-8 mt-12">

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
    </main>
  )
}
