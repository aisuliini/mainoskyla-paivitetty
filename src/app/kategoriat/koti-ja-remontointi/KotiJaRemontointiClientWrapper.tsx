'use client'

import dynamic from 'next/dynamic'

const KotiJaRemontointiClient = dynamic(
  () => import('./KotiJaRemontointiClient'),
  { ssr: false }
)

export default function KotiJaRemontointiClientWrapper() {
  return <KotiJaRemontointiClient />
}
