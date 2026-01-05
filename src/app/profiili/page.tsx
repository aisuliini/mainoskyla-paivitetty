'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Eye } from 'lucide-react'
import Image from 'next/image'


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
  const [busyId, setBusyId] = useState<string | null>(null)


  useEffect(() => {
    const haeKayttajaJaIlmoitukset = async () => {
      const { data: authData } = await supabase.auth.getSession()
      const currentUser = authData?.session?.user
      if (!currentUser) return router.push('/kirjaudu')

      // setUser(currentUser) // Removed: no setUser defined or needed

      const { error, data } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('luotu', { ascending: false })

      if (!error && data) setIlmoitukset(data)
    }

    haeKayttajaJaIlmoitukset()
  }, [router])

  const julkaiseUudelleen = async (ilmo: Ilmoitus) => {
  if (busyId) return
  if (!confirm('Julkaistaanko ilmoitus uudelleen?')) return

  setBusyId(ilmo.id)
  try {
    const uusiPaiva = new Date().toISOString()

    const { error } = await supabase
      .from('ilmoitukset')
      .update({ luotu: uusiPaiva })
      .eq('id', ilmo.id)

    if (error) {
      console.error(error)
      alert('Päivitys epäonnistui. Yritä uudelleen.')
      return
    }

    setIlmoitukset((prev) =>
      prev.map((i) => (i.id === ilmo.id ? { ...i, luotu: uusiPaiva } : i))
    )
  } finally {
    setBusyId(null)
  }
}


  const poistaTili = async () => {
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) {
    alert('Et ole kirjautunut sisään.')
    return
  }

  if (!confirm('Haluatko varmasti poistaa tilisi ja kaikki ilmoituksesi? Tätä ei voi perua.')) {
    return
  }

  // Poista käyttäjän ilmoitukset
  const { error: delError } = await supabase
    .from('ilmoitukset')
    .delete()
    .eq('user_id', user.id)

  if (delError) {
    console.error('Virhe poistossa:', delError.message)
    alert('Virhe poistossa. Yritä uudelleen.')
    return
  }

  // Kirjaa käyttäjä ulos
  await supabase.auth.signOut()

  alert('Tili ja ilmoitukset poistettu. Jos haluat kokonaan poistaa kirjautumistilisi, ota yhteyttä ylläpitoon.')
  router.push('/')
}

  const poistaIlmoitus = async (ilmo: Ilmoitus) => {
  if (busyId) return
  if (!confirm('Poistetaanko ilmoitus pysyvästi?')) return

  setBusyId(ilmo.id)
  try {
    const { error } = await supabase
      .from('ilmoitukset')
      .delete()
      .eq('id', ilmo.id)

    if (error) {
      console.error(error)
      alert('Poisto epäonnistui. Yritä uudelleen.')
      return
    }

    setIlmoitukset((prev) => prev.filter((i) => i.id !== ilmo.id))
  } finally {
    setBusyId(null)
  }
}


  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Omat ilmoitukset</h1>

      {ilmoitukset.length === 0 ? (
  <p>Sinulla ei ole vielä ilmoituksia.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {ilmoitukset.map((ilmo) => (
      <div
        key={ilmo.id}
        className="bg-white border rounded-lg shadow-sm overflow-hidden text-left w-full"
      >
        {/* 🔹 Klikattava alue: avaa ilmoituksen */}
        <button
          type="button"
          onClick={() => router.push(`/ilmoitukset/${ilmo.id}`)}
          className="w-full text-left touch-manipulation"
        >
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
                  {new Date(ilmo.voimassa_alku).toLocaleDateString('fi-FI')}
                </strong>{' '}
                –{' '}
                <strong>
                  {new Date(ilmo.voimassa_loppu).toLocaleDateString('fi-FI')}
                </strong>
              </p>
            )}

            <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
              <Eye size={14} />
              {ilmo.nayttoja || 0} katselukertaa
            </div>
          </div>
        </button>

        {/* 🔹 Napit EI avaa ilmoitusta */}
        <div className="px-4 pb-4 -mt-2 space-y-2">
          <button
            type="button"
            onClick={(e) => {
  e.stopPropagation()
  julkaiseUudelleen(ilmo)
}}
disabled={busyId === ilmo.id}

            className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Julkaise uudelleen
          </button>

          <button
            type="button"
onClick={(e) => {
  e.stopPropagation()
  poistaIlmoitus(ilmo)
}}
disabled={busyId === ilmo.id}
            className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Poista
          </button>

          <button
            type="button"
onClick={(e) => {
  e.stopPropagation()
  if (busyId) return
  router.push(`/muokkaa/${ilmo.id}`)
}}
disabled={busyId === ilmo.id}
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
