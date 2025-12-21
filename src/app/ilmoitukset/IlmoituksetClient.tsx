import type { Metadata } from 'next'
import type { PageProps } from 'next'
import { createClient } from '@supabase/supabase-js'
import IlmoitusClient from './IlmoitusClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const id = (props.params as { id?: string })?.id

  if (!id) {
    return {
      title: 'Ilmoitus',
      description: '',
      robots: { index: false, follow: false },
    }
  }

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
