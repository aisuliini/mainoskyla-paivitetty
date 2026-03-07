'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Ilmoitus = {
  id: string
  otsikko: string
  sijainti?: string | null
  luotu: string | null
  visible?: boolean | null
  premium?: boolean | null
}

type Profiili = {
  id: string
  nimi?: string | null
  admin?: boolean | null // voi olla olemassa vielä, mutta EI käytetä admin-checkiin
}

export default function AdminPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [profiilit, setProfiilit] = useState<Profiili[]>([])

  const [toast, setToast] = useState<string | null>(null)

    useEffect(() => {
    const run = async () => {
      setLoading(true)
      setErrorMsg(null)

      const { data: userRes, error: userErr } = await supabase.auth.getUser()
      if (userErr) {
        setErrorMsg(`auth.getUser error: ${userErr.message}`)
        setLoading(false)
        return
      }
      if (!userRes?.user) {
        router.push('/')
        return
      }

      const { data: isAdmin, error: adminErr } = await supabase.rpc('is_admin')
      if (adminErr) {
        setErrorMsg(`admin check error: ${adminErr.message}`)
        setLoading(false)
        return
      }
      if (!isAdmin) {
        router.push('/')
        return
      }

      const { data: ilmoituksetData, error: ilmoErr } = await supabase
        .from('ilmoitukset')
        .select('id, otsikko, sijainti, luotu, visible, premium')
        .order('luotu', { ascending: false })

      if (ilmoErr) {
        setErrorMsg(`ilmoitukset fetch error: ${ilmoErr.message}`)
        setLoading(false)
        return
      }
      setIlmoitukset((ilmoituksetData ?? []) as Ilmoitus[])

      const { data: profiilitData, error: profErr } = await supabase
        .from('profiles')
        .select('id, nimi, admin')
        .limit(200)

      if (profErr) {
        setErrorMsg(`profiles fetch error: ${profErr.message}`)
        setLoading(false)
        return
      }
      setProfiilit((profiilitData ?? []) as Profiili[])

      setLoading(false)
    }

    run()

    const channel = supabase
  .channel('admin-ilmoitukset')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'ilmoitukset' },
    (payload) => {
      const row = payload.new as Ilmoitus

      // näytä pieni ilmoitus
      setToast(`Uusi ilmoitus: ${row.otsikko}`)

      // lisää listan kärkeen (ettei tarvitse refresh)
      setIlmoitukset((prev) => [
  {
    id: row.id,
    otsikko: row.otsikko ?? 'Uusi ilmoitus',
    sijainti: row.sijainti ?? null,
    luotu: row.luotu ?? new Date().toISOString(),
    visible: row.visible ?? true,
    premium: row.premium ?? false
  },
  ...prev
])

      // piilota toast hetken päästä
      setTimeout(() => setToast(null), 4000)
    }
  )
  .subscribe()

return () => {
  supabase.removeChannel(channel)
}
    
  }, [router])


  const toggleVisible = async (id: string, current: boolean | null | undefined) => {
    const next = !current
    const { error } = await supabase.from('ilmoitukset').update({ visible: next }).eq('id', id)
    if (error) {
      setErrorMsg(`visible update error: ${error.message}`)
      return
    }
    setIlmoitukset(prev => prev.map(i => (i.id === id ? { ...i, visible: next } : i)))
  }

  const togglePremium = async (id: string, current: boolean | null | undefined) => {
    const next = !current
    const { error } = await supabase.from('ilmoitukset').update({ premium: next }).eq('id', id)
    if (error) {
      setErrorMsg(`premium update error: ${error.message}`)
      return
    }
    setIlmoitukset(prev => prev.map(i => (i.id === id ? { ...i, premium: next } : i)))
  }

  const deleteIlmoitus = async (id: string) => {
    const ok = window.confirm('Poistetaanko ilmoitus pysyvästi?')
    if (!ok) return

    const { error } = await supabase.from('ilmoitukset').delete().eq('id', id)
    if (error) {
      setErrorMsg(`delete error: ${error.message}`)
      return
    }
    setIlmoitukset(prev => prev.filter(i => i.id !== id))
  }


  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
  <div className="mb-4 border rounded p-3 bg-green-50 text-green-800 shadow">
    🔔 {toast}
  </div>
)}
      <div className="flex items-center justify-between gap-4 mb-6">
<h1 className="text-2xl font-bold">
  Admin-paneeli {ilmoitukset.length > 0 && `(${ilmoitukset.length})`}
</h1>
        <button
          onClick={() => router.push('/')}
          className="text-sm border rounded px-3 py-2"
        >
          Takaisin etusivulle
        </button>
      </div>

      {loading && (
        <div className="border rounded p-4 bg-white shadow">
          Ladataan admin-dataa...
        </div>
      )}

      {!loading && errorMsg && (
        <div className="border border-red-300 rounded p-4 bg-red-50 text-red-700 shadow mb-6">
          <div className="font-semibold mb-1">Virhe</div>
          <div className="text-sm break-words">{errorMsg}</div>
        </div>
      )}

      {!loading && !errorMsg && (
        <>
          <h2 className="text-xl font-semibold mb-4">Ilmoitukset</h2>
          {ilmoitukset.length === 0 ? (
            <p>Ei ilmoituksia</p>
          ) : (
            ilmoitukset.map((ilmoitus) => (
              <div key={ilmoitus.id} className="border p-4 mb-4 rounded bg-white shadow">
                <h3 className="text-lg font-semibold">{ilmoitus.otsikko}</h3>

                <p className="text-sm text-gray-600">
                  {(ilmoitus.sijainti ?? '—')} •{' '}
                  {ilmoitus.luotu ? new Date(ilmoitus.luotu).toLocaleDateString() : '—'}
                </p>

                <div className="mt-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleVisible(ilmoitus.id, ilmoitus.visible)}
                    className="px-2 py-1 text-sm border rounded"
                  >
                    {ilmoitus.visible ? 'Piilota' : 'Näytä'}
                  </button>

                  <button
                    onClick={() => togglePremium(ilmoitus.id, ilmoitus.premium)}
                    className="px-2 py-1 text-sm border rounded"
                  >
                    {ilmoitus.premium ? 'Poista Premium' : 'Merkitse Premium'}
                  </button>

                  <button
                    onClick={() => deleteIlmoitus(ilmoitus.id)}
                    className="px-2 py-1 text-sm border text-red-600 border-red-300 rounded"
                  >
                    Poista
                  </button>
                </div>
              </div>
            ))
          )}

          <hr className="my-10" />

          <h2 className="text-xl font-semibold mb-4">Käyttäjät (profiilit)</h2>
          {profiilit.length === 0 ? (
            <p>Ei profiileja</p>
          ) : (
            profiilit.map((profiili) => (
              <div key={profiili.id} className="border p-4 mb-4 rounded bg-gray-50 shadow-sm">
                <p><strong>Nimi:</strong> {profiili.nimi || '(ei annettu)'}</p>
                <p><strong>UID:</strong> {profiili.id}</p>
                <p><strong>Admin-kenttä:</strong> {profiili.admin ? '✅' : '❌'}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
