import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function getSafeNextPath(rawNext: string | null): string {
  if (!rawNext) return '/profiili'
  if (!rawNext.startsWith('/')) return '/profiili'
  if (rawNext.startsWith('//')) return '/profiili'
  return rawNext
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = getSafeNextPath(requestUrl.searchParams.get('next'))

  if (!token_hash || type !== 'email') {
    return NextResponse.redirect(
      new URL('/kirjaudu?error=otp_missing', request.url)
    )
  }

  const response = NextResponse.redirect(new URL(next, request.url))
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: 'email',
  })

  if (error) {
    return NextResponse.redirect(
      new URL('/kirjaudu?error=otp_verify', request.url)
    )
  }

  return response
}