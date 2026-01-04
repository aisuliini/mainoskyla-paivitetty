import type { Metadata } from 'next'
import ArjenPalvelutClientWrapper from './ArjenPalvelutClientWrapper'

export const metadata: Metadata = {
  title: 'ArjenPalvelut | Mainoskylä',
  description:
    'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/ArjenPalvelut' },
  openGraph: {
    title: 'ArjenPalvelut | Mainoskylä',
    description:
      'Löydä paikalliset palvelut eri aloilta tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/ArjenPalvelut',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <ArjenPalvelutClientWrapper />
}
