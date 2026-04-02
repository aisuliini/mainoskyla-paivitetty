import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')

const supabaseAdmin = createClient(url, serviceKey)

const VIEW_COOKIE_PREFIX = 'viewed_listing_'
const VIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 6 // 6 h

function isErrorWithFields(
  err: unknown
): err is { message?: string; details?: string | null; hint?: string | null; code?: string } {
  return typeof err === 'object' && err !== null
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function parseId(body: unknown): string | null {
  if (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    typeof (body as { id?: unknown }).id === 'string'
  ) {
    const id = (body as { id: string }).id.trim()
    return id || null
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown

    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const id = parseId(body)

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 })
    }

    const viewCookieName = `${VIEW_COOKIE_PREFIX}${id}`
    const alreadyViewed = req.cookies.get(viewCookieName)?.value === '1'

    const { data: listing, error: listingError } = await supabaseAdmin
      .from('ilmoitukset')
      .select('id, visible')
      .eq('id', id)
      .maybeSingle()

    if (listingError) {
      return NextResponse.json({ error: 'Failed to verify listing' }, { status: 500 })
    }

    if (!listing || listing.visible !== true) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (alreadyViewed) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const { error } = await supabaseAdmin.rpc('increment_nayttoja', { p_id: id })

    if (error) {
      const payload = isErrorWithFields(error)
        ? {
            error: error.message ?? 'RPC error',
            details: 'details' in error ? error.details : null,
            hint: 'hint' in error ? error.hint : null,
            code: 'code' in error ? error.code : undefined,
          }
        : { error: 'RPC error' }

      return NextResponse.json(payload, { status: 500 })
    }

    const res = NextResponse.json({ ok: true })

    res.cookies.set({
      name: viewCookieName,
      value: '1',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VIEW_COOKIE_MAX_AGE_SECONDS,
    })

    return res
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}