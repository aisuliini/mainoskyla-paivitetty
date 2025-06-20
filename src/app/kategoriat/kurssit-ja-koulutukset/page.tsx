'use client'

import dynamic from 'next/dynamic'

const KurssitJaKoulutuksetClient = dynamic(() => import('./KurssitJaKoulutuksetClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <KurssitJaKoulutuksetClient />
}
