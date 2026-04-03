import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function getSafeNextPath(rawNext: string | null): string {
  if (!rawNext) return '/profiili'

  // Sallitaan vain sisäiset polut kuten /profiili tai /salasana-uusi
  if (!rawNext.startsWith('/')) return '/profiili'
  if (rawNext.startsWith('//')) return '/profiili'

  return rawNext
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = getSafeNextPath(requestUrl.searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(
      new URL('/kirjaudu?error=oauth_code_missing', request.url)
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

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL('/kirjaudu?error=oauth_exchange', request.url)
    )
  }

  return response
}