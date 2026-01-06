'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string
  luotu?: string
}

function AluehakuSisalto() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hakusana = searchParams.get('sijainti') || ''
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  
  // UUSI tila parannettua hakukenttää varten:
  const [hakuKentta, setHakuKentta] = useState(hakusana)

  useEffect(() => {
    const hae = async () => {
      if (!hakusana) return

      const nytISO = new Date().toISOString()

const { data, error } = await supabase
  .from('ilmoitukset')
  .select('id, otsikko, kuvaus, sijainti, kuva_url, luotu')
  .or(
    `sijainti.ilike.%${hakusana}%,
     otsikko.ilike.%${hakusana}%,
     kuvaus.ilike.%${hakusana}%`.replace(/\s+/g, '')
  )
  .or(
    `and(voimassa_alku.is.null,voimassa_loppu.is.null),
     and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
     and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
     and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
  )
  .order('luotu', { ascending: false })
  .limit(60)




      if (!error && data) setIlmoitukset(data as Ilmoitus[])
    }
    hae()
    }, [hakusana])

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      
      {/* UUSI hakukenttä Tori.fi-tyyliin */}
      <div className="mb-8 w-full max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Hae paikkakunta tai sana..."
            value={hakuKentta}
            onChange={(e) => setHakuKentta(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const params = new URLSearchParams()
                if (hakuKentta) params.set('sijainti', hakuKentta)
                router.push(`/aluehaku?${params.toString()}`)
              }
            }}
            className="w-full px-4 py-2 border border-[#D1E2D2] rounded-full focus:ring-2 focus:ring-[#F99584]/50"
          />
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams()
              if (hakuKentta) params.set('sijainti', hakuKentta)
              router.push(`/aluehaku?${params.toString()}`)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1E3A41] text-white px-4 py-1 rounded-full text-sm hover:bg-[#27494e] active:scale-95 transition"
          >
            Hae
          </button>
        </div>
      </div>

      {/* VANHA hakukenttä säilytetty koskemattomana */}
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
                <div className="relative w-full h-40">
                  <Image
                    src={ilmo.kuva_url}
                    alt={ilmo.otsikko}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-t"
                  />
                </div>
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

export default function AluehakuPage() {
  return (
    <Suspense fallback={<div className="p-6">Ladataan hakua...</div>}>
      <AluehakuSisalto />
    </Suspense>
  )
}
