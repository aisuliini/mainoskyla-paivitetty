'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Eye } from 'lucide-react'
import Link from 'next/link'

type SupaUser = {
  id: string
  [key: string]: any
}


export default function ProfiiliSivu() {
  const router = useRouter()
  const [ilmoitukset, setIlmoitukset] = useState<any[]>([])
  const [user, setUser] = useState<SupaUser | null>(null)


  useEffect(() => {
    const haeKayttajaJaIlmoitukset = async () => {
      const { data: authData } = await supabase.auth.getSession()
if (!authData?.session?.user) return router.push('/kirjaudu')
setUser(authData.session.user)


      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('user_id', authData.session.user.id)
        .order('luotu', { ascending: false })

      if (!error && data) setIlmoitukset(data)
    }
    haeKayttajaJaIlmoitukset()
  }, [router])

  const julkaiseUudelleen = async (ilmo: any) => {
    if (!confirm('Julkaistaanko ilmoitus uudelleen ja veloitetaan uusi maksu?')) return
    const uusiPaiva = new Date().toISOString()
    await supabase
      .from('ilmoitukset')
      .update({ luotu: uusiPaiva })
      .eq('id', ilmo.id)
    location.reload()
  }

  const nostaIlmoitus = async (ilmo: any) => {
    if (!confirm('Nostetaanko ilmoitus haun kärkeen ja veloitetaan nosto?')) return
    const nyt = new Date().toISOString()
    await supabase
      .from('ilmoitukset')
      .update({ nostettu_at: nyt })
      .eq('id', ilmo.id)
    location.reload()
  }

  const poistaIlmoitus = async (ilmo: any) => {
    if (!confirm('Poistetaanko ilmoitus pysyvästi?')) return
    await supabase.from('ilmoitukset').delete().eq('id', ilmo.id)
    setIlmoitukset((prev) => prev.filter((i) => i.id !== ilmo.id))
  }

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Omat ilmoitukset</h1>
      {ilmoitukset.length === 0 ? (
        <p>Sinulla ei ole vielä ilmoituksia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ilmoitukset.map((ilmo) => (
            <div key={ilmo.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
  {ilmo.kuva_url ? (
    <img
      src={ilmo.kuva_url}
      alt={ilmo.otsikko}
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="text-xs text-gray-400">Ei kuvaa</span>
  )}
</div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{ilmo.otsikko}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
                <p className="text-xs text-gray-500">{ilmo.sijainti}</p>

                <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
                  <Eye size={14} className="inline-block" />
                  {ilmo.nayttoja || 0} katselukertaa
                </div>

                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => julkaiseUudelleen(ilmo)}
                    className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Julkaise uudelleen
                  </button>

                  <button
                    onClick={() => nostaIlmoitus(ilmo)}
                    className="w-full px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Nosta hakutuloksissa
                  </button>

                  <button
                    onClick={() => poistaIlmoitus(ilmo)}
                    className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Poista
                  </button>

                  <Link
                    href={`/muokkaa/${ilmo.id}`}
                    className="block text-center w-full px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Muokkaa
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
