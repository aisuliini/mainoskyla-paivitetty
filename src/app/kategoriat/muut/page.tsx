import dynamic from 'next/dynamic'

const MuutClient = dynamic(() => import('./MuutClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <MuutClient />
}
