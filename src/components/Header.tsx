'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [hakusana, setHakusana] = useState('')

  const { user, loading } = useAuth()
  if (loading) return null

  const kirjauduUlos = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const hae = () => {
    const q = hakusana.trim()
    if (!q) return

    // ✅ 10/10 UX: jos ollaan aluehaussa ja käyttäjällä on jo valittu sijainti,
    // säilytetään se uuteen hakuun.
    const sijainti = searchParams.get('sijainti')?.trim()

    const url = sijainti
      ? `/aluehaku?q=${encodeURIComponent(q)}&sijainti=${encodeURIComponent(sijainti)}`
      : `/aluehaku?q=${encodeURIComponent(q)}`

    router.push(url)

    setHakusana('')
    setOpen(false)
    setMobileSearchOpen(false)
  }

  // Estää sen iOS “sinisen search-tyylin” paremmin kuin type="search"
  const inputClass =
    'w-full rounded-full border border-charcoal/15 bg-white px-4 py-2 pr-10 text-sm ' +
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
          className="w-[320px] lg:w-[380px] px-4 py-2 pr-10 text-sm border rounded-full bg-white shadow-sm outline-none focus:outline-none focus:ring-0 focus:border-black/20"
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
      <div className="hidden md:flex items-center gap-2 text-sm">
        <Link href="/lisaa" className="hover:underline">Ilmoita</Link>
        <Link href="/tietoa" className="hover:underline">Tietoa</Link>
        <Link href="/hinnasto" className="hover:underline">Hinnasto</Link>
        <Link href="/ehdot" className="hover:underline">Ehdot</Link>
        <Link href="/tietosuoja" className="hover:underline">Tietosuoja</Link>
        <Link href="/turvallisuus" className="hover:underline">Turvallisuusohjeet</Link>
        <Link href="/yhteystiedot" className="hover:underline">Yhteystiedot</Link>

        {user ? (
          <>
            <Link href="/profiili" className="hover:underline">Profiili</Link>
            <button
              onClick={kirjauduUlos}
              className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            >
              Kirjaudu ulos
            </button>
          </>
        ) : (
          <Link
            href="/kirjaudu"
            className="bg-[#F99584] text-[#1E3A41] px-5 py-2 rounded-full font-semibold hover:bg-[#E86E5B] transition-colors shadow-sm"
          >
            Kirjaudu
          </Link>
        )}
      </div>

      {/* Mobiili: search + burger */}
      <div className="md:hidden flex items-center gap-2">
        {/* 🔍 Mobiilihaku (aina saatavilla kaikilla sivuilla) */}
        <button
          type="button"
          aria-label="Haku"
          onClick={() => setMobileSearchOpen((s) => !s)}
          className="h-10 w-10 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center"
        >
          <Search size={18} />
        </button>

        {/* Burger */}
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl"
          aria-label="Valikko"
        >
          ☰
        </button>
      </div>

      {/* Mobiilihaku dropdown */}
      {mobileSearchOpen && (
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
      )}

      {/* Mobiilivalikko */}
      {open && (
        <div className="absolute top-[72px] right-4 bg-white border rounded shadow p-4 text-sm z-50 md:hidden">
          <Link href="/lisaa" className="block mb-2" onClick={() => setOpen(false)}>Ilmoita</Link>
          <Link href="/tietoa" className="block mb-2" onClick={() => setOpen(false)}>Tietoa</Link>
          <Link href="/hinnasto" className="block mb-2" onClick={() => setOpen(false)}>Hinnasto</Link>
          <Link href="/ehdot" className="block mb-2" onClick={() => setOpen(false)}>Ehdot</Link>
          <Link href="/tietosuoja" className="block mb-2" onClick={() => setOpen(false)}>Tietosuoja</Link>
          <Link href="/turvallisuus" className="block mb-2" onClick={() => setOpen(false)}>Turvallisuusohjeet</Link>
          <Link href="/yhteystiedot" className="block mb-2" onClick={() => setOpen(false)}>Yhteystiedot</Link>

          {user ? (
            <>
              <Link href="/profiili" className="block mb-2" onClick={() => setOpen(false)}>Profiili</Link>
              <button
                onClick={kirjauduUlos}
                className="bg-[#1E3A41] text-white px-4 py-1 rounded hover:bg-[#27494e] transition-colors"
              >
                Kirjaudu ulos
              </button>
            </>
          ) : (
            <>
              <Link
                href="/kirjaudu"
                onClick={() => setOpen(false)}
                className="block mb-2 bg-[#F99584] text-[#1E3A41] px-4 py-1 rounded hover:bg-[#E86E5B] transition-colors"
              >
                Kirjaudu
              </Link>
              <Link
                href="/rekisteroidy"
                onClick={() => setOpen(false)}
                className="block bg-gray-100 text-gray-800 px-4 py-1 rounded hover:bg-gray-200"
              >
                Rekisteröidy
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
