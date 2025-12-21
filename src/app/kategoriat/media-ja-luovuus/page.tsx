import type { Metadata } from 'next'
import MediaJaLuovuusClientWrapper from './MediaJaLuovuusClientWrapper'

export const metadata: Metadata = {
  title: 'Media & Luovuus',
  description:
    'Löydä media- ja luovat palvelut (kuvaus, video, design, some) tai ilmoita omat palvelusi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/media-ja-luovuus' },
  openGraph: {
    title: 'Media & Luovuus | Mainoskylä',
    description:
      'Löydä media- ja luovat palvelut (kuvaus, video, design, some) tai ilmoita omat palvelusi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/media-ja-luovuus',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <MediaJaLuovuusClientWrapper />
}
