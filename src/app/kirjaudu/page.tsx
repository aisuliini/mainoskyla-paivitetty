import { Suspense } from 'react'
import KirjauduClient from '@/features/auth/components/KirjauduClient'

export default function KirjauduPage() {
  return (
    <Suspense fallback={<div>Ladataan...</div>}>
      <KirjauduClient />
    </Suspense>
  )
}