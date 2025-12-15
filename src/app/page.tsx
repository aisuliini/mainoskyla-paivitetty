import type { Metadata } from 'next'
import HomeClientWrapper from '@/app/HomeClientWrapper'


export const metadata: Metadata = {
  title: 'Mainoskylä – Löydä tai mainosta paikallisesti',
  description:
    'Mainoskylä yhdistää ihmiset ja yritykset. Löydä paikalliset palvelut ja tekijät tai lisää oma ilmoituksesi helposti.',
  alternates: { canonical: 'https://mainoskyla.fi/' },
  openGraph: {
    title: 'Mainoskylä – Löydä tai mainosta paikallisesti',
    description:
      'Löydä paikalliset palvelut ja tekijät tai lisää oma ilmoitus Mainoskylään.',
    url: 'https://mainoskyla.fi/',
    siteName: 'Mainoskylä',
    type: 'website',
    locale: 'fi_FI',
  },
}

export default function Page() {
  return <HomeClientWrapper />
}
