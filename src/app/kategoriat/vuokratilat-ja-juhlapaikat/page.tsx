import dynamic from 'next/dynamic'

const VuokratilatJaJuhlapaikatClient = dynamic(() => import('./VuokratilatJaJuhlapaikatClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <VuokratilatJaJuhlapaikatClient />
}
