'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'


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
  const [sivu, setSivu] = useState(1)

  const PER_PAGE = 24

  useEffect(() => {
  const haeIlmoitukset = async () => {
    const nytISO = new Date().toISOString()

    let query = supabase
      .from('ilmoitukset')
      .select('*')
      .or(`
        (premium = true AND premium_alku <= '${nytISO}'),
        (premium = false AND voimassa_alku <= '${nytISO}')
      `)
      .order('luotu', { ascending: false })

    if (valittuKategoria) {
      query = query.eq('kategoria', valittuKategoria)
    }

    const { data, error } = await query

    if (!error && data) {
      setIlmoitukset(data as Ilmoitus[])
    }

    setLoading(false)
  }

  haeIlmoitukset()
}, [valittuKategoria])

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

  const totalPages = Math.max(1, Math.ceil(suodatetut.length / PER_PAGE))
  const nykyisetIlmoitukset = suodatetut.slice(
    (sivu - 1) * PER_PAGE,
    sivu * PER_PAGE
  )

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#9ba88d]">Kaikki ilmoitukset</h1>

      {/* Kategoria-suodatin */}
      <select
        value={valittuKategoria}
        onChange={(e) => { setValittuKategoria(e.target.value); setSivu(1) }}
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
        onChange={(e) => { setHaku(e.target.value); setSivu(1) }}
        className="w-full p-2 mb-6 border rounded"
      />

      {loading ? (
        <p>Ladataan ilmoituksia...</p>
      ) : nykyisetIlmoitukset.length === 0 ? (
        <p>Ei löytynyt ilmoituksia haulla.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nykyisetIlmoitukset.map((ilmoitus) => (
<li key={ilmoitus.id} className="bg-[#f0e7e3] p-4 rounded shadow">
  {ilmoitus.kuva_url && (
    <div className="relative w-full h-40 mb-2">
      <Image
        src={ilmoitus.kuva_url}
        alt={ilmoitus.otsikko}
        fill
        style={{ objectFit: 'cover' }}
        className="rounded"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
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

          {/* Sivutus */}
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setSivu((s) => Math.max(1, s - 1))}
              disabled={sivu === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Edellinen
            </button>
            <span className="px-4 py-2">{sivu} / {totalPages}</span>
            <button
              onClick={() => setSivu((s) => Math.min(totalPages, s + 1))}
              disabled={sivu === totalPages}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Seuraava
            </button>
          </div>
        </>
      )}
    </section>
  )
}
