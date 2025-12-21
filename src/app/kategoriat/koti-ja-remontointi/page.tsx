import type { Metadata } from 'next'
import KotiJaRemontointiClientWrapper from './KotiJaRemontointiClientWrapper'

export const metadata: Metadata = {
  title: 'Koti & Remontointi',
  description:
    'Löydä kodin ja remontoinnin palvelut tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/koti-ja-remontointi' },
  openGraph: {
    title: 'Koti & Remontointi | Mainoskylä',
    description:
      'Löydä kodin ja remontoinnin palvelut tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/koti-ja-remontointi',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <KotiJaRemontointiClientWrapper />
}
