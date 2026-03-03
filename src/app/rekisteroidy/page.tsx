'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RekisteroidySivu() {
  const [sahkoposti, setSahkoposti] = useState('')
  const [salasana, setSalasana] = useState('')
  const [salasana2, setSalasana2] = useState('')
  const [naytaSalasana, setNaytaSalasana] = useState(false)

  const [viesti, setViesti] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const router = useRouter()

  const rekisteroidy = async (e: FormEvent) => {
    e.preventDefault()
    setViesti('')
    setDone(false)

    const email = sahkoposti.trim()

    // ✅ Validoinnit ENNEN loadingia
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
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      const { data, error } = await supabase.auth.signUp({
        email,
        password: salasana,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      })

      if (error) {
        setViesti('⚠️ Rekisteröityminen epäonnistui: ' + error.message)
        return
      }

      // ✅ Email confirmations ON → ei tule sessionia heti
      if (!data.session) {
        setDone(true)
        setViesti(
          '✅ Rekisteröityminen onnistui! Lähetimme vahvistuslinkin sähköpostiisi. Avaa linkki, niin kirjautuminen vahvistuu Mainoskylään.'
        )
        return
      }

      // ✅ Email confirmations OFF → session tulee heti
      router.replace('/profiili')
      router.refresh()
    } finally {
      setLoading(false)
    }
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
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/kirjaudu')}
                className="rounded-full px-5 py-2 text-sm font-semibold bg-[#1E3A41] text-white"
              >
                Siirry kirjautumaan
              </button>
              <a
                className="rounded-full px-5 py-2 text-sm font-semibold bg-white ring-1 ring-black/10"
                href="mailto:"
              >
                Avaa sähköposti
              </a>
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