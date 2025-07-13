// src/app/page.tsx

'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false
})

export default function Page() {
  return (
    <Suspense fallback={<p>Ladataan…</p>}>
      <HomeClient />
    </Suspense>
  )
}
