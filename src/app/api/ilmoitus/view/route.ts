import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')

const supabaseAdmin = createClient(url, serviceKey)

// Type guard Supabase/PostgREST errorille (ei any)
function isErrorWithFields(
  err: unknown
): err is { message?: string; details?: string | null; hint?: string | null; code?: string } {
  return typeof err === 'object' && err !== null
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()
    const id =
      typeof body === 'object' && body !== null && 'id' in body && typeof (body as { id?: unknown }).id === 'string'
        ? (body as { id: string }).id
        : ''

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

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

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Bad request'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
