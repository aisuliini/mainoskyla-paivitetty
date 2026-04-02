import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
if (!supabaseAnonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY missing')
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')

const SUPABASE_URL = supabaseUrl
const SUPABASE_ANON_KEY = supabaseAnonKey
const SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const allowedStatuses = new Set(['pending', 'scheduled', 'active', 'rejected', 'expired'])

type PatchBody = {
  id?: unknown
  status?: unknown
  starts_at?: unknown
  ends_at?: unknown
}

type DeleteBody = {
  id?: unknown
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
}

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json({ error: 'Missing bearer token' }, { status: 401 }),
    }
  }

  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    return {
      error: NextResponse.json({ error: 'Missing access token' }, { status: 401 }),
    }
  }

  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser(token)

  if (userError || !user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const { data: adminRow, error: adminError } = await supabaseAdmin
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (adminError) {
    return {
      error: NextResponse.json({ error: 'Admin check failed' }, { status: 500 }),
    }
  }

  if (!adminRow) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { user }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if ('error' in auth) return auth.error

    let body: PatchBody

    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const id = typeof body.id === 'string' ? body.id.trim() : ''
    const status = typeof body.status === 'string' ? body.status.trim() : undefined
    const startsAt = body.starts_at
    const endsAt = body.ends_at

    if (!id || !isValidUuid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const updateData: {
      status?: string
      starts_at?: string | null
      ends_at?: string | null
    } = {}

    if (status !== undefined) {
      if (!allowedStatuses.has(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      updateData.status = status
    }

    if (startsAt !== undefined) {
      if (startsAt !== null && !isValidIsoDate(startsAt)) {
        return NextResponse.json({ error: 'starts_at must be a valid ISO date' }, { status: 400 })
      }
      updateData.starts_at = startsAt
    }

    if (endsAt !== undefined) {
      if (endsAt !== null && !isValidIsoDate(endsAt)) {
        return NextResponse.json({ error: 'ends_at must be a valid ISO date' }, { status: 400 })
      }
      updateData.ends_at = endsAt
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No allowed fields provided' }, { status: 400 })
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('city_banners')
      .select('id, city, starts_at, ends_at, status')
      .eq('id', id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        { error: 'Failed to fetch banner', details: existingError.message },
        { status: 500 }
      )
    }

    if (!existing) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    const mergedStartsAt =
      updateData.starts_at !== undefined ? updateData.starts_at : existing.starts_at
    const mergedEndsAt =
      updateData.ends_at !== undefined ? updateData.ends_at : existing.ends_at
    const mergedStatus =
      updateData.status !== undefined ? updateData.status : existing.status

    if (mergedStartsAt && mergedEndsAt) {
      const start = new Date(mergedStartsAt)
      const end = new Date(mergedEndsAt)

      if (end <= start) {
        return NextResponse.json(
          { error: 'ends_at must be later than starts_at' },
          { status: 400 }
        )
      }
    }

    const shouldCheckOverlap =
      mergedStatus === 'scheduled' || mergedStatus === 'active'

    if (shouldCheckOverlap && mergedStartsAt && mergedEndsAt) {
      const { data: overlaps, error: overlapError } = await supabaseAdmin
        .from('city_banners')
        .select('id')
        .eq('city', existing.city)
        .in('status', ['scheduled', 'active'])
        .neq('id', id)
        .lt('starts_at', mergedEndsAt)
        .gt('ends_at', mergedStartsAt)
        .limit(1)

      if (overlapError) {
        return NextResponse.json(
          { error: 'Failed to validate overlaps', details: overlapError.message },
          { status: 500 }
        )
      }

      if (overlaps && overlaps.length > 0) {
        return NextResponse.json(
          { error: 'Another city banner already overlaps this time range' },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabaseAdmin
      .from('city_banners')
      .update(updateData)
      .eq('id', id)
      .select('id, user_id, city, banner_url, starts_at, ends_at, status, payment_status, created_at')
      .maybeSingle()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update banner', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, banner: data })
  } catch (error) {
    console.error('PATCH /api/admin/city-banners failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req)
    if ('error' in auth) return auth.error

    let body: DeleteBody

    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const id = typeof body.id === 'string' ? body.id.trim() : ''

    if (!id || !isValidUuid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('city_banners')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete banner', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/city-banners failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}