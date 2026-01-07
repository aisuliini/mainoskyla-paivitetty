'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import Katselukerrat from '@/components/Katselukerrat';


const PER_PAGE = 12

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string
  nayttoja?: number
  luotu?: string
  premium?: boolean
}


export default function KasityolaisetClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState(false)
  const [jarjestys, setJarjestys] = useState<'uusin' | 'vanhin' | 'suosituin'>('uusin')

  useEffect(() => {
    const haeIlmoitukset = async () => {
      const from = (page - 1) * PER_PAGE
      const to = from + PER_PAGE - 1

      const nytISO = new Date().toISOString()


      let query = supabase
  .from('ilmoitukset')
  .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja, luotu, premium, voimassa_alku')
  .eq('kategoria', 'Käsityöläiset')
  .or(`voimassa_alku.is.null,voimassa_alku.lte.${nytISO}`)
  .order('premium', { ascending: false })


      if (jarjestys === 'uusin') query = query.order('luotu', { ascending: false })
      if (jarjestys === 'vanhin') query = query.order('luotu', { ascending: true })
      if (jarjestys === 'suosituin') query = query.order('nayttoja', { ascending: false })

  

      const { data, error } = await query.range(from, to)
      if (!error && data) {
        setIlmoitukset(data as Ilmoitus[])
        setHasMore(data.length === PER_PAGE)
      }
    }

    haeIlmoitukset()
  }, [page, jarjestys])

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Käsityöläiset</h1>

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

      
      </div>

      {ilmoitukset.length === 0 ? (
        <p>Ei ilmoituksia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ilmoitukset.map((ilmo) => (
<div
  key={ilmo.id}
  className={`rounded-lg overflow-hidden shadow-sm border
    ${ilmo.premium === true ? 'bg-[#F3F8F6] border-[#6A837F]' : 'bg-white border-gray-200'}
  `}
>
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
  {ilmo.premium === true && (
    <span className="absolute top-2 left-2 z-10 bg-[#4F6763] text-white text-xs px-2 py-1 rounded-full shadow">
      Premium
    </span>
  )}

  <Image
    src={ilmo.kuva_url || '/placeholder.jpg'}
    alt={ilmo.otsikko}
    fill
    style={{ objectFit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 33vw"
    className="rounded-t"
  />
</div>



              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{ilmo.otsikko}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
                <p className="text-xs text-gray-500">{ilmo.sijainti}</p>
                <Katselukerrat count={ilmo.nayttoja || 0} small />

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
