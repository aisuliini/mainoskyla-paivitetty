import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1️⃣ Perussivut
  const urls: MetadataRoute.Sitemap = [
    {
      url: 'https://mainoskyla.fi',
      lastModified: new Date(),
    },
    {
      url: 'https://mainoskyla.fi/ilmoitukset',
      lastModified: new Date(),
    },
  ]

  // 2️⃣ Hae kaikki ilmoitukset
  const { data } = await supabase
    .from('ilmoitukset')
    .select('id, luotu')

  if (data) {
    data.forEach((ilmoitus) => {
      urls.push({
        url: `https://mainoskyla.fi/ilmoitukset/${ilmoitus.id}`,
        lastModified: ilmoitus.luotu
          ? new Date(ilmoitus.luotu)
          : new Date(),
      })
    })
  }

  return urls
}
