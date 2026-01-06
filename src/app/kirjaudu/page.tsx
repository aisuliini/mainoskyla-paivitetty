'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function KirjauduSivu() {
  const router = useRouter()

  const [sahkoposti, setSahkoposti] = useState<string>('')
  const [salasana, setSalasana] = useState<string>('')
  const [viesti, setViesti] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true) // sivun auth-check
  const [submitting, setSubmitting] = useState<boolean>(false) // lomakkeen submit

  useEffect(() => {
    let mounted = true

    const redirectIfLoggedIn = async () => {
      const { data, error } = await supabase.auth.getSession()

      // Jos auth-storage on rikki, siivoa mutta älä kaada näkymää
      if (error) {
        await supabase.auth.signOut()
      }

      const user = data?.session?.user

      if (user) {
        router.replace('/profiili')
        router.refresh()
        return
      }

      if (mounted) setLoading(false)
    }

    redirectIfLoggedIn()

    // Kuuntele kirjautumisen muutokset (ammattilaistaso: ei jää ikinä "samaan näkymään")
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace('/profiili')
        router.refresh()
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  const kirjauduSalasanalla = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setViesti('')
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: sahkoposti.trim(),
      password: salasana,
    })

    setSubmitting(false)

    if (error) {
      // Älä automaattisesti signOut tässä: muuten voit joskus “pudottaa” validin session
      setViesti('⚠️ Kirjautuminen epäonnistui: ' + error.message)
      return
    }

    // Extra-varmistus: vaikka onAuthStateChange yleensä hoitaa, tämä tekee käytöksestä välittömän
    router.replace('/profiili')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Kirjaudu</h1>
        <p>Ladataan...</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu</h1>

      <form onSubmit={kirjauduSalasanalla} className="space-y-4">
        <input
          type="email"
          placeholder="Sähköpostiosoitteesi"
          value={sahkoposti}
          onChange={(e) => setSahkoposti(e.target.value)}
          className="w-full p-2 border rounded"
          required
          autoComplete="email"
          inputMode="email"
        />

        <input
          type="password"
          placeholder="Salasana"
          value={salasana}
          onChange={(e) => setSalasana(e.target.value)}
          className="w-full p-2 border rounded"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 w-full"
        >
          {submitting ? 'Kirjaudutaan...' : 'Kirjaudu'}
        </button>
      </form>

      {viesti && <p className="mt-4 text-sm text-red-700">{viesti}</p>}

      <p className="text-sm mt-4">
        <Link href="/unohditko-salasanan" className="text-blue-600 hover:underline">
          Unohtuiko salasana?
        </Link>
      </p>

      <p className="text-sm mt-2">
        <Link href="/rekisteroidy" className="text-blue-600 hover:underline">
          Eikö sinulla ole tiliä? Rekisteröidy tästä.
        </Link>
      </p>
    </main>
  )
}
