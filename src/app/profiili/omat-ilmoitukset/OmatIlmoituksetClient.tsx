'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SafeCardImage from '@/components/shared/SafeCardImage'
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
  const [mounted, setMounted] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

useEffect(() => {
  setMounted(true)
}, [])

  // estää vanhojen requestien tulosten “ylikirjoituksen”
  const reqIdRef = useRef(0)
  // estää setState unmountin jälkeen
  const activeRef = useRef(true)


  const getUserOrRedirect = useCallback(async () => {
  let user = null

for (let i = 0; i < 5; i++) {
  const { data } = await supabase.auth.getUser()
  user = data.user

  if (user) break

  await new Promise((res) => setTimeout(res, 200))
}

if (!user) {
  router.replace('/kirjaudu?redirect=/profiili/omat-ilmoitukset')
  return null
}

  return user
}, [router])

  const haeIlmoitukset = useCallback(async () => {
    const myReqId = ++reqIdRef.current

    const user = await getUserOrRedirect()
    if (!user) return

    if (activeRef.current) setLoading(true)

    const { data, error } = await supabase
      .from('ilmoitukset')
      .select('*')
      .eq('user_id', user.id)
      .order('luotu', { ascending: false })

    
    if (myReqId !== reqIdRef.current) return

    if (!activeRef.current) return

    if (error) {
      console.error('Virhe ilmoitusten haussa:', error.message)
      setIlmoitukset([])
    } else {
      setIlmoitukset((data as Ilmoitus[]) ?? [])
    }

    setLoading(false)
  }, [getUserOrRedirect])

useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_OUT') {
        reqIdRef.current += 1
        setIlmoitukset([])
        setDeletingId(null)
        setLoading(false)
        router.replace('/kirjaudu?redirect=/profiili/omat-ilmoitukset')
        router.refresh()
        return
      }

      if (session?.user) {
        void haeIlmoitukset()
        router.refresh()
      }
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }
}, [haeIlmoitukset, router])

  useEffect(() => {
    activeRef.current = true

    // Ensilataus
    haeIlmoitukset()

    // iOS Safari BFCache: back/forward paluu voi jättää Supabasen “jäätyneeksi”
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
        return
      }
      haeIlmoitukset()
    }

    const onFocus = () => haeIlmoitukset()

    const onVis = () => {
      if (document.visibilityState === 'visible') haeIlmoitukset()
    }

    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      activeRef.current = false
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [haeIlmoitukset])

  const julkaiseUudelleen = useCallback(
    async (ilmo: Ilmoitus) => {
      if (!confirm('Julkaistaanko ilmoitus uudelleen?')) return

      const user = await getUserOrRedirect()
      if (!user) return

      const uusiPaiva = new Date().toISOString()

      const { error } = await supabase
        .from('ilmoitukset')
        .update({ luotu: uusiPaiva })
        .eq('id', ilmo.id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Virhe julkaisussa:', error.message)
        alert(error.message)
        return
      }

      // pro: varmista että lista päivittyy varmasti oikein (myös iOS/backissa)
      await haeIlmoitukset()
    },
    [getUserOrRedirect, haeIlmoitukset]
  )

  const poistaIlmoitus = useCallback(
  async (ilmo: Ilmoitus) => {
    if (!confirm('Poistetaanko ilmoitus pysyvästi?')) return

    setDeletingId(ilmo.id)

    try {
      const res = await fetch(`/api/ilmoitukset/${encodeURIComponent(ilmo.id)}`, {
        method: 'DELETE',
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message = data?.error || 'Poisto epäonnistui'
        console.error('Virhe poistossa:', message)
        alert(message)
        return
      }

      setIlmoitukset((prev) => prev.filter((item) => item.id !== ilmo.id))
      router.refresh()
    } catch (error) {
      console.error('Virhe poistossa:', error)
      alert('Poisto epäonnistui')
    } finally {
      setDeletingId(null)
    }
  },
  [router]
)

  const onVanhentunut = (ilmo: Ilmoitus) => {
  if (!ilmo.voimassa_loppu) return false
  if (!mounted) return false // ✅ estää SSR/CSR mismatch
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
  <SafeCardImage
    src={ilmo.kuva_url}
    alt={ilmo.otsikko}
    width={400}
    height={160}
    className="h-full w-full object-cover"
    sizes="(max-width: 768px) 100vw, 400px"
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

                    {mounted && ilmo.voimassa_alku && ilmo.voimassa_loppu && (
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
  disabled={deletingId === ilmo.id}
  className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
>
  {deletingId === ilmo.id ? 'Poistetaan...' : 'Poista'}
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
