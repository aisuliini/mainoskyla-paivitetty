// src/app/page.tsx
import dynamic from 'next/dynamic'

const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false,
  loading: () => <p>Ladataan…</p>
})

export default function Page() {
  return <HomeClient />
}
