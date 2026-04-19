import { redirect } from 'next/navigation'
import DeleteAccountButton from './DeleteAccountButton'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export default async function AsetuksetSivu() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/kirjaudu')
  }

  return (
    <main className="max-w-screen-md mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Asetukset</h1>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Tilin hallinta</h2>
        <p className="text-sm text-gray-600 mb-4">
          Voit poistaa käyttäjätilisi ja kaikki ilmoituksesi. Toimintoa ei voi perua.
        </p>

        <DeleteAccountButton />
      </div>
    </main>
  )
}