import type { Metadata } from 'next'
import ArjenPalvelutClientWrapper from './ArjenPalvelutClientWrapper'

export const metadata: Metadata = {
  title: 'Arjen palvelut | Mainoskylä',
  description:
    'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/arjen-palvelut' },
openGraph: {
    title: 'Arjen palvelut | Mainoskylä',
    description:
      'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/arjen-palvelut',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <ArjenPalvelutClientWrapper />
}
