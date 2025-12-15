import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ElainpalvelutClient = dynamic(
  () => import('./ElainpalvelutClient').then(mod => mod.default),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'Eläinpalvelut – Mainoskylä',
  description:
    'Löydä paikalliset eläinpalvelut: trimmaus, hoito, koulutus, koirien ulkoilutus ja muut palvelut omalta alueeltasi.',
  alternates: {
    canonical: 'https://mainoskyla.fi/elainpalvelut',
  },
  openGraph: {
    title: 'Eläinpalvelut – Mainoskylä',
    description:
      'Löydä paikalliset eläinpalvelut omalta alueeltasi. Selaa ilmoituksia ja ota yhteyttä suoraan.',
    url: 'https://mainoskyla.fi/elainpalvelut',
    siteName: 'Mainoskylä',
    type: 'website',
    locale: 'fi_FI',
  },
}

export default function Page() {
  return <ElainpalvelutClient />
}
