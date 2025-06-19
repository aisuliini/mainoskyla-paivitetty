'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url: string
  kategoria: string
  luotu: string
  nayttoja?: number 
}

export default function IlmoituksetSivu() {
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [loading, setLoading] = useState(true)
  const [haku, setHaku] = useState('')
  const [valittuKategoria, setValittuKategoria] = useState('')

  useEffect(() => {
    const haeIlmoitukset = async () => {
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .order('luotu', { ascending: false })

      if (!error && data) {
        setIlmoitukset(data as Ilmoitus[])
      }

      setLoading(false)
    }

    haeIlmoitukset()
  }, [])

  const kategoriat = Array.from(
    new Set(ilmoitukset.map((i) => i.kategoria).filter(Boolean))
  )

  const suodatetut = ilmoitukset
    .filter((ilmo) =>
      (ilmo.otsikko + ilmo.kuvaus + ilmo.sijainti)
        .toLowerCase()
        .includes(haku.toLowerCase())
    )
    .filter((ilmo) =>
      valittuKategoria ? ilmo.kategoria === valittuKategoria : true
    )

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#9ba88d]">Kaikki ilmoitukset</h1>

      {/* Kategoria-suodatin */}
      <select
        value={valittuKategoria}
        onChange={(e) => setValittuKategoria(e.target.value)}
        className="mb-4 border p-2 rounded"
      >
        <option value="">Kaikki kategoriat</option>
        {kategoriat.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      {/* Hakukenttä */}
      <input
        type="text"
        placeholder="Hae ilmoituksia..."
        value={haku}
        onChange={(e) => setHaku(e.target.value)}
        className="w-full p-2 mb-6 border rounded"
      />

      {loading ? (
        <p>Ladataan ilmoituksia...</p>
      ) : suodatetut.length === 0 ? (
        <p>Ei löytynyt ilmoituksia haulla.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suodatetut.map((ilmoitus) => (
            <li key={ilmoitus.id} className="bg-[#f0e7e3] p-4 rounded shadow">
              {ilmoitus.kuva_url && (
                <img
                  src={ilmoitus.kuva_url}
                  alt={ilmoitus.otsikko}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="font-semibold text-lg text-[#4a7c59] break-words line-clamp-2">
                {ilmoitus.otsikko}
              </h2>

              <p className="text-sm text-[#333]">{ilmoitus.kuvaus}</p>
              <p className="text-xs text-[#777] mt-2">{ilmoitus.sijainti}</p>

              <p className="text-xs text-[#aaa]">
                Julkaistu:{' '}
                {new Date(ilmoitus.luotu).toLocaleDateString('fi-FI', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' klo '}
                {new Date(ilmoitus.luotu).toLocaleTimeString('fi-FI', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>

              <p className="text-xs text-[#444] mt-1 italic">{ilmoitus.kategoria}</p>
                <p className="text-xs text-gray-500 mt-1">
                👁️ {ilmoitus.nayttoja || 0} katselukertaa
                </p>

              <Link
                href={`/ilmoitukset/${ilmoitus.id}`}
                className="inline-block mt-2 text-sm text-blue-600 underline"
              >
                Katso ilmoitus
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
