'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function UnohtuikoSalasanaSivu() {
  const [sahkoposti, setSahkoposti] = useState('')
  const [viesti, setViesti] = useState('')

  const lahetaPalautuslinkki = async (e: React.FormEvent) => {
    e.preventDefault()
    setViesti('')

    const { error } = await supabase.auth.resetPasswordForEmail(sahkoposti, {
      redirectTo: `${location.origin}/salasana-uusi`,
    })

    if (error) {
      setViesti('⚠️ Linkin lähetys epäonnistui: ' + error.message)
    } else {
      setViesti('✅ Palautuslinkki lähetetty sähköpostiin.')
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Unohtuiko salasana?</h1>
      <form onSubmit={lahetaPalautuslinkki} className="space-y-4">
        <input
          type="email"
          placeholder="Sähköpostiosoitteesi"
          value={sahkoposti}
          onChange={(e) => setSahkoposti(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lähetä palautuslinkki
        </button>
      </form>
      {viesti && <p className="mt-4">{viesti}</p>}
    </main>
  )
}
