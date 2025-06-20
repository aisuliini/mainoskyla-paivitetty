import dynamic from 'next/dynamic'

const PalvelutClient = dynamic(() => import('./PalvelutClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <PalvelutClient />
}
