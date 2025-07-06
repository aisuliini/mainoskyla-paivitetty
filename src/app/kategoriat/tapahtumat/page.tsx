'use client'

import dynamic from 'next/dynamic'

const TapahtumatClient = dynamic(() => import('./TapahtumatClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <TapahtumatClient />
}
