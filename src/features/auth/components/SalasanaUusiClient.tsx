'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SalasanaUusiClient() {
  const router = useRouter()

  const [uusiSalasana, setUusiSalasana] = useState('')
  const [uusiSalasana2, setUusiSalasana2] = useState('')

  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [viesti, setViesti] = useState('')

  useEffect(() => {
    let mounted = true

    const checkRecoverySession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        console.error('Recovery-session tarkistus epäonnistui:', error)
      }

      if (data.session?.user) {
        setReady(true)
      }

      setSessionLoading(false)
    }

    void checkRecoverySession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === 'PASSWORD_RECOVERY' || !!session?.user) {
        setReady(true)
        setViesti('')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const vaihdaSalasana = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setViesti('')

    if (!ready) {
      setViesti('⚠️ Salasanan vaihtolinkki ei ole vielä valmis. Odota hetki ja yritä uudelleen.')
      return
    }

    if (uusiSalasana.length < 8) {
      setViesti('⚠️ Salasanan pitää olla vähintään 8 merkkiä.')
      return
    }

    if (uusiSalasana !== uusiSalasana2) {
      setViesti('⚠️ Salasanat eivät täsmää.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password: uusiSalasana })

      if (error) {
        console.error('Salasanan vaihto epäonnistui:', error)
        setViesti('⚠️ Salasanan vaihto epäonnistui. Linkki voi olla vanhentunut.')
        return
      }

      setViesti('✅ Salasana vaihdettu! Siirrytään kirjautumiseen...')

      setTimeout(() => {
        router.replace('/kirjaudu')
        router.refresh()
      }, 1200)
    } catch (err) {
      console.error('Salasanan vaihdossa tapahtui poikkeus:', err)
      setViesti('⚠️ Salasanan vaihto epäonnistui. Yritä uudelleen.')
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-[#1E3A41]">Aseta uusi salasana</h1>
        <p className="text-sm text-charcoal/70">Valmistellaan salasanan vaihtoa…</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#1E3A41]">Aseta uusi salasana</h1>

      {!ready && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Linkki ei ole voimassa tai istuntoa ei voitu muodostaa. Pyydä uusi salasanan vaihtolinkki.
        </div>
      )}

      <form onSubmit={vaihdaSalasana} className="space-y-4">
        <input
          type="password"
          placeholder="Uusi salasana (väh. 8 merkkiä)"
          value={uusiSalasana}
          onChange={(e) => setUusiSalasana(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="new-password"
          disabled={!ready || loading}
        />

        <input
          type="password"
          placeholder="Vahvista uusi salasana"
          value={uusiSalasana2}
          onChange={(e) => setUusiSalasana2(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="new-password"
          disabled={!ready || loading}
        />

        <button
          type="submit"
          disabled={!ready || loading}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#4F6763] text-white
            hover:opacity-95 transition
            disabled:opacity-60
          "
        >
          {loading ? 'Vaihdetaan…' : 'Vaihda salasana'}
        </button>
      </form>

      {viesti && (
        <p
          className={`mt-4 text-sm ${
            viesti.startsWith('✅') ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {viesti}
        </p>
      )}
    </main>
  )
}