'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSiteUrl } from '@/features/auth/utils/getSiteUrl'

export default function RekisteroidyClient() {
  const [sahkoposti, setSahkoposti] = useState('')
  const [salasana, setSalasana] = useState('')
  const [salasana2, setSalasana2] = useState('')
  const [naytaSalasana, setNaytaSalasana] = useState(false)

  const [viesti, setViesti] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.warn('getUser error', error)
      if (!mounted) return

      if (data.user) {
        router.replace('/profiili')
        router.refresh()
        return
      }

      setAuthLoading(false)
    }

    void checkUser()

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

  const rekisteroidy = async (e: FormEvent) => {
    e.preventDefault()
    setViesti('')
    setDone(false)

    const email = sahkoposti.trim()

    if (!email) {
      setViesti('⚠️ Syötä sähköpostiosoite.')
      return
    }

    if (salasana.length < 8) {
      setViesti('⚠️ Salasanan pitää olla vähintään 8 merkkiä.')
      return
    }

    if (salasana !== salasana2) {
      setViesti('⚠️ Salasanat eivät täsmää.')
      return
    }

    setLoading(true)

    try {
      const siteUrl = getSiteUrl()

      const { data, error } = await supabase.auth.signUp({
        email,
        password: salasana,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      })

      if (error) {
  console.error('Rekisteröityminen epäonnistui:', error)

  const message = error.message.toLowerCase()

  if (
    message.includes('already registered') ||
    message.includes('user already registered') ||
    message.includes('already been registered')
  ) {
    setDone(true)
    setViesti(
      '⚠️ Tällä sähköpostiosoitteella saattaa jo olla tili. Kokeile kirjautumista tai salasanan palautusta.'
    )
  } else {
    setViesti('⚠️ Rekisteröityminen epäonnistui. Yritä uudelleen.')
  }

  return
}

if (!data.user) {
  setViesti('⚠️ Rekisteröityminen epäonnistui. Yritä uudelleen.')
  return
}

if (!data.session) {
  setDone(true)
  setViesti(
    '✅ Tarkista sähköpostisi. Jos vahvistusviestiä ei näy, tarkista roskaposti tai kokeile kirjautumista / salasanan palautusta, koska tällä osoitteella saattaa jo olla tili.'
  )
  return
}

      router.replace('/profiili')
      router.refresh()
    } catch (err) {
      console.error('Rekisteröitymisessä tapahtui poikkeus:', err)
      setViesti('⚠️ Rekisteröityminen epäonnistui. Yritä uudelleen.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2 text-[#1E3A41]">Rekisteröidy</h1>
        <p className="text-sm text-charcoal/70">Ladataan…</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1 text-[#1E3A41]">Rekisteröidy</h1>
      <p className="text-sm text-charcoal/70 mb-6">
        Tilillä voit hallita ja muokata omia ilmoituksiasi.
      </p>

      <form onSubmit={rekisteroidy} className="space-y-4">
        <input
          type="email"
          placeholder="Sähköpostiosoite"
          value={sahkoposti}
          onChange={(e) => setSahkoposti(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="email"
          inputMode="email"
        />

        <input
          type={naytaSalasana ? 'text' : 'password'}
          placeholder="Salasana (väh. 8 merkkiä)"
          value={salasana}
          onChange={(e) => setSalasana(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="new-password"
        />

        <input
          type={naytaSalasana ? 'text' : 'password'}
          placeholder="Vahvista salasana"
          value={salasana2}
          onChange={(e) => setSalasana2(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="new-password"
        />

        <button
          type="button"
          onClick={() => setNaytaSalasana((v) => !v)}
          className="text-sm underline opacity-80 hover:opacity-100"
        >
          {naytaSalasana ? 'Piilota salasanat' : 'Näytä salasanat'}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#EDF5F2] text-[#1E3A41]
            hover:bg-[#DCEEE8] transition
            ring-1 ring-[#4F8F7A]/35
            disabled:opacity-60
          "
        >
          {loading ? 'Rekisteröidään…' : 'Rekisteröidy'}
        </button>
      </form>

      {viesti && (
        <div className="mt-4 text-sm">
          <p>{viesti}</p>

          {done && (
  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
    <button
      type="button"
      onClick={() => router.push('/kirjaudu')}
      className="rounded-full px-5 py-2 text-sm font-semibold bg-[#1E3A41] text-white"
    >
      Siirry kirjautumaan
    </button>

    <button
      type="button"
      onClick={() => router.push('/unohditko-salasanan')}
      className="rounded-full px-5 py-2 text-sm font-semibold bg-white ring-1 ring-black/10"
    >
      Palauta salasana
    </button>
  </div>
)}
        </div>
      )}

      <p className="text-sm mt-6">
        Onko sinulla jo tili?{' '}
        <Link href="/kirjaudu" className="underline text-[#1E3A41]">
          Kirjaudu tästä
        </Link>
      </p>
    </main>
  )
}
