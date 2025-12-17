'use client'


import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Search } from "lucide-react"






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
<header className="bg-white/80 backdrop-blur border-b px-6 h-[72px] flex items-center justify-between sticky top-0 z-50">
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
    hae()
  }
}}

className="w-[320px] lg:w-[380px] px-4 py-2 pr-10 text-sm border rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A41]/20"
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



      {/* Valikko / profiili / kirjautuminen */}
<div className="hidden md:flex items-center gap-2 text-sm">
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
className="bg-[#F99584] text-[#1E3A41] px-5 py-2 rounded-full font-semibold hover:bg-[#E86E5B] transition-colors shadow-sm"
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
