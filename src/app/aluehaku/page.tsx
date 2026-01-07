'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string | null
  luotu?: string | null
}

function AluehakuSisalto() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // ✅ PRO-malli:
  // - q = "mitä etsit?" (tulee Headerin hausta)
  // - sijainti = "missä?" (tällä sivulla suodatetaan)
  //
  // HUOM: jos sulla oli vanha malli jossa käytit ?sijainti= hakusanana,
  // se toimii edelleen jos q puuttuu ja sijainti-parametria käytetään hakusanana.
  const qParam = (searchParams.get('q') || '').trim()
  const sijaintiParam = (searchParams.get('sijainti') || '').trim()

  // Backward compatibility vanhaan (sun nykyinen koodi käytti sijainti-paramia hakusanana)
  const hakusana = qParam || (qParam === '' && sijaintiParam ? sijaintiParam : '')

  // Paikkakuntafiltteri (vain jos q on käytössä – muuten sitä ei ole järkeä pakottaa)
  const [paikkakunta, setPaikkakunta] = useState<string>(qParam ? sijaintiParam : '')

  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [loading, setLoading] = useState(false)

  // Pidä input synkassa URLin kanssa (esim. back/forward)
  useEffect(() => {
    setPaikkakunta(qParam ? sijaintiParam : '')
  }, [qParam, sijaintiParam])

  const otsikkoTeksti = useMemo(() => {
    if (!hakusana) return 'Haku'
    if (qParam && sijaintiParam) return `Hakutulokset: ${qParam} — ${sijaintiParam}`
    return `Hakutulokset: ${hakusana}`
  }, [hakusana, qParam, sijaintiParam])

  useEffect(() => {
    const hae = async () => {
      if (!hakusana) {
        setIlmoitukset([])
        return
      }

      setLoading(true)
      const nytISO = new Date().toISOString()

      let query = supabase
        .from('ilmoitukset')
        .select('id, otsikko, kuvaus, sijainti, kuva_url, luotu')
        // voimassaoloehdot (sama kuin sulla)
        .or(
          `and(voimassa_alku.is.null,voimassa_loppu.is.null),
           and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
           and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
           and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
        )

      // ✅ "MITÄ" haku (otsikko/kuvaus/sijainti) – kun q on käytössä, haetaan sillä
      // (Jos tullaan vanhalla paramilla, hakusana voi olla sijaintiParam, mutta toimii silti.)
      query = query.or(
        `otsikko.ilike.%${hakusana}%,
         kuvaus.ilike.%${hakusana}%,
         sijainti.ilike.%${hakusana}%`.replace(/\s+/g, '')
      )

      // ✅ "MISSÄ" suodatin (vain kun q-param on käytössä eli ollaan PRO-mallissa)
      if (qParam && sijaintiParam) {
        query = query.ilike('sijainti', `%${sijaintiParam}%`)
      }

      const { data, error } = await query.order('luotu', { ascending: false }).limit(60)

      if (error) {
        console.error('Aluehaku virhe:', error.message)
        setIlmoitukset([])
      } else {
        setIlmoitukset((data as Ilmoitus[]) ?? [])
      }

      setLoading(false)
    }

    hae()
  }, [hakusana, qParam, sijaintiParam])

  const paivitaPaikkakuntaURL = () => {
    if (!qParam) return // jos ei q:ta, tätä filtteriä ei käytetä
    const next = new URLSearchParams(searchParams.toString())

    const value = paikkakunta.trim()
    if (!value) next.delete('sijainti')
    else next.set('sijainti', value)

    router.replace(`/aluehaku?${next.toString()}`)
  }

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      {!hakusana ? (
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold mb-2">Haku</h1>
          <p className="text-gray-600">
            Kirjoita hakusana yläpalkin hakuun (esim. doula), niin näytän tulokset tässä.
            <br />
            Tällä sivulla voit rajata tuloksia paikkakunnalla.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{otsikkoTeksti}</h1>

          {/* ✅ TÄRKEIN MUUTOS: ei toista "Mitä etsit?" -kenttää täällä.
              Täällä on vain "MISSÄ" eli paikkakuntafiltteri (PRO-malli). */}
          {qParam ? (
            <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="w-full sm:max-w-sm">
                <label className="block text-sm font-medium mb-1">📍 Paikkakunta (valinnainen)</label>
                <input
                  value={paikkakunta}
                  onChange={(e) => setPaikkakunta(e.target.value)}
                  placeholder="Esim. Turku"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={paivitaPaikkakuntaURL}
                  className="px-4 py-2 text-sm bg-[#3f704d] text-white rounded hover:bg-[#2f5332]"
                >
                  Rajaa
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaikkakunta('')
                    const next = new URLSearchParams(searchParams.toString())
                    next.delete('sijainti')
                    router.replace(`/aluehaku?${next.toString()}`)
                  }}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  Tyhjennä
                </button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <p>Ladataan tuloksia...</p>
          ) : ilmoitukset.length === 0 ? (
            <p>Ei tuloksia haulle.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {ilmoitukset.map((ilmo) => (
                <div key={ilmo.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="relative w-full h-40 bg-gray-100">
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
        </>
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
