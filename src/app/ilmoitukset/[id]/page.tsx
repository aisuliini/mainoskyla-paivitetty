import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import IlmoitusClient from './IlmoitusClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { data } = await supabase
    .from('ilmoitukset')
    .select('otsikko, kuvaus')
    .eq('id', params.id)
    .single()

  return {
    title: data?.otsikko || 'Ilmoitus',
    description: (data?.kuvaus || '').slice(0, 160),
    alternates: { canonical: `/ilmoitukset/${params.id}` },
  }
}

export default function Page() {
  return <IlmoitusClient />
}
