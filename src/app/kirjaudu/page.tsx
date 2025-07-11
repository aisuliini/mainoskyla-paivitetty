'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function KirjauduSivu() {
  const [sahkoposti, setSahkoposti] = useState("")
  const [salasana, setSalasana] = useState("")
  const [viesti, setViesti] = useState("")
  const router = useRouter()

  useEffect(() => {
  const tarkista = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      router.push('/profiili')
    }
  }
  tarkista()
}, [])

  const kirjauduSalasanalla = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email: sahkoposti,
      password: salasana,
    })

    if (error) {
      setViesti("⚠️ Kirjautuminen epäonnistui: " + error.message)
    } else {
      router.push("/profiili") // vaihda tarvittaessa
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu sähköpostilla ja salasanalla</h1>
      <form onSubmit={kirjauduSalasanalla} className="space-y-4">
        <input
          type="email"
          placeholder="Sähköpostiosoitteesi"
          value={sahkoposti}
          onChange={(e) => setSahkoposti(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Salasana"
          value={salasana}
          onChange={(e) => setSalasana(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kirjaudu
        </button>
      </form>
      {viesti && <p className="mt-4">{viesti}</p>}

      <p className="text-sm mt-4">
  <a href="/unohditko-salasanan" className="text-blue-600 hover:underline">
    Unohtuiko salasana?
  </a>
</p>

<p className="text-sm mt-2">
  <a href="/rekisteroidy" className="text-blue-600 hover:underline">
    Eikö sinulla ole tiliä? Rekisteröidy tästä.
  </a>
</p>

    </main>
  )
}
