'use client'

import dynamic from 'next/dynamic'

const HyvinvointiJaKauneusClient = dynamic(
  () => import('./HyvinvointiJaKauneusClient'),
  { ssr: false }
)

export default function HyvinvointiJaKauneusClientWrapper() {
  return <HyvinvointiJaKauneusClient />
}
