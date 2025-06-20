'use client'

import dynamic from 'next/dynamic'

const PientuottajatClient = dynamic(() => import('./PientuottajatClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <PientuottajatClient />
}
