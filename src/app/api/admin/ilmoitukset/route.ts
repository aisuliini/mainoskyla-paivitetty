import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
if (!supabaseAnonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY missing')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')

const SUPABASE_URL = supabaseUrl
const SUPABASE_ANON_KEY = supabaseAnonKey
const SUPABASE_SERVICE_KEY = serviceKey

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

type JsonObject = Record<string, unknown>

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
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
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  let body: JsonObject

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const id = typeof body.id === 'string' ? body.id.trim() : ''
  const field = typeof body.field === 'string' ? body.field.trim() : ''
  const value = typeof body.value === 'boolean' ? body.value : null

  if (!id || !isValidUuid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  if (!['visible', 'premium'].includes(field)) {
    return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
  }

  if (value === null) {
    return NextResponse.json({ error: 'Invalid value' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('ilmoitukset')
    .update({ [field]: value })
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  let body: JsonObject

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
    .from('ilmoitukset')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}