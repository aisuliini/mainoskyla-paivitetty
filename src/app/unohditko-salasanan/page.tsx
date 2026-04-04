'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getSiteUrl } from '@/lib/auth/getSiteUrl'

export default function UnohtuikoSalasanaSivu() {
  const [sahkoposti, setSahkoposti] = useState('')
  const [viesti, setViesti] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const lahetaPalautuslinkki = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setViesti('')
    setSent(false)
    setLoading(true)

    try {
      const siteUrl = getSiteUrl()

      const email = sahkoposti.trim()

      if (!email) {
        setViesti('⚠️ Syötä sähköpostiosoite.')
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/salasana-uusi`,
      })

      if (error) {
        console.error('Salasanan palautuslinkin lähetys epäonnistui:', error)
        setViesti('⚠️ Linkin lähetys epäonnistui. Yritä uudelleen.')
        return
      }

      // Turvallisempi yleisviesti: ei paljasteta onko sähköposti olemassa
      setSent(true)
      setViesti(
        '✅ Jos sähköpostiosoite löytyy järjestelmästä, lähetimme ohjeet salasanan vaihtoon.'
      )
    } catch (err) {
      console.error('Salasanan palautuksessa tapahtui poikkeus:', err)
      setViesti('⚠️ Linkin lähetys epäonnistui. Yritä uudelleen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#1E3A41]">Unohtuiko salasana?</h1>

      <p className="text-sm text-charcoal/70 mb-6">
        Lähetämme sähköpostiisi linkin, jolla voit asettaa uuden salasanan.
      </p>

      <form onSubmit={lahetaPalautuslinkki} className="space-y-4">
        <input
          type="email"
          placeholder="Sähköpostiosoitteesi"
          value={sahkoposti}
          onChange={(e) => setSahkoposti(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="email"
          inputMode="email"
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#1E3A41] text-white
            hover:opacity-95 transition
            disabled:opacity-60
          "
        >
          {loading ? 'Lähetetään…' : 'Lähetä palautuslinkki'}
        </button>
      </form>

      {viesti && (
        <p className={`mt-4 text-sm ${sent ? 'text-green-700' : 'text-red-700'}`}>
          {viesti}
        </p>
      )}
    </main>
  )
}