'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'


export default function TapahtumatPage() {
  const [ilmoitukset, setIlmoitukset] = useState<any[]>([])
  const [jarjestys, setJarjestys] = useState<'uusin' | 'vanhin' | 'tulevat'>('tulevat')
  const [haku, setHaku] = useState('')
  const [alkuPaiva, setAlkuPaiva] = useState('')
  const [loppuPaiva, setLoppuPaiva] = useState('')
  const router = useRouter()

  useEffect(() => {
  const hae = async () => {
    const nyt = new Date().toISOString()
    let query = supabase.from('ilmoitukset').select('*').eq('kategoria', 'Tapahtumat')

    // Järjestys
    if (jarjestys === 'tulevat') {
      query = query.gte('tapahtuma_loppu', nyt).order('tapahtuma_alku', { ascending: true })
    } else if (jarjestys === 'uusin') {
      query = query.order('luotu', { ascending: false })
    } else if (jarjestys === 'vanhin') {
      query = query.order('luotu', { ascending: true })
    }

    // Päivämäärähaku: näytä tapahtumat, jotka osuvat hakuajanjaksoon
    if (alkuPaiva && loppuPaiva) {
      query = query.or(`and(tapahtuma_alku.lte.${loppuPaiva},tapahtuma_loppu.gte.${alkuPaiva})`)
    }

    const { data, error } = await query

    if (!error && data) {
      const suodatetut = data.filter((ilmo) =>
        ilmo.otsikko.toLowerCase().includes(haku.toLowerCase()) ||
        ilmo.kuvaus.toLowerCase().includes(haku.toLowerCase()) ||
        ilmo.sijainti.toLowerCase().includes(haku.toLowerCase())
      )
      setIlmoitukset(suodatetut)
    }
  }

  hae()
}, [jarjestys, haku, alkuPaiva, loppuPaiva])


  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tapahtumat</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2">Järjestä:</label>
          <select value={jarjestys} onChange={(e) => setJarjestys(e.target.value as 'uusin' | 'vanhin' | 'tulevat')}
           className="border px-3 py-1 rounded">
            <option value="tulevat">Seuraavat tapahtumat</option>
            <option value="uusin">Uusin ensin</option>
            <option value="vanhin">Vanhin ensin</option>
          </select>
        </div>

        <input
          type="text"
          value={haku}
          onChange={(e) => setHaku(e.target.value)}
          placeholder="Hae otsikosta, kuvauksesta tai sijainnista..."
          className="border px-3 py-1 rounded w-full sm:w-64"
        />

        <div>
          <label className="block text-sm">Alkupäivä:</label>
          <input type="date" value={alkuPaiva} onChange={(e) => setAlkuPaiva(e.target.value)} className="border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Loppupäivä:</label>
          <input type="date" value={loppuPaiva} onChange={(e) => setLoppuPaiva(e.target.value)} className="border px-2 py-1 rounded" />
        </div>
      </div>

      {ilmoitukset.length === 0 ? (
        <p>Ei tapahtumia näytettäväksi.</p>
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
                <p className="text-xs text-gray-500 mt-1">{ilmo.sijainti}</p>
                {ilmo.tapahtuma_alku && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(ilmo.tapahtuma_alku).toLocaleDateString('fi-FI')} – {new Date(ilmo.tapahtuma_loppu).toLocaleDateString('fi-FI')}
                  </p>
                )}
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
