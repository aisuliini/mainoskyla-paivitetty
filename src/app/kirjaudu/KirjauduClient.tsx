'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function KirjauduSivu() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const loggedOut = searchParams.get('logout') === '1'
  const idleLogout = searchParams.get('reason') === 'idle'
  const logoutError = searchParams.get('logout_error') === '1'

  // Salasana login
  const [sahkoposti, setSahkoposti] = useState('')
  const [salasana, setSalasana] = useState('')

  // Magic link
  const [magicEmail, setMagicEmail] = useState('')
  const [sent, setSent] = useState(false)

  // UI state
  const [viesti, setViesti] = useState('')
const [loading, setLoading] = useState(true) // sivun auth-check

const [googleLoading, setGoogleLoading] = useState(false)
const [magicLoading, setMagicLoading] = useState(false)
const [passwordLoading, setPasswordLoading] = useState(false)

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
    setGoogleLoading(false)
    setMagicLoading(false)
    setPasswordLoading(false)
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
  if (passwordLoading) return

  setViesti('')
  setSent(false)
  setPasswordLoading(true)

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: sahkoposti.trim(),
      password: salasana,
    })

    if (error) {
      setViesti('⚠️ Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.')
      return
    }

    router.replace('/profiili')
    router.refresh()
  } catch (err) {
    console.error(err)
    setViesti('⚠️ Kirjautuminen epäonnistui. Yritä uudelleen.')
  } finally {
    setPasswordLoading(false)
  }
}

  const lahetaMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (magicLoading) return

  setViesti('')
  setSent(false)
  setMagicLoading(true)

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim(),
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/profiili`,
      },
    })

    if (error) {
      setViesti('⚠️ Linkin lähetys epäonnistui. Yritä uudelleen hetken päästä.')
      return
    }

    setSent(true)
  } catch (err) {
    console.error(err)
    setViesti('⚠️ Linkin lähetys epäonnistui. Yritä uudelleen.')
  } finally {
    setMagicLoading(false)
  }
}

    const kirjauduGooglella = async () => {
  if (googleLoading) return

  setViesti('')
  setSent(false)
  setGoogleLoading(true)

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })

    if (error) {
  setViesti('⚠️ Google-kirjautuminen epäonnistui. Yritä uudelleen.')
  setGoogleLoading(false)
  return
}
  } catch (err) {
    console.error(err)
    setViesti('⚠️ Google-kirjautuminen epäonnistui. Yritä uudelleen.')
    setGoogleLoading(false)
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

      {loggedOut && (
  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
    Olet kirjautunut ulos.
  </div>
)}

{idleLogout && (
  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
    Sinut kirjattiin ulos käyttämättömyyden vuoksi.
  </div>
)}

{logoutError && (
  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
    Uloskirjautumisessa tapahtui virhe. Yritä uudelleen.
  </div>
)}

      {/* GOOGLE */}
      <button
        type="button"
        onClick={kirjauduGooglella}
        disabled={googleLoading}
        className="
          w-full rounded-full px-6 py-3 font-semibold
          bg-white text-[#1E3A41]
          ring-1 ring-black/10
          hover:ring-black/20
          disabled:opacity-60 transition
        "
      >
        {googleLoading ? 'Avataan Googlea…' : 'Jatka Googlella'}
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
          disabled={magicLoading}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#EDF5F2] text-[#1E3A41]
            hover:bg-[#DCEEE8] transition
            ring-1 ring-[#4F8F7A]/35
            disabled:opacity-60
          "
        >
          {magicLoading ? 'Lähetetään…' : 'Lähetä kirjautumislinkki'}
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
          disabled={passwordLoading}
          className="
            w-full rounded-full px-6 py-3 font-semibold
            bg-[#1E3A41] text-white
            hover:opacity-95 transition
            disabled:opacity-60
          "
        >
          {passwordLoading ? 'Kirjaudutaan…' : 'Kirjaudu'}
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