'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

function HeaderFallback() {
  // Kevyt fallback ettei SSR/CSR rakenne heittele (auttaa myös hydrationiin)
  return (
    <header className="bg-white/80 backdrop-blur border-b px-4 sm:px-6 h-[72px] flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center h-full shrink-0">
        <Image
          src="/mainoskylalogo.png"
          alt="Mainoskylä"
          width={72}
          height={72}
          priority
          className="h-[48px] w-auto md:h-[56px]"
        />
      </Link>

      <div className="hidden md:block w-[320px] lg:w-[380px]" />

      <div className="md:hidden h-10 w-10 rounded-full bg-white ring-1 ring-black/10" />
    </header>
  )
}

function HeaderInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [hakusana, setHakusana] = useState('')

  const { user, loading } = useAuth()
  if (loading) return null

  const kirjauduUlos = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const closeMenus = () => {
    setHakusana('')
    setOpen(false)
    setMobileSearchOpen(false)
  }

  const hae = () => {
    const q = hakusana.trim()
    if (!q) return

    // Säilytä sijainti vain jos ollaan aluehaussa
    const sijainti =
      pathname === '/aluehaku' ? searchParams.get('sijainti')?.trim() : null

    const url = sijainti
      ? `/aluehaku?q=${encodeURIComponent(q)}&sijainti=${encodeURIComponent(sijainti)}`
      : `/aluehaku?q=${encodeURIComponent(q)}`

    router.push(url)
    closeMenus()
  }

  const inputClass =
  'w-full rounded-full border border-charcoal/15 bg-white px-4 py-2 pr-10 text-base ' +
  'text-[#1E3A41] placeholder:text-[#1E3A41]/50 shadow-sm ' +
  'appearance-none outline-none focus:outline-none focus:ring-0 focus:border-charcoal/30'

  return (
    <header className="bg-white/80 backdrop-blur border-b px-4 sm:px-6 h-[72px] flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center h-full shrink-0">
        <Image
          src="/mainoskylalogo.png"
          alt="Mainoskylä"
          width={72}
          height={72}
          priority
          className="h-[48px] w-auto md:h-[56px]"
        />
      </Link>

      {/* Desktop-haku */}
      <div className="hidden md:flex items-center relative ml-auto">
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Hae ilmoituksia"
          placeholder="Hae palvelua tai tekijää..."
          value={hakusana}
          onChange={(e) => setHakusana(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              hae()
            }
          }}
          className="w-[320px] lg:w-[380px] px-4 py-2 pr-10 text-base border rounded-full bg-white shadow-sm outline-none focus:outline-none focus:ring-0 focus:border-black/20"
        />
        <button
          type="button"
          onClick={hae}
          aria-label="Hae"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E3A41] hover:text-[#27494e] transition"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Desktop-nav */}
      <div className="hidden md:flex items-center gap-3 ml-4">
  <Link
    href="/lisaa"
    className="bg-[#4F6763] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#6A837F] transition"
  >
    Ilmoita
  </Link>

  {user ? (
    <Link href="/profiili" className="hover:underline">
      Profiili
    </Link>
  ) : (
    <Link
      href="/kirjaudu"
      className="bg-[#F99584] text-[#1E3A41] px-5 py-2 rounded-full font-semibold hover:bg-[#E86E5B] transition-colors shadow-sm"
    >
      Kirjaudu
    </Link>
  )}

  <button
    type="button"
    onClick={() => {
    setMobileSearchOpen(false)
    setOpen((s) => !s)
   }}

    aria-label="Valikko"
    className="h-11 w-11 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center active:bg-black/5"
  >
    <span className="text-2xl leading-none">☰</span>
  </button>
</div>


      {/* Mobiili: search + kirjaudu + burger */}
<div className="md:hidden flex items-center gap-2">
  <button
    type="button"
    aria-label="Haku"
    onClick={() => {
    setOpen(false)
    setMobileSearchOpen((s) => !s)
   }}
    className="h-10 w-10 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center"
  >
    <Search size={18} />
  </button>

  <Link
  href={user ? '/profiili' : '/kirjaudu'}
  onClick={() => closeMenus()}
  className="h-10 px-4 rounded-full bg-[#F99584] text-[#1E3A41] font-semibold flex items-center justify-center"
>

    {user ? 'Profiili' : 'Kirjaudu'}
  </Link>

  <button
    type="button"
    onClick={() => {
      setMobileSearchOpen(false)
      setOpen((s) => !s)
    }}
    aria-label="Valikko"
    className="h-10 w-10 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center active:bg-black/5"
  >
    <span className="text-2xl leading-none">☰</span>
  </button>
</div>


      {/* Mobiilihaku dropdown */}
      {mobileSearchOpen && (
  <>
    <div
      className="fixed inset-0 z-40"
      onClick={() => setMobileSearchOpen(false)}
    />

    <div className="absolute left-0 right-0 top-[72px] px-4 pb-3 bg-white/95 backdrop-blur border-b z-50 md:hidden">
      <div className="relative max-w-screen-xl mx-auto">
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Hae palvelua tai tekijää..."
          value={hakusana}
          onChange={(e) => setHakusana(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              hae()
            }
          }}
          className={inputClass}
          autoFocus
        />
        <button
          type="button"
          onClick={hae}
          aria-label="Hae"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E3A41]"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  </>
)}


      {/* Mobiilivalikko */}
{open && (
    <div className="absolute top-[72px] right-3 left-3 md:left-auto md:right-6 md:w-[360px] bg-white border rounded-2xl shadow-lg p-2 text-base z-50">
    <div className="flex flex-col">

      <NavItem href="/lisaa" onClick={() => setOpen(false)}>
        ➕ Ilmoita
      </NavItem>

      <div className="my-2 border-t" />

      <p className="px-3 pt-2 pb-1 text-xs text-gray-500 uppercase">
        Tietoa
      </p>
      <NavItem href="/tietoa" onClick={() => setOpen(false)}>
        Tietoa
      </NavItem>
      <NavItem href="/yhteystiedot" onClick={() => setOpen(false)}>
        Yhteystiedot
      </NavItem>

      <p className="px-3 pt-3 pb-1 text-xs text-gray-500 uppercase">
        Turvallisuus & tietosuoja
      </p>
      <NavItem href="/turvallisuus" onClick={() => setOpen(false)}>
        Turvallisuusohjeet
      </NavItem>
      <NavItem href="/tietosuoja" onClick={() => setOpen(false)}>
        Tietosuoja
      </NavItem>

      <p className="px-3 pt-3 pb-1 text-xs text-gray-500 uppercase">
        Muut
      </p>
      <NavItem href="/ehdot" onClick={() => setOpen(false)}>
        Käyttöehdot
      </NavItem>
      <NavItem href="/hinnasto" onClick={() => setOpen(false)}>
        Hinnasto
      </NavItem>

      <div className="my-2 border-t" />

      {user ? (
        <>
          <NavItem href="/profiili" onClick={() => setOpen(false)}>
            Profiili
          </NavItem>
          <button
            onClick={kirjauduUlos}
            className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
          >
            Kirjaudu ulos
          </button>
        </>
      ) : null}


    </div>
  </div>
)}

    </header>
  )
}

function NavItem({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl hover:bg-black/5"
    >
      {children}
    </Link>
  )
}


export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderInner />
    </Suspense>
  )
}
