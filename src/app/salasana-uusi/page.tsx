'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SalasanaUusiSivu() {
  const router = useRouter()
  const [uusiSalasana, setUusiSalasana] = useState('')
  const [viesti, setViesti] = useState('')

  const vaihdaSalasana = async (e: React.FormEvent) => {
    e.preventDefault()
    setViesti('')
    const { error } = await supabase.auth.updateUser({ password: uusiSalasana })

    if (error) {
      setViesti('⚠️ Vaihto epäonnistui: ' + error.message)
    } else {
      setViesti('✅ Salasana vaihdettu! Siirrytään profiiliin...')
      setTimeout(() => {
        router.push('/profiili')
      }, 2000)
    }
  }

  useEffect(() => {
    const tarkista = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        setViesti('⚠️ Istuntoa ei löytynyt. Linkki voi olla vanhentunut.')
      }
    }
    tarkista()
  }, [])

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Aseta uusi salasana</h1>
      <form onSubmit={vaihdaSalasana} className="space-y-4">
        <input
          type="password"
          placeholder="Uusi salasana"
          value={uusiSalasana}
          onChange={(e) => setUusiSalasana(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Vaihda salasana
        </button>
      </form>
      {viesti && <p className="mt-4">{viesti}</p>}
    </main>
  )
}
