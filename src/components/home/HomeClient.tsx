'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import CategoryCarousel from '@/components/CategoryCarousel'
import { CATEGORY_CONFIG } from '@/lib/categories/category-config'
import PopularNowSection from '@/components/home/PopularNowSection'
import LatestListingsSection from '@/components/home/LatestListingsSection'
import PremiumListingsSection from '@/components/home/PremiumListingsSection'
import type { HomeProps, PremiumIlmoitus, SuosittuIlmoitus } from '@/components/home/home-types'
import { homeCategoryIcons } from '@/components/home/home-category-icons'
import HomeSearch from '@/components/home/HomeSearch'


export default function HomeClient({
  initialPremiumIlmoitukset,
  initialNytSuosittua,
  initialUusimmat,
}: HomeProps) {
  const router = useRouter()
  const [premiumIlmoitukset] = useState<PremiumIlmoitus[]>(initialPremiumIlmoitukset)




 const [nytSuosittua] = useState<SuosittuIlmoitus[]>(initialNytSuosittua)
const nytSuosittuaRef = useRef<HTMLDivElement | null>(null)
const [uusimmat] = useState<SuosittuIlmoitus[]>(initialUusimmat)
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




const visibleKategoriat = CATEGORY_CONFIG.map((category) => ({
  nimi: category.name,
  href: `/kategoriat/${category.slug}`,
  ikoni: homeCategoryIcons[category.slug] ?? homeCategoryIcons['arjen-palvelut'],
}))


    return (
    <main className="min-h-screen font-sans text-charcoal bg-white">



  
<section className="relative overflow-hidden px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-14">
  <div className="absolute inset-0 overflow-hidden">
  <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(135deg, #F8FBF9 0%, #EEF6F2 45%, #FFF6F2 100%)',
    }}
  />

  <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full blur-3xl bg-[#DCEEE8]/70" />
  <div className="absolute top-10 right-0 h-64 w-64 rounded-full blur-3xl bg-[#FCE3DB]/55" />
  <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full blur-3xl bg-white/60" />
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


<HomeSearch />

</div>

<div className="mt-4 text-xs sm:text-sm text-charcoal/60 text-center mx-auto max-w-md sm:max-w-2xl px-4">
  💚 Paikallisille tekijöille reilu näkyvyys – ei algoritmimörköä, vaan löydettävyys paikallisesti.
</div>

        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 py-6 sm:py-8">
  <div className="max-w-screen-xl mx-auto">

<PopularNowSection
  items={nytSuosittua}
  sectionRef={nytSuosittuaRef}
  onScroll={scrollNytSuosittua}
/>



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
<div className="hidden sm:block mt-8 px-2 py-2">
  <div className="flex flex-wrap gap-5 justify-center px-6 max-w-5xl mx-auto">
    {visibleKategoriat.map((k) => (
  <div key={k.href} className="flex flex-col items-center shrink-0">
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
<LatestListingsSection
  items={uusimmat}
  sectionRef={uusimmatRef}
  onScroll={scrollUusimmat}
/>


<PremiumListingsSection
  items={premiumIlmoitukset}
  onOpenListing={(id) => router.push(`/ilmoitukset/${id}`)}
  onAddListing={() => router.push('/lisaa')}
/>


<section className="bg-white px-4 sm:px-6 py-14 sm:py-16">
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

<section className="bg-[#F8FBF9] px-4 sm:px-6 py-10 border-t border-black/5">
  <div className="max-w-screen-md mx-auto rounded-3xl bg-white px-6 py-7 text-center shadow-sm ring-1 ring-black/5">
    <h3 className="text-lg sm:text-xl font-semibold text-[#1E3A41]">
  Rakennamme Mainoskylästä yhä parempaa paikallista palvelua 💚
</h3>
<p className="mt-3 text-sm sm:text-base text-charcoal/70">
  Kehitämme palvelua jatkuvasti käyttäjien palautteen pohjalta. Jos haluat ehdottaa parannusta tai antaa palautetta, kuulemme mielellämme.
</p>
    <div className="mt-5">
      <Link
        href="/yhteystiedot"
        className="inline-flex items-center justify-center rounded-full bg-[#EDF5F2] px-5 py-2.5 text-sm font-semibold text-[#1E3A41] ring-1 ring-[#4F8F7A]/25 hover:bg-[#DCEEE8] transition"
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
      className="font-medium text-[#1E3A41] underline underline-offset-2 hover:opacity-70 transition"
    >
      Lue turvallisuusohjeet
    </Link>
  </div>
</section>


      <footer className="bg-[#EAF1EE] text-[#1E3A41] mt-0 border-t border-black/5">
  <div className="max-w-screen-xl mx-auto px-6 py-10 sm:py-12">
    <div className="flex flex-col items-center text-center">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm sm:text-[15px] font-medium">
        <Link href="/tietoa" className="text-[#1E3A41] hover:opacity-70 transition">
          Tietoa meistä
        </Link>
        <Link href="/hinnasto" className="text-[#1E3A41] hover:opacity-70 transition">
          Hinnasto
        </Link>
        <Link href="/ehdot" className="text-[#1E3A41] hover:opacity-70 transition">
          Käyttöehdot
        </Link>
        <Link href="/tietosuoja" className="text-[#1E3A41] hover:opacity-70 transition">
          Tietosuoja
        </Link>
        <Link href="/turvallisuus" className="text-[#1E3A41] hover:opacity-70 transition">
          Turvallisuusohjeet
        </Link>
        <Link href="/yhteystiedot" className="text-[#1E3A41] hover:opacity-70 transition">
          Yhteystiedot
        </Link>
      </nav>

      <div className="mt-6 flex justify-center gap-5 text-[22px]">
        <a
          href="https://facebook.com/mainoskyla"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 ring-1 ring-black/5 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm transition"
        >
          <FaFacebookF />
        </a>

        <a
          href="https://instagram.com/mainoskyla"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 ring-1 ring-black/5 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm transition"
        >
          <FaInstagram />
        </a>
      </div>

      <div className="mt-6 space-y-2 text-center">
  <p className="text-xs sm:text-sm text-charcoal/60">
    Ilmoituksen lisääminen on ilmaista – tuo palvelusi näkyville paikallisesti.
  </p>
  <p className="text-sm text-[#1E3A41]/80">
    &copy; {new Date().getFullYear()} Mainoskylä
  </p>
</div>
    </div>
  </div>
</footer>
    </main>
  )
}
