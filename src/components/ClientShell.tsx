'use client'

import type { ReactNode } from 'react'
import IdleLogout from '@/components/IdleLogout'

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <>
      <IdleLogout />
      {children}
    </>
  )
}