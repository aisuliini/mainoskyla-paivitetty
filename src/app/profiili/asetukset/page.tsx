'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function AsetuksetSivu() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session?.user) {
        router.push('/kirjaudu')
        return
      }
      setLoading(false)
    }
    check()
  }, [router])

  const poistaTili = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user

    if (!user) {
      alert('Et ole kirjautunut sisään.')
      return
    }

    if (
      !confirm('Haluatko varmasti poistaa tilisi ja kaikki ilmoituksesi? Tätä ei voi perua.')
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

  if (loading) {
    return (
      <main className="max-w-screen-md mx-auto p-6">
        <p>Ladataan...</p>
      </main>
    )
  }

  return (
    <main className="max-w-screen-md mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Asetukset</h1>
        <Link href="/profiili" className="text-sm text-gray-600 hover:underline">
          ← Takaisin profiiliin
        </Link>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Tilin hallinta</h2>
        <p className="text-sm text-gray-600 mb-4">
          Voit poistaa käyttäjätilisi ja kaikki ilmoituksesi. Toimintoa ei voi perua.
        </p>

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
