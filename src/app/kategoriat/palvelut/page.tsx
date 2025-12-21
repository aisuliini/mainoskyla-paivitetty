import type { Metadata } from 'next'
import PalvelutClientWrapper from './PalvelutClientWrapper'

export const metadata: Metadata = {
  title: 'Palvelut',
  description:
    'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/palvelut' },
  openGraph: {
    title: 'Palvelut | Mainoskylä',
    description:
      'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/palvelut',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <PalvelutClientWrapper />
}
