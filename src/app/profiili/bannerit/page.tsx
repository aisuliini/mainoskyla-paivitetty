import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import BanneritClient from './BanneritClient'

export default async function BanneritSivu() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/kirjaudu')
  }

  return <BanneritClient userId={user.id} />
}