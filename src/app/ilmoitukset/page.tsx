'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Ilmoitus = {
  id: number
  nimi: string
  viesti: string
  created_at: string
}

export default function IlmoituksetSivu() {
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const haeIlmoitukset = async () => {
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setIlmoitukset(data)
      }
      setLoading(false)
    }

    haeIlmoitukset()
  }, [])

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#9ba88d]">Kaikki ilmoitukset</h1>

      {loading ? (
        <p>Ladataan ilmoituksia...</p>
      ) : ilmoitukset.length === 0 ? (
        <p>Ei vielä ilmoituksia.</p>
      ) : (
        <ul className="space-y-4">
          {ilmoitukset.map((ilmoitus) => (
            <li key={ilmoitus.id} className="bg-[#f0e7e3] p-4 rounded shadow">
              <h2 className="font-semibold text-lg text-[#4a7c59]">{ilmoitus.nimi}</h2>
              <p className="text-[#333]">{ilmoitus.viesti}</p>
              <p className="text-xs text-[#888] mt-2">
                {new Date(ilmoitus.created_at).toLocaleString('fi-FI')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
