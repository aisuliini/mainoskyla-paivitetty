'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Eye } from 'lucide-react'

type Ilmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti?: string | null
  kuva_url?: string | null
  nayttoja?: number | null
  luotu?: string | null
  nostettu_at?: string | null
  user_id?: string | null
  voimassa_alku?: string | null
  voimassa_loppu?: string | null
}

export default function OmatIlmoituksetSivu() {
  const router = useRouter()
  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const hae = async () => {
      // ✅ varmempi kuin getSession()
      const { data: userRes, error: userErr } = await supabase.auth.getUser()
      const currentUser = userRes?.user

      if (userErr || !currentUser) {
        router.replace('/kirjaudu')
        return
      }

      setLoading(true)

      const { error, data } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('luotu', { ascending: false })

      if (!mounted) return

      if (error) {
        console.error('Virhe ilmoitusten haussa:', error.message)
      } else {
        setIlmoitukset((data as Ilmoitus[]) ?? [])
      }

      setLoading(false)
    }

    hae()

    // ✅ refetch kun palaat takaisin tai vaihdat välilehteä
    const onFocus = () => hae()
    const onVis = () => {
      if (document.visibilityState === 'visible') hae()
    }
    const onPageShow = () => hae()

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      mounted = false
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [router])

  const julkaiseUudelleen = async (ilmo: Ilmoitus) => {
    if (!confirm('Julkaistaanko ilmoitus uudelleen?')) return

    const uusiPaiva = new Date().toISOString()

    const { error } = await supabase
      .from('ilmoitukset')
      .update({ luotu: uusiPaiva })
      .eq('id', ilmo.id)

    if (error) {
      console.error('Virhe julkaisussa:', error.message)
      alert('Päivitys epäonnistui. Yritä uudelleen.')
      return
    }

    setIlmoitukset((prev) => {
      const updated = prev.map((i) =>
        i.id === ilmo.id ? { ...i, luotu: uusiPaiva } : i
      )

      // ✅ lajittele uudelleen, niin käyttäjä näkee heti että toimi
      return updated.sort((a, b) => {
        const da = new Date(a.luotu ?? 0).getTime()
        const db = new Date(b.luotu ?? 0).getTime()
        return db - da
      })
    })
  }

  const poistaIlmoitus = async (ilmo: Ilmoitus) => {
    if (!confirm('Poistetaanko ilmoitus pysyvästi?')) return

    const { error } = await supabase.from('ilmoitukset').delete().eq('id', ilmo.id)

    if (error) {
      console.error('Virhe poistossa:', error.message)
      alert('Poisto epäonnistui. Yritä uudelleen.')
      return
    }

    setIlmoitukset((prev) => prev.filter((i) => i.id !== ilmo.id))
  }

  const onVanhentunut = (ilmo: Ilmoitus) => {
    if (!ilmo.voimassa_loppu) return false
    return new Date(ilmo.voimassa_loppu).getTime() < Date.now()
  }

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Omat ilmoitukset</h1>
      </div>

      {loading ? (
        <p>Ladataan ilmoituksia...</p>
      ) : ilmoitukset.length === 0 ? (
        <p>Sinulla ei ole vielä ilmoituksia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ilmoitukset.map((ilmo) => {
            const vanha = onVanhentunut(ilmo)

            return (
              <div
                key={ilmo.id}
                className="bg-white border rounded-lg shadow-sm overflow-hidden text-left w-full flex flex-col"
              >
                {/* Klikattava yläosa */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/ilmoitukset/${ilmo.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/ilmoitukset/${ilmo.id}`)}
                  className="block w-full cursor-pointer"
                >
                  <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                    {ilmo.kuva_url ? (
                      <Image
                        src={ilmo.kuva_url}
                        alt={ilmo.otsikko}
                        width={400}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Ei kuvaa</span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg mb-1 truncate">{ilmo.otsikko}</h3>
                      {vanha && (
                        <span className="text-xs bg-gray-100 border rounded-full px-2 py-1 text-gray-700">
                          Vanhentunut
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{ilmo.kuvaus}</p>
                    <p className="text-xs text-gray-500">{ilmo.sijainti ?? ''}</p>

                    {ilmo.voimassa_alku && ilmo.voimassa_loppu && (
                      <p className="text-xs text-gray-500 mt-1">
                        Voimassa:{' '}
                        <strong>{new Date(ilmo.voimassa_alku).toLocaleDateString('fi-FI')}</strong> –{' '}
                        <strong>{new Date(ilmo.voimassa_loppu).toLocaleDateString('fi-FI')}</strong>
                      </p>
                    )}

                    <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
                      <Eye size={14} />
                      {ilmo.nayttoja || 0} katselukertaa
                    </div>
                  </div>
                </div>

                {/* Napit */}
                <div className="px-4 pb-4 pt-2 space-y-2 mt-auto relative z-10">
                  {vanha && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        julkaiseUudelleen(ilmo)
                      }}
                      className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Julkaise uudelleen
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/muokkaa/${ilmo.id}`)
                    }}
                    className="w-full px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Muokkaa
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      poistaIlmoitus(ilmo)
                    }}
                    className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Poista
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
