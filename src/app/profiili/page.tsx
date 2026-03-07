'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { List, PlusCircle, Megaphone, Settings, LogOut } from 'lucide-react'

type ProfiiliRow = {
  nimi: string | null
}

export default function ProfiiliSivu() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const created = searchParams.get('created') // "1" jos ilmoitus lisätty
  const city = searchParams.get('city') || ''

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
          {created === '1' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm mb-6">
              <p className="text-lg font-semibold text-green-900">✅ Ilmoitus lisätty!</p>

              <p className="text-sm text-green-900/80 mt-1">
                Haluatko lisää näkyvyyttä{city ? ` kaupungissa ${city}` : ''} kaupunkibannerilla?
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/lisaa-banneri${city ? `?city=${encodeURIComponent(city)}` : ''}`}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-[#4F6763] hover:opacity-95"
                >
                  Varaa kaupunkibanneri
                </Link>

                <Link
                  href="/profiili"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#4F6763] bg-white border border-[#4F6763]/40 hover:bg-[#4F6763]/5"
                >
                  Ei nyt
                </Link>
              </div>
            </div>
          )}

          {/* Profiilikortti */}
          <div className="bg-white border rounded-xl p-5 shadow-sm mb-6">
            {otsikkoNimi ? (
              <p className="text-lg font-semibold">{otsikkoNimi}</p>
            ) : (
              <p className="text-lg font-semibold">Profiili</p>
            )}

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
  href="/profiili/bannerit"
  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-t"
>
  <div className="flex items-center gap-3">
    <Megaphone />
    <div>
      <p className="font-medium">Bannerimainonta</p>
      <p className="text-sm text-gray-600">Hallitse kaupunkibannereita</p>
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