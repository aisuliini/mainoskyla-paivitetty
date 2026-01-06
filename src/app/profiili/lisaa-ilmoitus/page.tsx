'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LisaaIlmoitusRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/lisaa')
  }, [router])

  return null
}
