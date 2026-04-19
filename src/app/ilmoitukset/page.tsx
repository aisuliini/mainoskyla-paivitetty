import IlmoituksetClient from '@/features/listings/components/IlmoituksetClient'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { data, error } = await supabaseServer
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, kategoria, luotu, nayttoja')
    .eq('visible', true)
    .order('luotu', { ascending: false })

  if (error) {
    throw new Error(`Ilmoitusten haku epäonnistui: ${error.message}`)
  }

  return <IlmoituksetClient initialIlmoitukset={data ?? []} />
}