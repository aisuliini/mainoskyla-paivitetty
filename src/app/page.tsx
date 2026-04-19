import type { Metadata } from 'next'
import HomeClient from '@/features/home/components/HomeClient'
import { getHomePageData } from '@/features/home/server/home'

export const dynamic = 'force-dynamic'

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

export default async function Page() {
  const { premium, suosittua, uusimmat } = await getHomePageData()

  const taydellisetPremiumit = [...premium]
  const tyhjiaPaikkoja = Math.max(0, 6 - taydellisetPremiumit.length)

  for (let i = 0; i < tyhjiaPaikkoja; i++) {
    taydellisetPremiumit.push({
      id: `tyhja-${i}`,
      otsikko: 'Varaa etusivupaikka',
      kuvaus: 'Nosta palvelusi näkyvästi esiin Mainoskylän etusivulla.',
      sijainti: '',
      kuva_url: '',
      nayttoja: 0,
    })
  }

  return (
    <HomeClient
      initialPremiumIlmoitukset={taydellisetPremiumit}
      initialNytSuosittua={suosittua}
      initialUusimmat={uusimmat}
    />
  )
}