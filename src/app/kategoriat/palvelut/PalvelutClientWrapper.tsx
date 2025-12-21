'use client'

import dynamic from 'next/dynamic'

const PalvelutClient = dynamic(() => import('./PalvelutClient'), {
  ssr: false,
})

export default function PalvelutClientWrapper() {
  return <PalvelutClient />
}
