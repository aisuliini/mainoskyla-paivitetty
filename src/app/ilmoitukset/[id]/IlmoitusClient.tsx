'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus?: string | null
  kuva_url?: string | null
  nayttoja?: number | null
  luotu?: string | null
  voimassa_alku?: string | null
  voimassa_loppu?: string | null
}

export default function IlmoitusClient() {
  const params = useParams()
  const id = params.id as string

  const [ilmoitus, setIlmoitus] = useState<Ilmoitus | null>(null)

  useEffect(() => {
  if (!id) return

  // Laske vain jos edellisestä katselusta > 30 min (ei tuplaa back-napilla)
  const key = `viewed_${id}`
  const last = sessionStorage.getItem(key)
  const now = Date.now()
  const THIRTY_MIN = 30 * 60 * 1000

  if (!last || now - Number(last) > THIRTY_MIN) {
    sessionStorage.setItem(key, String(now))

    // fire-and-forget (ei hidasta)
    fetch('/api/ilmoitus/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      cache: 'no-store',
    }).catch(() => {})
  }

  // Lataa ilmoitus
  const load = async () => {
    const { data } = await supabase
      .from('ilmoitukset')
      .select('*')
      .eq('id', id)
      .single()

    setIlmoitus((data as Ilmoitus) ?? null)
  }

  load()
}, [id])



  if (!ilmoitus) return <p className="p-6">Ladataan…</p>

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-12">
      {ilmoitus.kuva_url && (
        <div className="relative w-full h-64 rounded mb-4 overflow-hidden">
          <Image
            src={ilmoitus.kuva_url}
            alt={ilmoitus.otsikko || 'Ilmoitus'}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <h1 className="text-2xl font-bold break-words">{ilmoitus.otsikko}</h1>
      <p className="mt-4 text-gray-800 whitespace-pre-line">{ilmoitus.kuvaus}</p>
      <p className="mt-2 text-sm text-gray-500">
  Katselukerrat: {ilmoitus.nayttoja ?? 0}
</p>

    </main>
  )
}
