'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Eye } from 'lucide-react'

export default function IlmoitusLista() {
  const [ilmoitukset, setIlmoitukset] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const hae = async () => {
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .order('luotu', { ascending: false }) // tärkeä: sama järjestys aina
        .limit(20)

      if (!error && data) {
        setIlmoitukset(data)
      } else {
        console.error('Virhe haussa:', error)
      }
    }
    hae()
  }, [])

  return (
    <section className="py-12 px-6 bg-[#f5f1e6]">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#2f5332]">Ilmoitukset</h2>

        {ilmoitukset.length === 0 ? (
          <p className="text-gray-500">Ei ilmoituksia näytettäväksi.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ilmoitukset.map((ilmo) => (
              <div key={ilmo.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                {ilmo.kuva_url ? (
                  <img
                    src={ilmo.kuva_url}
                    alt={ilmo.otsikko}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-100" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{ilmo.otsikko}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
                  <p className="text-xs text-gray-500 mt-1">{ilmo.sijainti}</p>

                  <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
                    <Eye size={14} className="inline-block" />
                    {ilmo.nayttoja || 0} katselukertaa
                  </div>

                  <button
                    onClick={() => router.push(`/ilmoitukset/${ilmo.id}`)}
                    className="mt-3 px-4 py-2 text-sm bg-[#3f704d] text-white rounded hover:bg-[#2f5332]"
                  >
                    Näytä
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
