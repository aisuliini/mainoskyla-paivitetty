'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Eye } from 'lucide-react'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti?: string | null
  kuva_url?: string | null
  nayttoja?: number | null
  luotu?: string | null
  nostettu_at?: string | null
  user_id?: string | null
  voimassa_alku?: string | null
  voimassa_loppu?: string | null
}

export default function ProfiiliSivu() {
  const router = useRouter()
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [loading, setLoading] = useState(true)

  // 🔹 Hae kirjautunut käyttäjä + hänen ilmoitukset
  useEffect(() => {
    const haeKayttajaJaIlmoitukset = async () => {
      const { data: authData } = await supabase.auth.getSession()
      const currentUser = authData?.session?.user

      if (!currentUser) {
        router.push('/kirjaudu')
        return
      }

      const { error, data } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('luotu', { ascending: false })

      if (error) {
        console.error('Virhe ilmoitusten haussa:', error.message)
      } else if (data) {
        setIlmoitukset(data as Ilmoitus[])
      }

      setLoading(false)
    }

    haeKayttajaJaIlmoitukset()
  }, [router])

  // 🔹 Estä mobiilin back/forward-välimuisti (bfcache), jotta sivu oikeasti ladataan uudelleen
  useEffect(() => {
    const handleUnload = () => {
      // ei tarvitse tehdä mitään – pelkkä kuuntelija riittää
    }

    window.addEventListener('unload', handleUnload)
    return () => window.removeEventListener('unload', handleUnload)
  }, [])

  // 🔹 Julkaise uudelleen (päivitä luotu)
  const julkaiseUudelleen = async (ilmo: Ilmoitus) => {
    if (!confirm('Julkaistaanko ilmoitus uudelleen?')) return

    const uusiPaiva = new Date().toISOString()

    const { error } = await supabase
      .from('ilmoitukset')
      .update({ luotu: uusiPaiva })
      .eq('id', ilmo.id)

    if (error) {
      console.error('Virhe julkaisussa:', error.message)
      alert('Päivitys epäonnistui. Yritä uudelleen.')
      return
    }

    setIlmoitukset((prev) =>
      prev.map((i) => (i.id === ilmo.id ? { ...i, luotu: uusiPaiva } : i))
    )
  }

  // 🔹 Poista yksittäinen ilmoitus
  const poistaIlmoitus = async (ilmo: Ilmoitus) => {
    if (!confirm('Poistetaanko ilmoitus pysyvästi?')) return

    const { error } = await supabase
      .from('ilmoitukset')
      .delete()
      .eq('id', ilmo.id)

    if (error) {
      console.error('Virhe poistossa:', error.message)
      alert('Poisto epäonnistui. Yritä uudelleen.')
      return
    }

    setIlmoitukset((prev) => prev.filter((i) => i.id !== ilmo.id))
  }

  // 🔹 Poista tili + kaikki ilmoitukset
  const poistaTili = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user

    if (!user) {
      alert('Et ole kirjautunut sisään.')
      return
    }

    if (
      !confirm(
        'Haluatko varmasti poistaa tilisi ja kaikki ilmoituksesi? Tätä ei voi perua.'
      )
    ) {
      return
    }

    const { error: delError } = await supabase
      .from('ilmoitukset')
      .delete()
      .eq('user_id', user.id)

    if (delError) {
      console.error('Virhe poistossa:', delError.message)
      alert('Virhe poistossa. Yritä uudelleen.')
      return
    }

    await supabase.auth.signOut()

    alert(
      'Tili ja ilmoitukset poistettu. Jos haluat kokonaan poistaa kirjautumistilisi, ota yhteyttä ylläpitoon.'
    )
    router.push('/')
  }

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Omat ilmoitukset</h1>

      {loading ? (
        <p>Ladataan ilmoituksia...</p>
      ) : ilmoitukset.length === 0 ? (
        <p>Sinulla ei ole vielä ilmoituksia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ilmoitukset.map((ilmo) => (
            <div
              key={ilmo.id}
              className="bg-white border rounded-lg shadow-sm overflow-hidden text-left w-full flex flex-col"
            >
              {/* Yläosa: klikattava kortti, avaa ilmoituksen */}
              <Link href={`/ilmoitukset/${ilmo.id}`} className="block w-full">
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                  {ilmo.kuva_url ? (
                    <Image
                      src={ilmo.kuva_url}
                      alt={ilmo.otsikko}
                      width={400}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Ei kuvaa</span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">
                    {ilmo.otsikko}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ilmo.kuvaus}
                  </p>

                  <p className="text-xs text-gray-500">
                    {ilmo.sijainti ?? ''}
                  </p>

                  {ilmo.voimassa_alku && ilmo.voimassa_loppu && (
                    <p className="text-xs text-gray-500 mt-1">
                      Voimassa:{' '}
                      <strong>
                        {new Date(
                          ilmo.voimassa_alku
                        ).toLocaleDateString('fi-FI')}
                      </strong>{' '}
                      –{' '}
                      <strong>
                        {new Date(
                          ilmo.voimassa_loppu
                        ).toLocaleDateString('fi-FI')}
                      </strong>
                    </p>
                  )}

                  <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
                    <Eye size={14} />
                    {ilmo.nayttoja || 0} katselukertaa
                  </div>
                </div>
              </Link>

              {/* Alaosa: napit */}
              <div className="px-4 pb-4 pt-2 space-y-2 mt-auto">
                <button
                  type="button"
                  onClick={() => julkaiseUudelleen(ilmo)}
                  className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Julkaise uudelleen
                </button>

                <button
                  type="button"
                  onClick={() => poistaIlmoitus(ilmo)}
                  className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Poista
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/muokkaa/${ilmo.id}`)}
                  className="w-full px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Muokkaa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={poistaTili}
          className="bg-red-700 text-white px-6 py-3 rounded hover:bg-red-800"
        >
          Poista käyttäjätili ja kaikki ilmoitukset
        </button>
      </div>
    </main>
  )
}
