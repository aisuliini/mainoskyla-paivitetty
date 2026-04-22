'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DeleteAccountButton() {
  const router = useRouter()

  const poistaTili = async () => {
    if (
      !confirm('Haluatko varmasti poistaa tilisi ja kaikki ilmoituksesi? Tätä ei voi perua.')
    ) {
      return
    }

    const res = await fetch('/api/profiili/poista-tili', {
      method: 'DELETE',
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const message = data?.error || 'Virhe poistossa. Yritä uudelleen.'
      console.error('Virhe poistossa:', message)
      alert(message)
      return
    }

    await supabase.auth.signOut()

    alert(
      'Tili ja ilmoitukset poistettu. Jos haluat kokonaan poistaa kirjautumistilisi, ota yhteyttä ylläpitoon.'
    )
    router.push('/')
  }

  return (
    <button
      type="button"
      onClick={poistaTili}
      className="bg-red-700 text-white px-6 py-3 rounded hover:bg-red-800"
    >
      Poista käyttäjätili ja kaikki ilmoitukset
    </button>
  )
}
