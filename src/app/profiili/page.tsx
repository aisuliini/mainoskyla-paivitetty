'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { List, PlusCircle, Settings, LogOut } from 'lucide-react'

type ProfiiliRow = {
  nimi: string | null
}

export default function ProfiiliSivu() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [email, setEmail] = useState<string | null>(null)
  const [nimi, setNimi] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data: authData } = await supabase.auth.getSession()
      const user = authData?.session?.user

      if (!user) {
        router.replace('/kirjaudu')
        router.refresh()
        return
      }

      if (!mounted) return
      setEmail(user.email ?? null)

      // Profiilin nimi (jos profiilit-taulu on olemassa)
      const { data: profiiliData } = await supabase
      .from('profiilit')
      .select('nimi')
      .eq('id', user.id)
      .maybeSingle()
      .returns<ProfiiliRow>()


      if (!mounted) return
      setNimi(profiiliData?.nimi ?? null)

      setLoading(false)
    }

    init()

    return () => {
      mounted = false
    }
  }, [router])

  const kirjauduUlos = async () => {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  const otsikkoNimi = nimi ?? email ?? ''

  return (
    <main className="max-w-screen-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>

      {loading ? (
        <p>Ladataan...</p>
      ) : (
        <>
          {/* Profiilikortti */}
          <div className="bg-white border rounded-xl p-5 shadow-sm mb-6">
            {otsikkoNimi ? (
              <p className="text-lg font-semibold">{otsikkoNimi}</p>
            ) : (
              <p className="text-lg font-semibold">Profiili</p>
            )}

            {/* Näytä sähköposti vain jos nimi löytyy erikseen */}
            {nimi && email && <p className="text-sm text-gray-600">{email}</p>}
          </div>

          {/* Valikko */}
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <Link
              href="/profiili/omat-ilmoitukset"
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <List />
                <div>
                  <p className="font-medium">Omat ilmoitukset</p>
                  <p className="text-sm text-gray-600">Muokkaa, uusi ja poista ilmoituksia</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </Link>

            <Link
              href="/lisaa"
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-t"
            >
              <div className="flex items-center gap-3">
                <PlusCircle />
                <div>
                  <p className="font-medium">Lisää ilmoitus</p>
                  <p className="text-sm text-gray-600">Luo uusi ilmoitus Mainoskylään</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </Link>

            <Link
              href="/profiili/asetukset"
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-t"
            >
              <div className="flex items-center gap-3">
                <Settings />
                <div>
                  <p className="font-medium">Asetukset</p>
                  <p className="text-sm text-gray-600">Tilin hallinta ja asetukset</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </Link>

            <button
              type="button"
              onClick={kirjauduUlos}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-t text-left"
            >
              <div className="flex items-center gap-3">
                <LogOut />
                <div>
                  <p className="font-medium">Kirjaudu ulos</p>
                  <p className="text-sm text-gray-600">Poistu tililtäsi</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </>
      )}
    </main>
  )
}
