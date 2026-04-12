import { supabaseServer } from '@/lib/supabaseServer'

export async function getHomePageData() {
  const nytISO = new Date().toISOString()

  const aktiivinenEhto = `and(voimassa_alku.is.null,voimassa_loppu.is.null),
and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),
and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),
and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')

  const premiumQuery = supabaseServer
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja')
    .eq('visible', true)
    .eq('maksuluokka', 'premium')
    .eq('premium', true)
    .eq('premium_tyyppi', 'etusivu')
    .or(aktiivinenEhto)
    .order('luotu', { ascending: false })
    .limit(60)

  const suosittuaQuery = supabaseServer
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja, kategoria, luotu')
    .eq('visible', true)
    .or(aktiivinenEhto)
    .order('nayttoja', { ascending: false })
    .order('luotu', { ascending: false })
    .limit(12)

  const uusimmatQuery = supabaseServer
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, nayttoja, kategoria, luotu')
    .eq('visible', true)
    .or(aktiivinenEhto)
    .order('luotu', { ascending: false })
    .limit(12)

  const [premiumRes, suosittuaRes, uusimmatRes] = await Promise.all([
    premiumQuery,
    suosittuaQuery,
    uusimmatQuery,
  ])

  if (premiumRes.error) {
    console.error('getHomePageData premium error:', premiumRes.error)
  }

  if (suosittuaRes.error) {
    console.error('getHomePageData suosittua error:', suosittuaRes.error)
  }

  if (uusimmatRes.error) {
    console.error('getHomePageData uusimmat error:', uusimmatRes.error)
  }

  return {
    premium: premiumRes.data ?? [],
    suosittua: suosittuaRes.data ?? [],
    uusimmat: uusimmatRes.data ?? [],
  }
}