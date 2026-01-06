'use client'

import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RekisteroidySivu() {
  const [sahkoposti, setSahkoposti] = useState("")
  const [salasana, setSalasana] = useState("")
  const [salasana2, setSalasana2] = useState("")
  const [naytaSalasana, setNaytaSalasana] = useState(false)

  const [viesti, setViesti] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Älä ohjaa vahingossa sisään jos email ei ole vahvistettu
  useEffect(() => {
    let cancelled = false

    const tarkista = async () => {
      const { data, error } = await supabase.auth.getUser()

      // Jos refresh token on rikki/vanha → siivoa tokenit
      if (error) {
        await supabase.auth.signOut()
        if (!cancelled) setViesti("")
        return
      }

      const user = data?.user
      if (user && user.email_confirmed_at) {
        router.push("/profiili")
      }
    }

    tarkista()

    return () => {
      cancelled = true
    }
  }, [router])

  const rekisteroidy = async (e: FormEvent) => {
    e.preventDefault()
    setViesti("")
    setLoading(true)

    try {
      const email = sahkoposti.trim()

      // Perus-validoinnit ennen Supabasea
      if (!email) {
        setViesti("⚠️ Syötä sähköpostiosoite.")
        return
      }

      if (salasana.length < 8) {
        setViesti("⚠️ Salasanan pitää olla vähintään 8 merkkiä.")
        return
      }

      if (salasana !== salasana2) {
        setViesti("⚠️ Salasanat eivät täsmää.")
        return
      }

      // Local + prod
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

      const { data, error } = await supabase.auth.signUp({
        email,
        password: salasana,
        options: {
          emailRedirectTo: `${siteUrl}/kirjaudu`, // halutessa myöhemmin /auth/callback
        },
      })

      if (error) {
        // jos auth-storage on sekaisin (vanha refresh token), siivoa ja näytä viesti
        await supabase.auth.signOut()
        setViesti("⚠️ Rekisteröityminen epäonnistui: " + error.message)
        return
      }

      // Jos email confirmations ON → yleensä ei tule sessionia heti
      if (!data.session) {
        setViesti("✅ Rekisteröityminen onnistui! Tarkista sähköposti ja vahvista tili linkistä ennen kirjautumista.")
        setTimeout(() => router.push("/kirjaudu"), 2500)
        return
      }

      // Jos email confirmations OFF → session tulee heti
      setViesti("✅ Tili luotu ja kirjauduttu sisään!")
      setTimeout(() => router.push("/profiili"), 1000)
    } finally {
      setLoading(false)
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
          autoComplete="email"
        />

        <div className="space-y-2">
          <input
            type={naytaSalasana ? "text" : "password"}
            placeholder="Salasana (väh. 8 merkkiä)"
            value={salasana}
            onChange={(e) => setSalasana(e.target.value)}
            className="w-full p-2 border rounded"
            required
            autoComplete="new-password"
          />

          <input
            type={naytaSalasana ? "text" : "password"}
            placeholder="Vahvista salasana"
            value={salasana2}
            onChange={(e) => setSalasana2(e.target.value)}
            className="w-full p-2 border rounded"
            required
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() => setNaytaSalasana((v) => !v)}
            className="text-sm underline opacity-80 hover:opacity-100"
          >
            {naytaSalasana ? "Piilota salasanat" : "Näytä salasanat"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 disabled:opacity-60 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          {loading ? "Rekisteröidään..." : "Rekisteröidy"}
        </button>
      </form>

      {viesti && <p className="mt-4">{viesti}</p>}
    </main>
  )
}
