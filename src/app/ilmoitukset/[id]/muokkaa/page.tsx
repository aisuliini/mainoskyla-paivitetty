'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function MuokkaaIlmoitus() {
  const { id } = useParams()
  const router = useRouter()

  const [ilmo, setIlmo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')

  useEffect(() => {
    const haeIlmoitus = async () => {
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) return router.push('/profiili')

      setIlmo(data)
      setOtsikko(data.otsikko || '')
      setKuvaus(data.kuvaus || '')
      setSijainti(data.sijainti || '')
      setLoading(false)
    }
    haeIlmoitus()
  }, [id, router])

  const tallenna = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase
      .from('ilmoitukset')
      .update({ otsikko, kuvaus, sijainti })
      .eq('id', id)

    if (!error) {
      alert('Ilmoitus päivitetty!')
      router.push('/profiili')
    } else {
      alert('Virhe päivityksessä')
    }
  }

  if (loading) return <p className="p-6">Ladataan...</p>

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow my-12">
      <h1 className="text-2xl font-bold mb-4">Muokkaa ilmoitusta</h1>
      <form onSubmit={tallenna} className="space-y-4">
        <input
          type="text"
          value={otsikko}
          onChange={(e) => setOtsikko(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
          placeholder="Otsikko"
        />

        <textarea
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
          placeholder="Kuvaus"
        />

        <input
          type="text"
          value={sijainti}
          onChange={(e) => setSijainti(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
          placeholder="Sijainti"
        />

        <button
          type="submit"
          className="bg-[#3f704d] text-white px-6 py-2 rounded hover:bg-[#2f5332]"
        >
          Tallenna muutokset
        </button>
      </form>
    </main>
  )
}