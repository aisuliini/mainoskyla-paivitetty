'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/features/categories/config/category-config'
import PopularNowSection from '@/features/home/components/PopularNowSection'
import LatestListingsSection from '@/features/home/components/LatestListingsSection'
import PremiumListingsSection from '@/features/home/components/PremiumListingsSection'
import type { HomeProps } from '@/features/home/types/home-types'
import { homeCategoryIcons } from '@/features/home/constants/home-category-icons'
import HomeSearch from '@/features/home/components/HomeSearch'
import HowItWorksSection from '@/features/home/components/HowItWorksSection'
import PopularSearchesSection from '@/features/home/components/PopularSearchesSection'

export default function HomeClient({
  initialPremiumIlmoitukset,
  initialNytSuosittua,
  initialUusimmat,
}: HomeProps) {
  const router = useRouter()
  const [premiumIlmoitukset, setPremiumIlmoitukset] = useState(initialPremiumIlmoitukset ?? [])




  const [nytSuosittua, setNytSuosittua] = useState(initialNytSuosittua ?? [])
  const nytSuosittuaRef = useRef<HTMLDivElement | null>(null)
  const [uusimmat, setUusimmat] = useState(initialUusimmat ?? [])
  const uusimmatRef = useRef<HTMLDivElement | null>(null)

function bumpViews<T extends { id: string; nayttoja?: number | null }>(items: T[], id: string): T[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, nayttoja: (item.nayttoja ?? 0) + 1 }
      : item
  )
}

function handleViewed(id: string) {
  setPremiumIlmoitukset((prev) => bumpViews(prev, id))
  setNytSuosittua((prev) => bumpViews(prev, id))
  setUusimmat((prev) => bumpViews(prev, id))
}


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




const visibleKategoriat = CATEGORY_CONFIG.map((category) => ({
  nimi: category.name,
  href: `/kategoriat/${category.slug}`,
  ikoni: homeCategoryIcons[category.slug] ?? homeCategoryIcons['arjen-palvelut'],
}))


    return (
    <main className="min-h-screen font-sans text-charcoal bg-white">



  
<section className="relative overflow-hidden px-4 sm:px-6 pt-5 sm:pt-10 pb-4 sm:pb-10">
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, rgba(220,238,232,0.95) 0%, rgba(237,245,242,0.75) 24%, rgba(248,251,249,0.45) 50%, rgba(255,255,255,0.96) 82%, #ffffff 100%)',
      }}
    />

    <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 h-[240px] w-[240px] rounded-full bg-[#BFD9D0]/55 blur-3xl sm:h-[320px] sm:w-[320px]" />
    <div className="absolute top-0 left-[-40px] h-[140px] w-[140px] rounded-full bg-[#DCEEE8]/60 blur-3xl sm:h-[180px] sm:w-[180px]" />
    <div className="absolute top-6 right-[-30px] h-[120px] w-[120px] rounded-full bg-[#EAF4F0]/65 blur-3xl sm:h-[160px] sm:w-[160px]" />
  </div>

  <div className="relative z-10 max-w-screen-xl mx-auto">
    <div className="flex flex-col items-center text-center">
      <div className="w-full max-w-3xl mx-auto">
        <h1
          className="
            text-[26px] sm:text-4xl md:text-5xl
            font-semibold
            text-[#1E3A41]
            tracking-tight
            leading-[1.06]
          "
        >
          Löydä paikalliset palvelut – tai lisää omasi ilmaiseksi
        </h1>

        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-charcoal/70 leading-relaxed max-w-2xl text-center mx-auto">
          Löydä läheltä tekijä tai tuo oma palvelusi näkyville Mainoskylässä.
        </p>
      </div>

      <div className="mt-4 sm:mt-6 w-full">
  <HomeSearch />
</div>
    </div>
  </div>
</section>

      <section className="bg-white px-4 sm:px-6 py-6 sm:py-8">
  <div className="max-w-screen-xl mx-auto">

<div className="relative z-0">
  <PopularNowSection
    items={nytSuosittua}
    sectionRef={nytSuosittuaRef}
    onScroll={scrollNytSuosittua}
    onViewed={handleViewed}
  />
</div>

<div className="h-1 sm:h-1.5" />

{/* Kategoriat: mobiilissa 2 saraketta, desktopissa yhdellä rivillä */}
<div className="relative mt-1 sm:mt-2 px-0 sm:px-2 pt-1 sm:pt-2 pb-2 sm:pb-3">
  {/* Mobiili: 2 vaakariviä, swipe-karuselli */}
<div className="sm:hidden overflow-x-auto no-scrollbar pl-4 pr-0">
  <div className="inline-grid grid-flow-col grid-rows-2 gap-x-4 gap-y-4 pr-14 min-w-max">
    {visibleKategoriat.map((k) => (
      <button
        key={k.href}
        type="button"
        onClick={() => router.push(k.href)}
        className="flex w-[78px] flex-col items-center text-center shrink-0"
      >
        <div
  className="
    flex items-center justify-center
    w-[54px] h-[54px] rounded-full
    bg-[#EDF5F2]
    hover:bg-[#DCEEE8]
    transition
    border border-[#4F8F7A]/20
    overflow-hidden
    [&_svg]:h-[22px] [&_svg]:w-[22px] [&_svg]:shrink-0
  "
>
  {k.ikoni}
</div>

        <span className="mt-2 text-[12px] leading-snug text-[#1E3A41] max-w-[78px]">
          {k.nimi}
        </span>
      </button>
    ))}
  </div>
</div>

  {/* Desktop */}
  <div className="hidden sm:flex sm:justify-center sm:gap-5 lg:gap-6 xl:gap-7 sm:flex-nowrap sm:px-4 pt-2">
    {visibleKategoriat.map((k) => (
      <button
        key={k.href}
        type="button"
        onClick={() => router.push(k.href)}
        className="flex flex-col items-center text-center shrink-0"
      >
        <div
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
        </div>

        <span className="mt-2 text-xs leading-tight text-[#1E3A41] max-w-[92px]">
          {k.nimi}
        </span>
      </button>
    ))}
  </div>
</div>
 </div>
</section>


<PremiumListingsSection
  items={premiumIlmoitukset}
  onOpenListing={(id) => router.push(`/ilmoitukset/${id}`)}
  onAddListing={() => router.push('/lisaa')}
  onViewed={handleViewed}
/>

<section className="bg-white px-4 sm:px-6 py-2 sm:py-4">
  <div className="max-w-screen-xl mx-auto">
    <LatestListingsSection
  items={uusimmat}
  sectionRef={uusimmatRef}
  onScroll={scrollUusimmat}
  onViewed={handleViewed}
/>
  </div>
</section>

<PopularSearchesSection />

<HowItWorksSection />


<section className="bg-white px-4 sm:px-6 py-10 sm:py-12">
  <div className="max-w-screen-lg mx-auto rounded-[28px] bg-gradient-to-br from-[#F5FAF7] via-[#FAFCFB] to-[#FFF5F2] px-6 py-10 sm:px-10 sm:py-12 text-center ring-1 ring-black/5 shadow-[0_10px_30px_rgba(30,58,65,0.04)]">
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

<section className="bg-[#F8FBF9] px-4 sm:px-6 py-12 border-t border-black/5">
  <div className="max-w-screen-md mx-auto text-center">
    <h3 className="text-xl sm:text-2xl font-semibold text-[#1E3A41] tracking-tight">
      Rakennamme Mainoskylästä yhä parempaa paikallista palvelua 💚
    </h3>

    <p className="mt-3 text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
      Kehitämme palvelua jatkuvasti käyttäjien palautteen pohjalta. Jos haluat ehdottaa parannusta tai antaa palautetta, kuulemme mielellämme.
    </p>

    <div className="mt-6">
      <Link
        href="/yhteystiedot"
        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1E3A41] ring-1 ring-[#4F8F7A]/20 hover:bg-[#EDF5F2] transition"
      >
        Anna palautetta
      </Link>
    </div>
  </div>
</section>

<section className="bg-white px-4 sm:px-6 py-5 border-t border-black/5">
  <div className="max-w-screen-md mx-auto text-center text-sm text-charcoal/70">
    Turvallinen asiointi on tärkeää.{" "}
    <Link
        href="/turvallisuus"
        className="font-medium text-[#9F3A32] underline underline-offset-2 hover:opacity-70 transition"
      >
        Lue turvallisuusohjeet
      </Link>
  </div>
</section>


      
    </main>
  )
}
