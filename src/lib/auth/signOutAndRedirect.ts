import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { supabase } from '@/lib/supabaseClient'

type SignOutReason = 'manual' | 'idle'

export async function signOutAndRedirect(
  router: AppRouterInstance,
  reason: SignOutReason = 'manual'
) {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Uloskirjautuminen epäonnistui:', error)
    router.replace('/kirjaudu?logout_error=1')
    router.refresh()
    return
  }

  const target =
    reason === 'idle'
      ? '/kirjaudu?reason=idle'
      : '/kirjaudu?logout=1'

  router.replace(target)
  router.refresh()
}