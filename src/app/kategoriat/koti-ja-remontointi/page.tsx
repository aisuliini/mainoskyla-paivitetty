'use client'

import dynamic from 'next/dynamic'

const KotiJaRemontointiClient = dynamic(() => import('./KotiJaRemontointiClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <KotiJaRemontointiClient />
}
