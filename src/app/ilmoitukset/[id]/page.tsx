import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import IlmoitusClient from './IlmoitusClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const siteUrl = 'https://mainoskyla.fi'
const fallbackImage = `${siteUrl}/og-mainoskyla.jpg`

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params

  const { data } = await supabase
    .from('ilmoitukset')
    .select('otsikko, kuvaus, kuva_url')
    .eq('id', id)
    .single()

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

export default function Page() {
  return <IlmoitusClient />
}