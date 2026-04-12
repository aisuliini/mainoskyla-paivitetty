import { supabaseServer } from '@/lib/supabaseServer'

export type ListingDetail = {
  id: string
  otsikko: string
  kuvaus?: string | null
  kuva_url?: string | null
  kuvat?: string | null
  nayttoja?: number | null
  luotu?: string | null
  voimassa_alku?: string | null
  voimassa_loppu?: string | null
  user_id?: string | null
  puhelin?: string | null
  sahkoposti?: string | null
  linkki?: string | null
  visible?: boolean | null
}

export async function getListingById(id: string): Promise<ListingDetail | null> {
  const { data, error } = await supabaseServer
    .from('ilmoitukset')
    .select(
      'id, otsikko, kuvaus, kuva_url, kuvat, nayttoja, luotu, voimassa_alku, voimassa_loppu, user_id, puhelin, sahkoposti, linkki, visible'
    )
    .eq('id', id)
    .eq('visible', true)
    .maybeSingle()

  if (error) {
    console.error('getListingById error:', error)
    return null
  }

  return (data as ListingDetail | null) ?? null
}