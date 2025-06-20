import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Etusivu = dynamic(() => import('./Etusivu').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return (
    <Suspense fallback={<div>Ladataan...</div>}>
      <Etusivu />
    </Suspense>
  )
}
