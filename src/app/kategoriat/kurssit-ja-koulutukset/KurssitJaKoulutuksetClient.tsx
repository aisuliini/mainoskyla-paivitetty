'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const PER_PAGE = 12


type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string
  nayttoja?: number
  luotu?: string
}

export default function KurssitJAKoulutuksetClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState(false)
  const [jarjestys, setJarjestys] = useState<'uusin' | 'vanhin' | 'suosituin'>('uusin')
  const [sijainti, setSijainti] = useState(searchParams.get('sijainti') || '')

  useEffect(() => {
    const haeIlmoitukset = async () => {
      const from = (page - 1) * PER_PAGE
      const to = from + PER_PAGE - 1

      let query = supabase
        .from('ilmoitukset')
        .select('*')
        .eq('kategoria', 'Kurssit ja koulutukset')

      if (jarjestys === 'uusin') query = query.order('luotu', { ascending: false })
      if (jarjestys === 'vanhin') query = query.order('luotu', { ascending: true })
      if (jarjestys === 'suosituin') query = query.order('nayttoja', { ascending: false })

      if (sijainti.trim()) {
        query = query.ilike('sijainti', `%${sijainti.trim()}%`)
      }

      const { data, error } = await query.range(from, to)
      if (!error && data) {
        setIlmoitukset(data as Ilmoitus[])
        setHasMore(data.length === PER_PAGE)
      }
    }

    haeIlmoitukset()
  }, [page, jarjestys, sijainti])

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kurssit & Koulutukset</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={jarjestys}
          onChange={(e) => setJarjestys(e.target.value as 'uusin' | 'vanhin' | 'suosituin')}
          className="border px-3 py-2 rounded"
        >
          <option value="uusin">Uusin</option>
          <option value="vanhin">Vanhin</option>
          <option value="suosituin">Suosituin</option>
        </select>

        <input
          type="text"
          placeholder="Paikkakunta..."
          value={sijainti}
          onChange={(e) => {
            const uusiSijainti = e.target.value
            setSijainti(uusiSijainti)

            const params = new URLSearchParams(searchParams.toString())
            if (uusiSijainti) {
              params.set('sijainti', uusiSijainti)
            } else {
              params.delete('sijainti')
            }
            router.push(`?${params.toString()}`)
          }}
          className="border px-3 py-2 rounded"
        />
      </div>

      {ilmoitukset.length === 0 ? (
        <p>Ei ilmoituksia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ilmoitukset.map((ilmo) => (
            <div key={ilmo.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {ilmo.kuva_url ? (
                  <img
                    src={ilmo.kuva_url}
                    alt={ilmo.otsikko}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Ei kuvaa</span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{ilmo.otsikko}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
                <p className="text-xs text-gray-500">{ilmo.sijainti}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
                  👁️ {ilmo.nayttoja || 0} katselukertaa
                </div>
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

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Edellinen
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Seuraava
        </button>
      </div>
    </main>
  )
}
