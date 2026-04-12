'use client'

import Link from 'next/link'
import SafeCardImage from '@/components/shared/SafeCardImage'

type Ilmoitus = {
  id: string
  otsikko: string | null
  kuvaus: string | null
  sijainti: string | null
  kuva_url: string | null
  kategoria: string | null
  luotu: string | null
  nayttoja: number | null
}

export default function IlmoituksetClient({
  initialIlmoitukset,
}: {
  initialIlmoitukset: Ilmoitus[]
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ilmoitukset</h1>

      {initialIlmoitukset.length === 0 ? (
        <p className="text-gray-600">Ei ilmoituksia.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialIlmoitukset.map((ilmoitus) => (
            <Link
              key={ilmoitus.id}
              href={`/ilmoitukset/${ilmoitus.id}`}
              className="block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full">
                <SafeCardImage
                  src={ilmoitus.kuva_url}
                  alt={ilmoitus.otsikko || 'Ilmoitus'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold break-words">
                  {ilmoitus.otsikko || 'Ilmoitus'}
                </h2>

                {ilmoitus.sijainti && (
                  <p className="mt-1 text-sm text-gray-500">{ilmoitus.sijainti}</p>
                )}

                {ilmoitus.kategoria && (
                  <p className="mt-1 text-sm text-gray-500">{ilmoitus.kategoria}</p>
                )}

                {ilmoitus.kuvaus && (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3 whitespace-pre-line">
                    {ilmoitus.kuvaus}
                  </p>
                )}

                <p className="mt-3 text-xs text-gray-400">
                  Katselukerrat: {ilmoitus.nayttoja ?? 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}