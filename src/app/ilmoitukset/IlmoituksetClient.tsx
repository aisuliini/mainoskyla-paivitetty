'use client'

import Link from 'next/link'

export default function IlmoituksetClient({
  initialIlmoitukset,
}: {
  initialIlmoitukset: any[]
}) {
  return (
    <section>
      <h1>Kaikki ilmoitukset</h1>

      {initialIlmoitukset.map((ilmoitus) => (
        <div key={ilmoitus.id}>
          <h2>{ilmoitus.otsikko}</h2>

          <Link href={`/ilmoitukset/${ilmoitus.id}`}>
            Katso ilmoitus
          </Link>
        </div>
      ))}
    </section>
  )
}
