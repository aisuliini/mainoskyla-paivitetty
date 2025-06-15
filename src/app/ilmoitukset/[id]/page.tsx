'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function IlmoitusSivu() {
  const params = useParams()
  const [ilmoitus, setIlmoitus] = useState<any>(null)

  useEffect(() => {
    const haeJaKasvata = async () => {
      const { data } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setIlmoitus(data)

        await supabase
          .from('ilmoitukset')
          .update({ nayttoja: (data.nayttoja || 0) + 1 })
          .eq('id', data.id)
      }
    }

    if (params.id) haeJaKasvata()
  }, [params.id])

  if (!ilmoitus) return <p className="p-6">Ladataan ilmoitusta...</p>

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-12">
      {ilmoitus.kuva_url && (
        <img
          src={ilmoitus.kuva_url}
          alt={ilmoitus.otsikko}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-2 break-words line-clamp-2">{ilmoitus.otsikko}</h1>

      <p className="text-sm text-gray-500 mb-2">
  Julkaistu: {new Date(ilmoitus.luotu).toLocaleString('fi-FI')}
</p>

      <p className="text-gray-800 mb-4">{ilmoitus.kuvaus}</p>
      <p className="text-xs text-gray-500">{ilmoitus.nayttoja || 0} katselukertaa</p>
    </main>
  )
}
