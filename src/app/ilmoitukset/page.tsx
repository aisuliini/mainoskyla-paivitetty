import { createClient } from '@supabase/supabase-js'
import IlmoituksetClient from './IlmoituksetClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Page() {
  const { data } = await supabase
    .from('ilmoitukset')
    .select('*')
    .order('luotu', { ascending: false })

  return <IlmoituksetClient initialIlmoitukset={data ?? []} />
}
