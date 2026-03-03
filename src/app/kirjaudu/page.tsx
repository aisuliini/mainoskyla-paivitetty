'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function KirjauduSivu() {
  const router = useRouter()

  // Salasana login
  const [sahkoposti, setSahkoposti] = useState('')
  const [salasana, setSalasana] = useState('')

  // Magic link
  const [magicEmail, setMagicEmail] = useState('')
  const [sent, setSent] = useState(false)

  // UI state
  const [viesti, setViesti] = useState('')
  const [loading, setLoading] = useState(true) // sivun auth-check
  const [submitting, setSubmitting] = useState(false) // napit/lomakkeet

  useEffect(() => {
  let mounted = true

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) console.warn('getSession error', error)
    if (!mounted) return

    if (data.session?.user) {
      router.replace('/profiili')
      router.refresh()
      return
    }

    // jos ei sessionia (esim. käyttäjä perui Googlen), avaa napit takaisin
    setSubmitting(false)
    setLoading(false)
  }

  // 1) eka tarkistus kun sivu aukeaa
  void checkSession()

  // 2) kun käyttäjä palaa takaisin (Safari back cache / OAuth cancel)
  const onReturn = () => {
    void checkSession()
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') void checkSession()
  }

  window.addEventListener('pageshow', onReturn) // tärkein Safariin
  window.addEventListener('focus', onReturn)
  document.addEventListener('visibilitychange', onVisibility)

  // 3) normaali auth-listener
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      router.replace('/profiili')
      router.refresh()
    }
  })

  return () => {
    mounted = false
    sub.subscription.unsubscribe()
    window.removeEventListener('pageshow', onReturn)
    window.removeEventListener('focus', onReturn)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}, [router])
    

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

  const kirjauduSalasanalla = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setViesti('')
    setSent(false)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: sahkoposti.trim(),
      password: salasana,
    })

    setSubmitting(false)

    if (error) {
      setViesti('⚠️ Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.')
      return
    }

    router.replace('/profiili')
    router.refresh()
  }

  const lahetaMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setViesti('')
    setSent(false)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim(),
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    })

    setSubmitting(false)

    if (error) {
      setViesti('⚠️ Linkin lähetys epäonnistui. Yritä uudelleen hetken päästä.')
      return
    }

    setSent(true)
  }

    const kirjauduGooglella = async () => {
  if (submitting) return // ✅ estä tuplaklikit

  setViesti('')
  setSent(false)
  setSubmitting(true)

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: { prompt: 'select_account' },
    },
  })

  if (error) {
    setViesti('⚠️ Google-kirjautuminen epäonnistui. Yritä uudelleen.')
    setSubmitting(false)
  }
}

  if (loading) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2 text-[#1E3A41]">Kirjaudu</h1>
        <p className="text-sm text-charcoal/70">Ladataan…</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1 text-[#1E3A41]">Kirjaudu</h1>
      <p className="text-sm text-charcoal/70 mb-6">
        Kirjautumalla voit hallita ja muokata omia ilmoituksiasi.
      </p>

      {/* GOOGLE */}
      <button
        type="button"
        onClick={kirjauduGooglella}
        disabled={submitting}
        className="
          w-full rounded-full px-6 py-3 font-semibold
          bg-white text-[#1E3A41]
          ring-1 ring-black/10
          hover:ring-black/20
          disabled:opacity-60 transition
        "
      >
        Jatka Googlella
      </button>

      

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-xs text-charcoal/50">tai</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      {/* MAGIC LINK */}
      <form onSubmit={lahetaMagicLink} className="space-y-3">
        <input
          type="email"
          placeholder="Sähköposti (kirjautumislinkki)"
          value={magicEmail}
          onChange={(e) => setMagicEmail(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="email"
          inputMode="email"
        />

        <button
          type="submit"
          disabled={submitting}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#EDF5F2] text-[#1E3A41]
            hover:bg-[#DCEEE8] transition
            ring-1 ring-[#4F8F7A]/35
            disabled:opacity-60
          "
        >
          {submitting ? 'Lähetetään…' : 'Lähetä kirjautumislinkki'}
        </button>

        {sent && (
          <p className="text-sm text-green-700">
            ✅ Linkki lähetetty! Tarkista sähköposti. Linkki ohjaa Mainoskylään.
          </p>
        )}
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-xs text-charcoal/50">tai salasanalla</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      {/* SALASANA */}
      <form onSubmit={kirjauduSalasanalla} className="space-y-3">
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

        <input
          type="password"
          placeholder="Salasana"
          value={salasana}
          onChange={(e) => setSalasana(e.target.value)}
          className="w-full p-3 rounded-xl border border-charcoal/15"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#1E3A41] text-white
            hover:opacity-95 transition
            disabled:opacity-60
          "
        >
          {submitting ? 'Kirjaudutaan…' : 'Kirjaudu'}
        </button>
      </form>

      {viesti && <p className="mt-4 text-sm text-red-700">{viesti}</p>}

      <p className="text-xs text-charcoal/60 mt-6">
        🔒 Emme koskaan pyydä pankkitunnuksia. Kirjautumislinkki ohjaa aina Mainoskylän osoitteeseen.
      </p>

      <p className="text-sm mt-4">
        <Link href="/unohditko-salasanan" className="underline text-[#1E3A41]">
          Unohtuiko salasana?
        </Link>
      </p>

      <p className="text-sm mt-2">
        <Link href="/rekisteroidy" className="underline text-[#1E3A41]">
          Eikö sinulla ole tiliä? Rekisteröidy tästä.
        </Link>
      </p>
    </main>
  )
}