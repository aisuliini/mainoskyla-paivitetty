import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

type ListingImagesRow = {
  kuva_url: string | null
  kuvat: string | null
}

function parseImageUrls(row: ListingImagesRow) {
  const urls = new Set<string>()

  if (row.kuva_url) {
    urls.add(row.kuva_url)
  }

  if (row.kuvat) {
    try {
      const parsed = JSON.parse(row.kuvat)
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'string' && item.trim()) {
            urls.add(item)
          }
        }
      }
    } catch {
      // Ignore malformed legacy image JSON; kuva_url still covers the primary image.
    }
  }

  return Array.from(urls)
}

function storagePathFromPublicUrl(value: string, userId: string) {
  const trimmed = value.trim()
  const publicPrefix = '/storage/v1/object/public/kuvat/'
  let path = ''

  try {
    const url = new URL(trimmed)
    const index = url.pathname.indexOf(publicPrefix)
    if (index === -1) return null
    path = decodeURIComponent(url.pathname.slice(index + publicPrefix.length))
  } catch {
    path = trimmed
  }

  if (!path.startsWith(`${userId}/`)) return null
  if (path.includes('..')) return null

  return path
}

export async function DELETE() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: listings, error: fetchError } = await supabaseAdmin
    .from('ilmoitukset')
    .select('kuva_url, kuvat')
    .eq('user_id', user.id)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const imagePaths = Array.from(
    new Set(
      ((listings ?? []) as ListingImagesRow[])
        .flatMap(parseImageUrls)
        .map((url) => storagePathFromPublicUrl(url, user.id))
        .filter((path): path is string => Boolean(path))
    )
  )

  const { error: deleteError } = await supabaseAdmin
    .from('ilmoitukset')
    .delete()
    .eq('user_id', user.id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  if (imagePaths.length > 0) {
    const { error: storageError } = await supabaseAdmin.storage
      .from('kuvat')
      .remove(imagePaths)

    if (storageError) {
      console.error('Account listing image cleanup failed:', storageError.message)
      return NextResponse.json({
        ok: true,
        storageCleanupFailed: true,
      })
    }
  }

  return NextResponse.json({ ok: true })
}
