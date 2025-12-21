'use client'

import dynamic from 'next/dynamic'

const VuokratilatJaJuhlapaikatClient = dynamic(
  () => import('./VuokratilatJaJuhlapaikatClient'),
  { ssr: false }
)

export default function VuokratilatJaJuhlapaikatClientWrapper() {
  return <VuokratilatJaJuhlapaikatClient />
}
