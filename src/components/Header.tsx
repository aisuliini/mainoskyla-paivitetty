'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'




export default function Header() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [hakusana, setHakusana] = useState('')

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
    <header className="bg-white border-b px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Mainoskylä" width={36} height={36} />
        <span className="text-lg font-semibold text-[#3f704d]">Mainoskylä</span>
      </Link>

      {/* Hakukenttä */}
      <div className="flex-1 px-4">
        <input
          type="text"
          placeholder="Hae..."
          value={hakusana}
          onChange={(e) => setHakusana(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && hae()}
          className="w-full px-3 py-1 text-sm border rounded-full"
        />
      </div>

      {/* Valikko / profiili / kirjautuminen */}
      <div className="hidden md:flex items-center space-x-4 text-sm">
        <Link href="/lisaa" className="hover:underline">Ilmoita</Link>
        <Link href="/tietoa" className="hover:underline">Tietoa</Link>
        <Link href="/hinnasto" className="hover:underline">Hinnasto</Link>
        <Link href="/ehdot" className="hover:underline">Ehdot</Link>
        <Link href="/tietosuoja" className="hover:underline">Tietosuoja</Link>
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
            className="bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800"
          >
            Kirjaudu
          </Link>
        )}
      </div>

      {/* Mobiilin valikko */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-2xl ml-4"
        aria-label="Valikko"
      >
        ☰
      </button>

      {open && (
        <div className="absolute top-14 right-4 bg-white border rounded shadow p-4 text-sm z-50 md:hidden">
          <Link href="/lisaa" className="block mb-2" onClick={() => setOpen(false)}>Ilmoita</Link>
          <Link href="/tietoa" className="block mb-2" onClick={() => setOpen(false)}>Tietoa</Link>
          <Link href="/hinnasto" className="block mb-2" onClick={() => setOpen(false)}>Hinnasto</Link>
          <Link href="/ehdot" className="block mb-2" onClick={() => setOpen(false)}>Ehdot</Link>
          <Link href="/tietosuoja" className="block mb-2" onClick={() => setOpen(false)}>Tietosuoja</Link>
          <Link href="/yhteystiedot" className="block mb-2" onClick={() => setOpen(false)}>Yhteystiedot</Link>
          {user ? (
            <>
              <Link href="/profiili" className="block mb-2" onClick={() => setOpen(false)}>Profiili</Link>
              <button
                onClick={() => { setOpen(false); kirjauduUlos() }}
                className="bg-gray-200 px-4 py-1 w-full text-left rounded hover:bg-gray-300"
              >
                Kirjaudu ulos
              </button>
            </>
          ) : (
            <>
  <Link
    href="/kirjaudu"
    onClick={() => setOpen(false)}
    className="block mb-2 bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800"
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
