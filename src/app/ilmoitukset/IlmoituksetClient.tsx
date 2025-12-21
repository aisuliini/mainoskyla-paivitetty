'use client'

import Link from 'next/link'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus?: string | null
  sijainti?: string | null
  kuva_url?: string | null
  kategoria?: string | null
  luotu?: string | null
  nayttoja?: number | null
}

export default function IlmoituksetClient({
  initialIlmoitukset,
}: {
  initialIlmoitukset: Ilmoitus[]
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kaikki ilmoitukset</h1>

      {initialIlmoitukset.map((ilmoitus) => (
        <div key={ilmoitus.id} className="mb-4">
          <h2 className="font-semibold">{ilmoitus.otsikko}</h2>
          <Link className="underline" href={`/ilmoitukset/${ilmoitus.id}`}>
            Katso ilmoitus
          </Link>
        </div>
      ))}
    </section>
  )
}
