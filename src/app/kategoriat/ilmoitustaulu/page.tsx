import dynamic from 'next/dynamic'

const IlmoitustauluClient = dynamic(() => import('./IlmoitustauluClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <IlmoitustauluClient />
}
