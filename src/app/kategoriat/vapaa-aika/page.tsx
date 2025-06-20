import dynamic from 'next/dynamic'

const VapaaAikaClient = dynamic(() => import('./VapaaAikaClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <VapaaAikaClient />
}
