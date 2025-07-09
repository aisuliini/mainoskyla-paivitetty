'use client'


import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'





export default function Header() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [hakusana, setHakusana] = useState('')

const { user, loading } = useAuth()
if (loading) {
  return null
}


  const kirjauduUlos = async () => {
  await supabase.auth.signOut()
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
        <Image src="/mainoskylalogo.png" alt="Mainoskylä" width={36} height={36} />
        <span className="text-lg font-semibold text-[#1E3A41]">Mainoskylä</span>

      </Link>

      {/* Hakukenttä */}
      <div className="hidden md:flex items-center relative ml-auto">

  <input
    type="text"
    aria-label="Hae ilmoituksia"
    placeholder="Hae..."
    value={hakusana}
    onChange={(e) => setHakusana(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (hakusana.trim()) {
          router.push(`/aluehaku?sijainti=${encodeURIComponent(hakusana.trim())}`)
          setHakusana('')
          setOpen(false)
        }
      }
    }}
    className="w-full px-3 py-1 text-sm border rounded-full focus:ring-2 focus:ring-[#F99584]/50"
  />
  <button
    type="button"
    onClick={() => {
      if (hakusana.trim()) {
        router.push(`/aluehaku?sijainti=${encodeURIComponent(hakusana.trim())}`)
        setHakusana('')
        setOpen(false)
      }
    }}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1E3A41] text-white px-4 py-1 rounded-full text-sm hover:bg-[#27494e] active:scale-95 transition"
  >
    Hae
  </button>
</div>



      {/* Valikko / profiili / kirjautuminen */}
      <div className="hidden md:flex items-center space-x-4 text-sm">
        <Link href="/ilmoitukset" className="hover:underline hover:text-[#F99584]">
        Ilmoitukset
        </Link>


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
  className="bg-[#F99584] text-[#1E3A41] px-6 py-3 rounded hover:bg-[#E86E5B] transition-colors"
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
