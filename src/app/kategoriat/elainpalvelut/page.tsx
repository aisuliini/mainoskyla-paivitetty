import type { Metadata } from 'next'
import ElainpalvelutClientWrapper from './ElainpalvelutClientWrapper'

export const metadata: Metadata = {
  title: 'Eläinpalvelut – Mainoskylä',
  description:
    'Löydä paikalliset eläinpalvelut: trimmaus, hoito, koulutus, koirien ulkoilutus ja muut palvelut omalta alueeltasi.',
  alternates: {
    canonical: 'https://mainoskyla.fi/kategoriat/elainpalvelut',
  },
  openGraph: {
    title: 'Eläinpalvelut – Mainoskylä',
    description:
      'Löydä paikalliset eläinpalvelut omalta alueeltasi. Selaa ilmoituksia ja ota yhteyttä suoraan.',
    url: 'https://mainoskyla.fi/kategoriat/elainpalvelut',
    siteName: 'Mainoskylä',
    type: 'website',
    locale: 'fi_FI',
  },
}

export default function Page() {
  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Eläinpalvelut</h1>
      <p className="text-sm text-gray-600 mb-6">
        Selaa paikallisia eläinpalveluita – trimmaus, hoito, koulutus ja muut palvelut omalta
        alueeltasi. Käytä hakua ja järjestystä löytääksesi sopivan tekijän.
      </p>

      <ElainpalvelutClientWrapper />
    </main>
  )
}
