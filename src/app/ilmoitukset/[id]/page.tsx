import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import IlmoitusClient from '@/features/listings/components/IlmoitusClient'
import { getListingById } from '@/features/listings/server/queries/getListingById'
import { getListingProfile } from '@/features/listings/server/queries/getListingProfile'

const siteUrl = 'https://mainoskyla.fi'
const fallbackImage = `${siteUrl}/og-mainoskyla.jpg`

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getListingById(id)

  const title = data?.otsikko
    ? `${data.otsikko} | Mainoskylä`
    : 'Ilmoitus | Mainoskylä'

  const description =
    (data?.kuvaus || 'Löydä paikalliset palvelut ja ilmoitukset Mainoskylästä.').slice(0, 160)

  const url = `${siteUrl}/ilmoitukset/${id}`
  const image = data?.kuva_url || fallbackImage

  return {
    title,
    description,
    alternates: {
      canonical: `/ilmoitukset/${id}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Mainoskylä',
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: data?.otsikko || 'Mainoskylä ilmoitus',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const ilmoitus = await getListingById(id)

  if (!ilmoitus) {
    notFound()
  }

  const profiili = await getListingProfile(ilmoitus.user_id)

  return (
    <IlmoitusClient
      initialIlmoitus={ilmoitus}
      initialProfiili={profiili}
    />
  )
}