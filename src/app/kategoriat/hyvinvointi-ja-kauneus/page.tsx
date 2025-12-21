import type { Metadata } from 'next'
import HyvinvointiJaKauneusClientWrapper from './HyvinvointiJaKauneusClientWrapper'

export const metadata: Metadata = {
  title: 'Hyvinvointi & Kauneus',
  description:
    'Löydä hyvinvointi- ja kauneuspalvelut läheltäsi tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/hyvinvointi-ja-kauneus' },
  openGraph: {
    title: 'Hyvinvointi & Kauneus | Mainoskylä',
    description:
      'Löydä hyvinvointi- ja kauneuspalvelut läheltäsi tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/hyvinvointi-ja-kauneus',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <HyvinvointiJaKauneusClientWrapper />
}
