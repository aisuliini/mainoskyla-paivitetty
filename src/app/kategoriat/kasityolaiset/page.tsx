import type { Metadata } from 'next'
import KasityolaisetClientWrapper from './KasityolaisetClientWrapper'

export const metadata: Metadata = {
  title: 'Käsityöläiset',
  description:
    'Löydä paikalliset käsityöläiset ja käsityöpalvelut tai ilmoita omat työsi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/kasityolaiset' },
  openGraph: {
    title: 'Käsityöläiset | Mainoskylä',
    description:
      'Löydä paikalliset käsityöläiset ja käsityöpalvelut tai ilmoita omat työsi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/kasityolaiset',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <KasityolaisetClientWrapper />
}
