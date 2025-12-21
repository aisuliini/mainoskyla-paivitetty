import type { Metadata } from 'next'
import TapahtumatClientWrapper from './TapahtumatClientWrapper'

export const metadata: Metadata = {
  title: 'Tapahtumat',
  description:
    'Löydä tulevat tapahtumat ja elämykset tai ilmoita oma tapahtumasi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/tapahtumat' },
  openGraph: {
    title: 'Tapahtumat | Mainoskylä',
    description:
      'Löydä tulevat tapahtumat ja elämykset tai ilmoita oma tapahtumasi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/tapahtumat',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <TapahtumatClientWrapper />
}
