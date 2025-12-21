'use client'

import dynamic from 'next/dynamic'

const MediaJaLuovuusClient = dynamic(() => import('./MediaJaLuovuusClient'), {
  ssr: false,
})

export default function MediaJaLuovuusClientWrapper() {
  return <MediaJaLuovuusClient />
}
