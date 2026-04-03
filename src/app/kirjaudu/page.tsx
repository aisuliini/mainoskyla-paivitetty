import { Suspense } from 'react'
import type { Metadata } from 'next'
import KirjauduClient from './KirjauduClient'

export const metadata: Metadata = {
  title: 'Kirjaudu | Mainoskylä',
  description: 'Kirjaudu Mainoskylään hallitaksesi ja muokataksesi omia ilmoituksiasi.',
}

export default function KirjauduPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-2 text-[#1E3A41]">Kirjaudu</h1>
          <p className="text-sm text-charcoal/70">Ladataan…</p>
        </main>
      }
    >
      <KirjauduClient />
    </Suspense>
  )
}