'use client'

import dynamic from 'next/dynamic'

const PalvelutClient = dynamic(() => import('./ArjenPalvelutClient'), {
  ssr: false,
})

export default function PalvelutClientWrapper() {
  return <PalvelutClient />
}
