'use client'

import dynamic from 'next/dynamic'

const ElainpalvelutClient = dynamic(
  () => import('./ElainpalvelutClient').then((m) => m.default),
  { ssr: false }
)

export default function ElainpalvelutClientWrapper() {
  return <ElainpalvelutClient />
}
