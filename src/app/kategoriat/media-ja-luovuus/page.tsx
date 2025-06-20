import dynamic from 'next/dynamic'

const MediaJaLuovuusClient = dynamic(() => import('./MediaJaLuovuusClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <MediaJaLuovuusClient />
}
