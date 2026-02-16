// app/haku/page.tsx
import { Suspense } from 'react'
import HakuClient from './HakuClient'

export default function HakuPage() {
  return (
    <Suspense fallback={<HakuFallback />}>
      <HakuClient />
    </Suspense>
  )
}

function HakuFallback() {
  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-black/5" />
          <div className="h-12 flex-1 rounded-full bg-black/5" />
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-5 space-y-3">
        <div className="h-4 w-28 bg-black/10 rounded" />
        <div className="h-12 w-full bg-black/5 rounded-2xl" />
        <div className="h-12 w-full bg-black/5 rounded-2xl" />
        <div className="h-12 w-full bg-black/5 rounded-2xl" />
      </div>
    </main>
  )
}
