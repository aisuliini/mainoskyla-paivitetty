import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

type Ilmoitus = {
  id: string
  otsikko: string
  sijainti?: string | null
  luotu: string | null
  visible?: boolean | null
  premium?: boolean | null
  saa_jakaa_somessa?: boolean | null
}

type Profiili = {
  id: string
  nimi?: string | null
}

type BannerRow = {
  id: string
  user_id: string
  city: string
  banner_url: string | null
  starts_at: string | null
  ends_at: string | null
  status: 'pending' | 'scheduled' | 'active' | 'rejected' | 'expired' | string
  payment_status: string | null
  created_at: string | null
}

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/kirjaudu')
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')

  if (adminError || !isAdmin) {
    redirect('/')
  }

  const [
    { data: ilmoituksetData, error: ilmoErr },
    { data: profiilitData, error: profErr },
    { data: banneritData, error: bannerErr },
  ] = await Promise.all([
    supabase
      .from('ilmoitukset')
      .select('id, otsikko, sijainti, luotu, visible, premium, saa_jakaa_somessa')
      .order('luotu', { ascending: false })
      .limit(200),

    supabase
      .from('profiles')
      .select('id, nimi')
      .limit(200),

    supabase
      .from('city_banners')
      .select('id, user_id, city, banner_url, starts_at, ends_at, status, payment_status, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  if (ilmoErr) {
    throw new Error(`ilmoitukset fetch error: ${ilmoErr.message}`)
  }

  if (profErr) {
    throw new Error(`profiles fetch error: ${profErr.message}`)
  }

  if (bannerErr) {
    throw new Error(`city_banners fetch error: ${bannerErr.message}`)
  }

  return (
    <AdminClient
      initialIlmoitukset={(ilmoituksetData ?? []) as Ilmoitus[]}
      initialProfiilit={(profiilitData ?? []) as Profiili[]}
      initialBannerit={(banneritData ?? []) as BannerRow[]}
    />
  )
}