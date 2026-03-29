import { supabaseServer } from '@/lib/supabaseServer'

export type ListingProfile = {
  nimi?: string | null
  kuva_url?: string | null
  admin?: boolean | null
  is_admin?: boolean | null
}

export async function getListingProfile(userId?: string | null): Promise<ListingProfile | null> {
  if (!userId) return null

  const { data, error } = await supabaseServer
    .from('profiles')
    .select('nimi, kuva_url, admin, is_admin')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('getListingProfile error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    return null
  }

  return (data as ListingProfile | null) ?? null
}