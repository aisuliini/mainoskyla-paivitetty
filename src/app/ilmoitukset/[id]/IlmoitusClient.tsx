'use client'

import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import KuvaCarousel from '@/components/KuvaCarousel'
import { FaInstagram, FaGlobe } from 'react-icons/fa'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus?: string | null
  kuva_url?: string | null
  kuvat?: string | null
  nayttoja?: number | null
  luotu?: string | null
  voimassa_alku?: string | null
  voimassa_loppu?: string | null
  user_id?: string | null
  puhelin?: string | null
  sahkoposti?: string | null
  linkki?: string | null
}

type Profiili = {
  nimi?: string | null
  email?: string | null
  puhelin?: string | null
  www?: string | null
  kuva_url?: string | null
}

export default function IlmoitusClient() {
  const params = useParams()
  const id = params.id as string

  const [ilmoitus, setIlmoitus] = useState<Ilmoitus | null>(null)
  const [profiili, setProfiili] = useState<Profiili | null>(null)

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const kuvatRaw = ilmoitus?.kuvat ?? null

  const kuvatArr = useMemo(() => {
    if (!kuvatRaw) return null
    try {
      const parsed = JSON.parse(kuvatRaw)
      if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 4) as string[]
      return null
    } catch {
      return null
    }
  }, [kuvatRaw])

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setErrorMsg(null)

    // Laske vain jos edellisestä katselusta > 30 min (ei tuplaa back-napilla)
    const key = `viewed_${id}`
    const last = sessionStorage.getItem(key)
    const now = Date.now()
    const THIRTY_MIN = 30 * 60 * 1000

    if (!last || now - Number(last) > THIRTY_MIN) {
      sessionStorage.setItem(key, String(now))

      fetch('/api/ilmoitus/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        cache: 'no-store',
      }).catch(() => {})
    }

    const load = async () => {
      // 1) Hae ilmoitus
      const { data: ilmoData, error: ilmoErr } = await supabase
        .from('ilmoitukset')
        .select(
          'id, otsikko, kuvaus, kuva_url, kuvat, nayttoja, luotu, voimassa_alku, voimassa_loppu, user_id, puhelin, sahkoposti, linkki'
        )
        .eq('id', id)
        .single()

      if (ilmoErr) {
        console.error('Ilmoituksen haku epäonnistui:', ilmoErr.message)
        setIlmoitus(null)
        setProfiili(null)
        setErrorMsg('Ilmoitusta ei löytynyt tai se on poistettu.')
        setLoading(false)
        return
      }

      setIlmoitus((ilmoData as Ilmoitus) ?? null)
      setLoading(false)

      // 2) Hae yrittäjän/profiilin tiedot user_id:llä
      const uid = (ilmoData as Ilmoitus)?.user_id ?? null
      if (!uid) {
        setProfiili(null)
        return
      }

      // Yritä profiilit.id = auth.users.id
      const { data: p1, error: e1 } = await supabase
        .from('profiilit')
        .select('nimi, email, puhelin, www, kuva_url')
        .eq('id', uid)
        .single()

      if (!e1 && p1) {
        setProfiili(p1 as Profiili)
        return
      }

      // Fallback: profiilit.user_id = auth.users.id
      const { data: p2, error: e2 } = await supabase
        .from('profiilit')
        .select('nimi, email, puhelin, www, kuva_url')
        .eq('user_id', uid)
        .single()

      if (!e2 && p2) {
        setProfiili(p2 as Profiili)
        return
      }

      setProfiili(null)
    }

    load()
  }, [id])

  if (loading) return <p className="p-6">Ladataan…</p>

  if (errorMsg) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-12">
        <p className="text-gray-800">{errorMsg}</p>
      </div>
    )
  }

  if (!ilmoitus) return null

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-12">
      <div className="mb-4">
        <KuvaCarousel
          kuvaUrl={ilmoitus?.kuva_url ?? null}
          kuvat={kuvatArr}
          autoMs={5000}
          max={4}
          alt={ilmoitus?.otsikko ?? 'Ilmoitus'}
        />
      </div>

      <h1 className="text-2xl font-bold break-words">{ilmoitus.otsikko}</h1>

      <div className="mt-3 flex items-center gap-2">
        {profiili?.www && (
          <a
            href={profiili.www.startsWith('http') ? profiili.www : `https://${profiili.www}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
            aria-label="Avaa verkkosivu"
            title="Verkkosivu"
          >
            <FaGlobe />
          </a>
        )}

        {ilmoitus?.linkki && (
          <a
            href={ilmoitus.linkki}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
            aria-label="Avaa linkki"
            title="Linkki"
          >
            {ilmoitus.linkki.includes('instagram.com') ? <FaInstagram /> : <FaGlobe />}
          </a>
        )}
      </div>

      <p className="mt-4 text-gray-800 whitespace-pre-line">{ilmoitus.kuvaus}</p>

      <p className="mt-2 text-sm text-gray-500">Katselukerrat: {ilmoitus.nayttoja ?? 0}</p>

      {(ilmoitus.puhelin || ilmoitus.sahkoposti || ilmoitus.linkki) && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Yhteystiedot</h2>

          {ilmoitus.puhelin && (
            <p className="text-sm text-gray-800">
              <b>Puhelin:</b>{' '}
              <a className="underline" href={`tel:${ilmoitus.puhelin}`}>
                {ilmoitus.puhelin}
              </a>
            </p>
          )}

          {ilmoitus.sahkoposti && (
            <p className="text-sm text-gray-800">
              <b>Sähköposti:</b>{' '}
              <a className="underline" href={`mailto:${ilmoitus.sahkoposti}`}>
                {ilmoitus.sahkoposti}
              </a>
            </p>
          )}

          {ilmoitus.linkki && (
            <p className="text-sm text-gray-800">
              <b>Linkki:</b>{' '}
              <a className="underline" href={ilmoitus.linkki} target="_blank" rel="noreferrer">
                {ilmoitus.linkki}
              </a>
            </p>
          )}
        </div>
      )}
    </main>
  )
}
