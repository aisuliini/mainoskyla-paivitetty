'use client'

import dynamic from 'next/dynamic'

const HyvinvointiJaKauneusClient = dynamic(() => import('./HyvinvointiJaKauneusClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <HyvinvointiJaKauneusClient />
}
