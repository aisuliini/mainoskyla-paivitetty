import { Suspense } from 'react'
import UnohditkoSalasananClient from '@/features/auth/components/UnohditkoSalasananClient'

export default function UnohditkoSalasananPage() {
  return (
    <Suspense fallback={<div>Ladataan...</div>}>
      <UnohditkoSalasananClient />
    </Suspense>
  )
}