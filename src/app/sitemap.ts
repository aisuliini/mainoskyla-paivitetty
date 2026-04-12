import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { CATEGORY_CONFIG } from '@/features/categories/config/category-config'

const SITE_URL = 'https://mainoskyla.fi'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/ilmoitukset'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/haku'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/aluehaku'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/hinnasto'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/tietoa'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/turvallisuus'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/tietosuoja'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/ehdot'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/yhteystiedot'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_CONFIG.map((category) => ({
    url: absoluteUrl(`/kategoriat/${category.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  try {
    const { data, error } = await supabase
      .from('ilmoitukset')
      .select('id, luotu')
      .eq('visible', true)

    if (error) {
      console.error('Sitemap ilmoitushaku epäonnistui:', error.message)
      return [...staticRoutes, ...categoryRoutes]
    }

    const listingRoutes: MetadataRoute.Sitemap =
      data?.map((ilmoitus) => ({
        url: absoluteUrl(`/ilmoitukset/${ilmoitus.id}`),
        lastModified: ilmoitus.luotu ? new Date(ilmoitus.luotu) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })) ?? []

    return [...staticRoutes, ...categoryRoutes, ...listingRoutes]
  } catch (error) {
    console.error('Sitemap generointi epäonnistui:', error)
    return [...staticRoutes, ...categoryRoutes]
  }
}