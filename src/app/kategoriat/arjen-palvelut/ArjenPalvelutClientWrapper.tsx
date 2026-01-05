'use client'

import dynamic from 'next/dynamic'

const ArjenPalvelutClient = dynamic(() => import('./ArjenPalvelutClient'), {
  ssr: false,
})

export default function ArjenPalvelutClientWrapper() {
  return <ArjenPalvelutClient />
}
