'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function KirjauduSivu() {
  const [sahkoposti, setSahkoposti] = useState("")
  const [viesti, setViesti] = useState("")

  const lahetaKirjautumislinkki = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email: sahkoposti,
      options: {
        emailRedirectTo: `${location.origin}/profiili`,
      },
    })

    if (error) {
      setViesti("⚠️ Kirjautumislinkin lähetys epäonnistui.")
    } else {
      setViesti("✅ Kirjautumislinkki lähetetty sähköpostiin.")
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu sähköpostilla</h1>
      <form onSubmit={lahetaKirjautumislinkki} className="space-y-4">
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
          Lähetä kirjautumislinkki
        </button>
      </form>
      {viesti && <p className="mt-4">{viesti}</p>}
    </main>
  )
}
