'use client'

import dynamic from 'next/dynamic'

const Etusivu = dynamic(() => import('./Etusivu').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <Etusivu />
}
