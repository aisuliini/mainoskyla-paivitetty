'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DeleteAccountButton() {
  const router = useRouter()

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