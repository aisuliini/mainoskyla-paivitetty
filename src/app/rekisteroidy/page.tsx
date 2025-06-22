'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RekisteroidySivu() {
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

  const rekisteroidy = async (e: React.FormEvent) => {
    e.preventDefault()
    setViesti('')

    const { error } = await supabase.auth.signUp({
      email: sahkoposti,
      password: salasana,
    })

    if (error) {
      setViesti("⚠️ Rekisteröityminen epäonnistui: " + error.message)
    } else {
      setViesti("✅ Rekisteröityminen onnistui! Kirjaudu sisään.")
      setTimeout(() => router.push("/kirjaudu"), 2000)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Luo uusi käyttäjä</h1>
      <form onSubmit={rekisteroidy} className="space-y-4">
        <input
          type="email"
          placeholder="Sähköpostiosoite"
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Rekisteröidy
        </button>
      </form>
      {viesti && <p className="mt-4">{viesti}</p>}
    </main>
  )
}
