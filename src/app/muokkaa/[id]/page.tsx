'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function MuokkaaIlmoitus() {
  const router = useRouter()
  const { id } = useParams()
  const [ilmoitus, setIlmoitus] = useState<any>(null)
  const [userId, setUserId] = useState<string>('')
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [sijainti, setSijainti] = useState('')
  const [kategoria, setKategoria] = useState('')
  const [kuvaFile, setKuvaFile] = useState<File | null>(null)
  const [kuvaPreview, setKuvaPreview] = useState<string>('')

  useEffect(() => {
    const haeData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUserId(userData?.user?.id || '')

      const { data } = await supabase.from('ilmoitukset').select('*').eq('id', id).single()
      if (data) {
        setIlmoitus(data)
        setOtsikko(data.otsikko || '')
        setKuvaus(data.kuvaus || '')
        setSijainti(data.sijainti || '')
        setKategoria(data.kategoria || '')
        setKuvaPreview(data.kuva_url || '')
      }
    }
    if (id) haeData()
  }, [id])

  const paivitaIlmoitus = async (e: any) => {
    e.preventDefault()
    if (ilmoitus?.user_id !== userId) return alert('Et voi muokata tätä ilmoitusta.')

    let uusiKuvaUrl = kuvaPreview
    if (kuvaFile) {
      const tiedostoNimi = `${Date.now()}-${kuvaFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kuvat')
        .upload(tiedostoNimi, kuvaFile, { cacheControl: '3600', upsert: false })

      if (!uploadError) {
        const { data } = supabase.storage.from('kuvat').getPublicUrl(tiedostoNimi)
        uusiKuvaUrl = data.publicUrl
      }
    }

    await supabase
      .from('ilmoitukset')
      .update({ otsikko, kuvaus, sijainti, kuva_url: uusiKuvaUrl, kategoria })
      .eq('id', id)

    router.push('/profiili')
  }

  if (!ilmoitus) return <p className="p-6">Ladataan ilmoitusta...</p>
  if (ilmoitus.user_id !== userId) return <p className="p-6 text-red-600">Sinulla ei ole oikeutta muokata tätä ilmoitusta.</p>

  return (
    <section className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-xl font-bold mb-4">Muokkaa ilmoitusta</h1>
      <form onSubmit={paivitaIlmoitus} className="space-y-4">
        <input
          type="text"
          placeholder="Otsikko"
          value={otsikko}
          onChange={(e) => setOtsikko(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Kuvaus"
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Sijainti"
          value={sijainti}
          onChange={(e) => setSijainti(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={kategoria}
          onChange={(e) => setKategoria(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Valitse kategoria</option>
          <option value="Tapahtuma">Tapahtuma</option>
          <option value="Palvelu">Palvelu</option>
          <option value="Tuottaja">Tuottaja</option>
          <option value="Myynti">Myynti</option>
          <option value="Muu">Muu</option>
        </select>

        {kuvaPreview && (
          <img src={kuvaPreview} alt="Nykyinen kuva" className="w-full h-40 object-cover rounded" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setKuvaFile(file)
            if (file) setKuvaPreview(URL.createObjectURL(file))
          }}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Tallenna muutokset
        </button>
      </form>
    </section>
  )
}
