'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  kuva_url?: string
  nayttoja?: number
  luotu: string
  voimassa_alku?: string
  voimassa_loppu?: string
}


export default function IlmoitusSivu() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  const [ilmoitus, setIlmoitus] = useState<Ilmoitus | null>(null)

  useEffect(() => {
    const haeJaKasvata = async () => {
      if (!id) return

      const { data: alkuData } = await supabase
  .from('ilmoitukset')
  .select('*, voimassa_alku, voimassa_loppu')
  .eq('id', id)
  .single()


      if (alkuData) {
        await supabase
          .from('ilmoitukset')
          .update({ nayttoja: (alkuData.nayttoja || 0) + 1 })
          .eq('id', id)

        const { data: uusiData } = await supabase
  .from('ilmoitukset')
  .select('*, voimassa_alku, voimassa_loppu')
  .eq('id', id)
  .single()


        if (uusiData) setIlmoitus(uusiData as Ilmoitus)
      }
    }

    haeJaKasvata()
  }, [id])

  if (!ilmoitus) return <p className="p-6">Ladataan ilmoitusta...</p>

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-12">
      {ilmoitus.kuva_url && (
  <div className="relative w-full h-64 rounded mb-4 overflow-hidden">
    <Image
      src={ilmoitus.kuva_url || '/placeholder.jpg'}
      alt={ilmoitus.otsikko}
      fill
      style={{ objectFit: 'cover' }}
      className="rounded"
    />
  </div>
)}
      <h1 className="text-2xl font-bold mb-2 break-words line-clamp-2">{ilmoitus.otsikko}</h1>

      <p className="text-sm text-gray-500 mb-2">
        Julkaistu: {new Date(ilmoitus.luotu).toLocaleString('fi-FI')}
      </p>

      {ilmoitus.voimassa_alku && ilmoitus.voimassa_loppu && (
  <p className="text-sm text-gray-500 mb-2">
    Voimassa:{" "}
    <strong>
      {new Date(ilmoitus.voimassa_alku).toLocaleDateString("fi-FI")}
    </strong>{" "}
    –{" "}
    <strong>
      {new Date(ilmoitus.voimassa_loppu).toLocaleDateString("fi-FI")}
    </strong>
  </p>
)}


      <p className="text-gray-800 mb-4">{ilmoitus.kuvaus}</p>
      <p className="text-xs text-gray-500">{ilmoitus.nayttoja || 0} katselukertaa</p>
    </main>
  )
}
