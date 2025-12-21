import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) console.error('❌ NEXT_PUBLIC_SUPABASE_URL missing')
if (!serviceKey) console.error('❌ SUPABASE_SERVICE_ROLE_KEY missing')

const supabaseAdmin = createClient(url!, serviceKey!)

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

const { error } = await supabaseAdmin.rpc('increment_nayttoja', { p_id: String(id) })

    if (error) {
      console.error('❌ increment_nayttoja failed:', error) // <-- TÄMÄ NÄKYY TERMINAALISSA
      return NextResponse.json(
        {
          error: error.message,
          code: (error as any)?.code,
          details: (error as any)?.details,
          hint: (error as any)?.hint,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('❌ view route crashed:', e) // <-- TÄMÄ NÄKYY TERMINAALISSA
    return NextResponse.json({ error: e?.message ?? 'Bad request' }, { status: 500 })
  }
}
