import dynamic from 'next/dynamic'

const ElainpalvelutClient = dynamic(() => import('./ElainpalvelutClient').then(mod => mod.default), {
  ssr: false,
})

export default function Page() {
  return <ElainpalvelutClient />
}
