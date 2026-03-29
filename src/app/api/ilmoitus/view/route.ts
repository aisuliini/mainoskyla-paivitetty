import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL missing')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')

const supabaseAdmin = createClient(url, serviceKey)

function isErrorWithFields(
  err: unknown
): err is { message?: string; details?: string | null; hint?: string | null; code?: string } {
  return typeof err === 'object' && err !== null
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()

    const id =
      typeof body === 'object' &&
      body !== null &&
      'id' in body &&
      typeof (body as { id?: unknown }).id === 'string'
        ? (body as { id: string }).id.trim()
        : ''

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 })
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

    revalidatePath('/')
    revalidatePath('/ilmoitukset')
    revalidatePath(`/ilmoitukset/${id}`)

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Bad request'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}