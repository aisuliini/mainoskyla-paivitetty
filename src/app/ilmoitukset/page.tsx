import IlmoituksetClient from './IlmoituksetClient'
import { supabase } from '@/lib/supabaseClient'

export default async function Page() {
  const { data, error } = await supabase
    .from('ilmoitukset')
    .select('id, otsikko, kuvaus, sijainti, kuva_url, kategoria, luotu, nayttoja')
    .eq('visible', true)
    .order('luotu', { ascending: false })

  if (error) {
    throw new Error(`Ilmoitusten haku epäonnistui: ${error.message}`)
  }

  return <IlmoituksetClient initialIlmoitukset={data ?? []} />
}