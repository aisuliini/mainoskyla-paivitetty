import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import IlmoitusClient from './IlmoitusClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params

  const { data } = await supabase
    .from('ilmoitukset')
    .select('otsikko, kuvaus')
    .eq('id', id)
    .single()

  return {
    title: data?.otsikko || 'Ilmoitus',
    description: (data?.kuvaus || '').slice(0, 160),
    alternates: { canonical: `/ilmoitukset/${id}` },
  }
}

export default function Page() {
  return <IlmoitusClient />
}
