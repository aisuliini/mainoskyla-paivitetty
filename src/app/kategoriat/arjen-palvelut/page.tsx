import type { Metadata } from 'next'
import ArjenPalvelutClientWrapper from './ArjenPalvelutClientWrapper'

export const metadata: Metadata = {
  title: 'Arjen Palvelut | Mainoskylä',
  description:
    'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/ArjenPalvelut' },
  openGraph: {
    title: 'Arjen Palvelut | Mainoskylä',
    description:
      'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/ArjenPalvelut',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <ArjenPalvelutClientWrapper />
}
