'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Ilmoitus = {
  id: string
  otsikko: string
  paikkakunta?: string
  created_at: string
  visible: boolean
  premium: boolean
}

type Profiili = {
  id: string
  nimi?: string
  admin?: boolean
}

type SupaUser = {
  id: string
  email?: string
}

export default function AdminPage() {
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [profiilit, setProfiilit] = useState<Profiili[]>([])
  const [user, setUser] = useState<SupaUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('admin')
        .eq('id', user.id)
        .single()

      if (profileError || !profile?.admin) {
        router.push('/')
        return
      }

      setUser(user)

      const { data: ilmoituksetData } = await supabase
        .from('ilmoitukset')
        .select('*')
        .order('created_at', { ascending: false })

      if (ilmoituksetData) {
        setIlmoitukset(ilmoituksetData as Ilmoitus[])
      }

      const { data: profiilitData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profiilitData) {
        setProfiilit(profiilitData as Profiili[])
      }
    }

    fetchUserAndData()
  }, [])

  const toggleVisible = async (id: string, visible: boolean) => {
    await supabase.from('ilmoitukset').update({ visible: !visible }).eq('id', id)
    setIlmoitukset(prev =>
      prev.map(i => i.id === id ? { ...i, visible: !visible } : i)
    )
  }

  const togglePremium = async (id: string, premium: boolean) => {
    await supabase.from('ilmoitukset').update({ premium: !premium }).eq('id', id)
    setIlmoitukset(prev =>
      prev.map(i => i.id === id ? { ...i, premium: !premium } : i)
    )
  }

  const deleteIlmoitus = async (id: string) => {
    await supabase.from('ilmoitukset').delete().eq('id', id)
    setIlmoitukset(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin-paneeli</h1>

      <h2 className="text-xl font-semibold mb-4">Ilmoitukset</h2>
      {ilmoitukset.length === 0 ? (
        <p>Ei ilmoituksia</p>
      ) : (
        ilmoitukset.map((ilmoitus) => (
          <div key={ilmoitus.id} className="border p-4 mb-4 rounded bg-white shadow">
            <h2 className="text-lg font-semibold">{ilmoitus.otsikko}</h2>
            <p className="text-sm text-gray-600">
              {ilmoitus.paikkakunta} • {new Date(ilmoitus.created_at).toLocaleDateString()}
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
                className="px-2 py-1 text-sm border text-red-500 border-red-500 rounded"
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
            <p><strong>Email (uid):</strong> {profiili.id}</p>
            <p><strong>Admin:</strong> {profiili.admin ? '✅' : '❌'}</p>
          </div>
        ))
      )}
    </div>
  )
}
