'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Ilmoitus = {
  id: string
  otsikko: string
  sijainti?: string | null
  luotu: string | null
  visible?: boolean | null
  premium?: boolean | null
  saa_jakaa_somessa?: boolean | null
}

type Profiili = {
  id: string
  nimi?: string | null
}

type BannerRow = {
  id: string
  user_id: string
  city: string
  banner_url: string | null
  starts_at: string | null
  ends_at: string | null
  status: 'pending' | 'scheduled' | 'active' | 'rejected' | 'expired' | string
  payment_status: string | null
  created_at: string | null
}

export default function AdminClient({
  initialIlmoitukset,
  initialProfiilit,
  initialBannerit,
}: {
  initialIlmoitukset: Ilmoitus[]
  initialProfiilit: Profiili[]
  initialBannerit: BannerRow[]
}) {
  const router = useRouter()

  const [ilmoitukset, setIlmoitukset] = useState<Ilmoitus[]>(initialIlmoitukset)
  const profiilit = initialProfiilit
  const [bannerit, setBannerit] = useState<BannerRow[]>(initialBannerit)

  const [listingActionLoadingId, setListingActionLoadingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [bannerActionLoadingId, setBannerActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('admin-ilmoitukset')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ilmoitukset' },
        (payload) => {
          const row = payload.new as Ilmoitus

          setToast(`Uusi ilmoitus: ${row.otsikko}`)

          setIlmoitukset((prev) => {
  const exists = prev.some((item) => item.id === row.id)
  if (exists) return prev

  return [
    {
      id: row.id,
      otsikko: row.otsikko ?? 'Uusi ilmoitus',
      sijainti: row.sijainti ?? null,
      luotu: row.luotu ?? new Date().toISOString(),
      visible: row.visible ?? true,
      premium: row.premium ?? false,
      saa_jakaa_somessa: row.saa_jakaa_somessa ?? false,
    },
    ...prev,
  ]
})

          window.setTimeout(() => setToast(null), 4000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const callAdminApi = async (
    method: 'PATCH' | 'DELETE',
    body: Record<string, unknown>
  ) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.access_token) {
      throw new Error('Istunto puuttuu')
    }

    const res = await fetch('/api/admin/ilmoitukset', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.error || 'Admin-toiminto epäonnistui')
    }

    return data
  }

  const callAdminBannerApi = async (
    method: 'PATCH' | 'DELETE',
    body: Record<string, unknown>
  ) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.access_token) {
      throw new Error('Istunto puuttuu')
    }

    const res = await fetch('/api/admin/city-banners', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.error || 'Banneritoiminto epäonnistui')
    }

    return data
  }

    const toggleVisible = async (id: string, current: boolean | null | undefined) => {
  const next = !current

  try {
    setErrorMsg(null)
    setListingActionLoadingId(id)

    await callAdminApi('PATCH', {
      id,
      field: 'visible',
      value: next,
    })

    setIlmoitukset((prev) => prev.map((i) => (i.id === id ? { ...i, visible: next } : i)))
  } catch (error) {
    setErrorMsg(error instanceof Error ? error.message : 'Visible-päivitys epäonnistui')
  } finally {
    setListingActionLoadingId(null)
  }
}

  const togglePremium = async (id: string, current: boolean | null | undefined) => {
  const next = !current

  try {
    setErrorMsg(null)
    setListingActionLoadingId(id)

    await callAdminApi('PATCH', {
      id,
      field: 'premium',
      value: next,
    })

    setIlmoitukset((prev) => prev.map((i) => (i.id === id ? { ...i, premium: next } : i)))
  } catch (error) {
    setErrorMsg(error instanceof Error ? error.message : 'Premium-päivitys epäonnistui')
  } finally {
    setListingActionLoadingId(null)
  }
}

  const deleteIlmoitus = async (id: string) => {
  const ok = window.confirm('Poistetaanko ilmoitus pysyvästi?')
  if (!ok) return

  try {
    setErrorMsg(null)
    setListingActionLoadingId(id)

    await callAdminApi('DELETE', { id })

    setIlmoitukset((prev) => prev.filter((i) => i.id !== id))
  } catch (error) {
    setErrorMsg(error instanceof Error ? error.message : 'Poisto epäonnistui')
  } finally {
    setListingActionLoadingId(null)
  }
}

  const updateBannerStatus = async (
    bannerId: string,
    status: 'scheduled' | 'active' | 'rejected' | 'expired'
  ) => {
    try {
      setErrorMsg(null)
      setBannerActionLoadingId(bannerId)

      const result = await callAdminBannerApi('PATCH', {
        id: bannerId,
        status,
      })

      setBannerit((prev) =>
        prev.map((banneri) =>
          banneri.id === bannerId ? { ...banneri, ...result.banner } : banneri
        )
      )
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Bannerin päivitys epäonnistui')
    } finally {
      setBannerActionLoadingId(null)
    }
  }

  const deleteBannerAsAdmin = async (bannerId: string) => {
    const ok = window.confirm('Poistetaanko banneri pysyvästi?')
    if (!ok) return

    try {
      setErrorMsg(null)
      setBannerActionLoadingId(bannerId)

      await callAdminBannerApi('DELETE', { id: bannerId })

      setBannerit((prev) => prev.filter((banneri) => banneri.id !== bannerId))
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Bannerin poisto epäonnistui')
    } finally {
      setBannerActionLoadingId(null)
    }
  }

  const statusLabel = (status: BannerRow['status']) => {
    if (status === 'pending') return 'Odottaa käsittelyä'
    if (status === 'scheduled') return 'Ajastettu'
    if (status === 'active') return 'Aktiivinen'
    if (status === 'rejected') return 'Hylätty'
    if (status === 'expired') return 'Päättynyt'
    return status
  }

  const formatDate = (value: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fi-FI')
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

      {errorMsg && (
        <div className="border border-red-300 rounded p-4 bg-red-50 text-red-700 shadow mb-6">
          <div className="font-semibold mb-1">Virhe</div>
          <div className="text-sm break-words">{errorMsg}</div>
        </div>
      )}

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
                {formatDate(ilmoitus.luotu)}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Somejako: {ilmoitus.saa_jakaa_somessa ? '✅ Sallittu' : '❌ Ei sallittu'}
              </p>

              <div className="mt-2 flex gap-2 flex-wrap">
                <button
  onClick={() => toggleVisible(ilmoitus.id, ilmoitus.visible)}
  disabled={listingActionLoadingId === ilmoitus.id}
  className="px-2 py-1 text-sm border rounded disabled:opacity-60"
>
  {ilmoitus.visible ? 'Piilota' : 'Näytä'}
</button>

                <button
  onClick={() => togglePremium(ilmoitus.id, ilmoitus.premium)}
  disabled={listingActionLoadingId === ilmoitus.id}
  className="px-2 py-1 text-sm border rounded disabled:opacity-60"
>
  {ilmoitus.premium ? 'Poista Premium' : 'Merkitse Premium'}
</button>

                <button
  onClick={() => deleteIlmoitus(ilmoitus.id)}
  disabled={listingActionLoadingId === ilmoitus.id}
  className="px-2 py-1 text-sm border text-red-600 border-red-300 rounded disabled:opacity-60"
>
  Poista
</button>
              </div>
            </div>
          ))
        )}

        <hr className="my-10" />

        <h2 className="text-xl font-semibold mb-4">Bannerihakemukset</h2>
        {bannerit.length === 0 ? (
          <p>Ei bannerihakemuksia</p>
        ) : (
          bannerit.map((banneri) => (
            <div key={banneri.id} className="border p-4 mb-4 rounded bg-white shadow">
              <p className="text-lg font-semibold">{banneri.city}</p>

              <p className="text-sm text-gray-600 mt-1">
                {formatDate(banneri.starts_at)} – {formatDate(banneri.ends_at)}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Status: {statusLabel(banneri.status)}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Maksu: {banneri.payment_status ?? '—'}
              </p>

              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => updateBannerStatus(banneri.id, 'scheduled')}
                  disabled={bannerActionLoadingId === banneri.id}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-60"
                >
                  Ajasta
                </button>

                <button
                  onClick={() => updateBannerStatus(banneri.id, 'active')}
                  disabled={bannerActionLoadingId === banneri.id}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-60"
                >
                  Aktivoi
                </button>

                <button
                  onClick={() => updateBannerStatus(banneri.id, 'rejected')}
                  disabled={bannerActionLoadingId === banneri.id}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-60"
                >
                  Hylkää
                </button>

                <button
                  onClick={() => updateBannerStatus(banneri.id, 'expired')}
                  disabled={bannerActionLoadingId === banneri.id}
                  className="px-2 py-1 text-sm border rounded disabled:opacity-60"
                >
                  Päätä
                </button>

                <button
                  onClick={() => deleteBannerAsAdmin(banneri.id)}
                  disabled={bannerActionLoadingId === banneri.id}
                  className="px-2 py-1 text-sm border text-red-600 border-red-300 rounded disabled:opacity-60"
                >
                  Poista
                </button>
              </div>

              {banneri.banner_url && (
                <div className="mt-4 overflow-hidden rounded-xl border">
                  <Image
                    src={banneri.banner_url}
                    alt={`${banneri.city} banneri`}
                    width={1200}
                    height={240}
                    className="h-[100px] w-full object-cover"
                    unoptimized
                  />
                </div>
              )}
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
            </div>
          ))
        )}
      </>
    </div>
  )
}