'use client'

import dynamic from 'next/dynamic'

const TapahtumatClient = dynamic(
  () => import('./TapahtumatClient'),
  { ssr: false }
)

export default function TapahtumatClientWrapper() {
  return <TapahtumatClient />
}
