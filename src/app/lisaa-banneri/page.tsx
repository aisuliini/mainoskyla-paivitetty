import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import LisaaBanneriClient from './LisaaBanneriClient'

export default async function LisaaBanneriPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/kirjaudu')
  }

  return <LisaaBanneriClient userId={user.id} />
}