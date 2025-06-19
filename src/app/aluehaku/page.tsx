'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string
  luotu?: string
}

export default function AluehakuPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hakusana = searchParams.get('sijainti') || ''
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])

  useEffect(() => {
    const hae = async () => {
      if (!hakusana) return

      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .or(`sijainti.ilike.*${hakusana}*,otsikko.ilike.*${hakusana}*,kuvaus.ilike.*${hakusana}*`)
        .order('luotu', { ascending: false })

      if (!error && data) setIlmoitukset(data as Ilmoitus[])
    }
    hae()
  }, [hakusana, router])

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Hae paikkakunta tai sana..."
          value={hakusana}
          onChange={(e) => {
            const uusi = e.target.value
            const params = new URLSearchParams()
            if (uusi) params.set('sijainti', uusi)
            router.push(`/aluehaku?${params.toString()}`)
          }}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Hakutulokset: {hakusana}</h1>

      {ilmoitukset.length === 0 ? (
        <p>Ei tuloksia haulle.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ilmoitukset.map((ilmo) => (
            <div key={ilmo.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              {ilmo.kuva_url && (
                <img src={ilmo.kuva_url} alt={ilmo.otsikko} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{ilmo.otsikko}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
                <p className="text-xs text-gray-500">{ilmo.sijainti}</p>
                <button
                  onClick={() => router.push(`/ilmoitukset/${ilmo.id}`)}
                  className="mt-3 px-4 py-2 text-sm bg-[#3f704d] text-white rounded hover:bg-[#2f5332]"
                >
                  Näytä
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
