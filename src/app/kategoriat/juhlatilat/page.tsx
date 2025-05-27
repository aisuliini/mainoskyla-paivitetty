'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const PER_PAGE = 12

export default function PientuottajatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ilmoitukset, setIlmoitukset] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState(false)

  const haeIlmoitukset = async (sivu: number) => {
    const from = (sivu - 1) * PER_PAGE
    const to = from + PER_PAGE - 1

    const { data, error } = await supabase
      .from('ilmoitukset')
      .select('*')
      .eq('kategoria', 'Pientuottajat')
      .order('luotu', { ascending: false })
      .range(from, to)

    if (!error && data) {
      setIlmoitukset(data)
      setHasMore(data.length === PER_PAGE)
    }
  }

  useEffect(() => {
    haeIlmoitukset(page)
  }, [page])

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Juhlatilat</h1>

      {ilmoitukset.length === 0 ? (
        <p>Ei ilmoituksia.</p>
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

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded disabled:opacity-50">Edellinen</button>
        <button onClick={() => setPage((p) => p + 1)} disabled={!hasMore} className="px-4 py-2 border rounded disabled:opacity-50">Seuraava</button>
      </div>
    </main>
  )
}
