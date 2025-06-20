import dynamic from 'next/dynamic'

const KasityolaisetClient = dynamic(() => import('./KasityolaisetClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <KasityolaisetClient />
}
