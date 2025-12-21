import type { Metadata } from 'next'
import VuokratilatJaJuhlapaikatClientWrapper from './VuokratilatJaJuhlapaikatClientWrapper'

export const metadata: Metadata = {
  title: 'Vuokratilat & Juhlapaikat',
  description:
    'Löydä vuokratilat ja juhlapaikat juhliin, tapahtumiin ja tilaisuuksiin tai ilmoita oma tilasi Mainoskylässä.',
  alternates: { canonical: '/kategoriat/vuokratilat-ja-juhlapaikat' },
  openGraph: {
    title: 'Vuokratilat & Juhlapaikat | Mainoskylä',
    description:
      'Löydä vuokratilat ja juhlapaikat juhliin, tapahtumiin ja tilaisuuksiin tai ilmoita oma tilasi Mainoskylässä.',
    url: 'https://mainoskyla.fi/kategoriat/vuokratilat-ja-juhlapaikat',
    images: ['/og.jpg'],
  },
}

export default function Page() {
  return <VuokratilatJaJuhlapaikatClientWrapper />
}
