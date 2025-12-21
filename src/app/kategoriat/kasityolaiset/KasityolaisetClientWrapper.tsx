'use client'

import dynamic from 'next/dynamic'

const KasityolaisetClient = dynamic(
  () => import('./KasityolaisetClient'),
  { ssr: false }
)

export default function KasityolaisetClientWrapper() {
  return <KasityolaisetClient />
}
