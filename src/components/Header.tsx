'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [hakusana, setHakusana] = useState('')
  const router = useRouter()

  useEffect(() => {
    const haeKayttaja = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
    }
    haeKayttaja()
  }, [])

  const kirjauduUlos = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  const hae = () => {
    if (hakusana.trim()) {
      router.push(`/aluehaku?sijainti=${encodeURIComponent(hakusana.trim())}`)
      setHakusana('')
      setOpen(false)
    }
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-2">
        <Link href="/" className="text-xl font-bold text-green-800">
          Mainoskylä
        </Link>

        <div className="flex-grow max-w-lg w-full">
          <input
            type="text"
            placeholder="Hae esimerkiksi paikkakunta tai sana..."
            value={hakusana}
            onChange={(e) => setHakusana(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && hae()}
            className="w-60 border px-3 py-1 rounded-full"
          />
        </div>

        <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-700">
          <Link href="/lisaa" className="hover:underline">Ilmoita</Link>
          <Link href="/tietoa" className="hover:underline">Tietoa meistä</Link>
          <Link href="/hinnasto" className="hover:underline">Hinnasto</Link>
          <Link href="/ehdot" className="hover:underline">Ehdot</Link>
          <Link href="/tietosuoja" className="hover:underline">Tietosuoja</Link>
          <Link href="/yhteystiedot" className="hover:underline">Yhteystiedot</Link>

          {user ? (
            <>
              <Link href="/profiili" className="hover:underline">Profiili</Link>
              <button
                onClick={kirjauduUlos}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Kirjaudu ulos
              </button>
            </>
          ) : (
            <Link
              href="/kirjaudu"
              className="ml-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Kirjaudu
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden"
          aria-label="Avaa valikko"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="sm:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2 text-sm text-gray-700">
            <Link href="/lisaa" onClick={() => setOpen(false)}>Ilmoita</Link>
            <Link href="/tietoa" onClick={() => setOpen(false)}>Tietoa meistä</Link>
            <Link href="/hinnasto" onClick={() => setOpen(false)}>Hinnasto</Link>
            <Link href="/ehdot" onClick={() => setOpen(false)}>Ehdot</Link>
            <Link href="/tietosuoja" onClick={() => setOpen(false)}>Tietosuoja</Link>
            <Link href="/yhteystiedot" onClick={() => setOpen(false)}>Yhteystiedot</Link>

            {user ? (
              <>
                <Link href="/profiili" onClick={() => setOpen(false)}>Profiili</Link>
                <button
                  onClick={() => { setOpen(false); kirjauduUlos() }}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Kirjaudu ulos
                </button>
              </>
            ) : (
              <Link
                href="/kirjaudu"
                onClick={() => setOpen(false)}
                className="mt-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Kirjaudu
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
