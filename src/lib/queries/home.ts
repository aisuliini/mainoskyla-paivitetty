import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getHomePageData() {
  const nytISO = new Date().toISOString()

  const premiumQuery = supabase
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja')
    .eq('maksuluokka', 'premium')
    .eq('premium', true)
    .eq('premium_tyyppi', 'etusivu')
    .order('luotu', { ascending: false })
    .limit(60)

  const suosittuaQuery = supabase
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja, kategoria, luotu')
    .or(
      `and(voimassa_alku.is.null,voimassa_loppu.is.null),
       and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
       and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
       and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
    )
    .order('nayttoja', { ascending: false })
    .order('luotu', { ascending: false })
    .limit(12)

  const uusimmatQuery = supabase
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja, kategoria, luotu')
    .or(
      `and(voimassa_alku.is.null,voimassa_loppu.is.null),
       and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
       and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
       and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
    )
    .order('luotu', { ascending: false })
    .limit(12)

  const [premiumRes, suosittuaRes, uusimmatRes] = await Promise.all([
    premiumQuery,
    suosittuaQuery,
    uusimmatQuery,
  ])

  return {
    premium: premiumRes.data ?? [],
    suosittua: suosittuaRes.data ?? [],
    uusimmat: uusimmatRes.data ?? [],
  }
}