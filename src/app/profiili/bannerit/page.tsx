'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Megaphone, Trash2, PlusCircle } from 'lucide-react'

type BannerRow = {
  id: string
  city: string
  banner_url: string | null
  starts_at: string
  ends_at: string
  status: 'active' | 'scheduled' | 'expired' | string
  payment_status: string | null
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fi-FI')
}

function statusText(status: string) {
  if (status === 'active') return 'Aktiivinen'
  if (status === 'scheduled') return 'Ajastettu'
  if (status === 'expired') return 'Päättynyt'
  return status
}

export default function BanneritSivu() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [bannerit, setBannerit] = useState<BannerRow[]>([])
  const [error, setError] = useState<string | null>(null)

  const haeBannerit = async (uid: string) => {
    const { data, error } = await supabase
  .from('city_banners')
  .select('id, city, banner_url, starts_at, ends_at, status, payment_status')
  .eq('user_id', uid)
  .order('starts_at', { ascending: false })

    if (error) {
      setError(error.message)
      return
    }

    setBannerit((data as BannerRow[]) ?? [])
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user

      if (!user) {
        router.replace('/kirjaudu')
        return
      }

      if (!mounted) return

      setUserId(user.id)
      await haeBannerit(user.id)
      setLoading(false)
    }

    init()

    return () => {
      mounted = false
    }
  }, [router])

  const poistaBanneri = async (bannerId: string, bannerUrl?: string | null) => {
    const confirmed = window.confirm('Haluatko varmasti poistaa bannerin?')
    if (!confirmed) return

    setDeletingId(bannerId)
    setError(null)

    const { error: deleteError } = await supabase
      .from('city_banners')
      .delete()
      .eq('id', bannerId)

    if (deleteError) {
      setError(deleteError.message)
      setDeletingId(null)
      return
    }

    if (bannerUrl) {
      try {
        const parts = bannerUrl.split('/storage/v1/object/public/bannerit/')
        const filePath = parts[1]

        if (filePath) {
          await supabase.storage.from('bannerit').remove([filePath])
        }
      } catch {
      }
    }

    if (userId) {
      await haeBannerit(userId)
    }

    setDeletingId(null)
  }

  return (
    <main className="max-w-screen-md mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bannerimainonta</h1>
          <p className="text-sm text-gray-600 mt-1">
            Hallitse kaupunkibannereita ja varaa uusia paikkoja
          </p>
        </div>

        <Link
          href="/lisaa-banneri"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-white bg-[#4F6763] hover:opacity-95"
        >
          <PlusCircle size={18} />
          Varaa uusi
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p>Ladataan bannereita...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          

          {bannerit.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Megaphone className="text-[#4F6763]" />
                <p className="font-semibold">Ei vielä bannereita</p>
              </div>

              <p className="text-sm text-gray-600 mb-5">
                Et ole vielä varannut kaupunkibanneria.
              </p>

              <Link
                href="/lisaa-banneri"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-white bg-[#4F6763] hover:opacity-95"
              >
                <PlusCircle size={18} />
                Varaa kaupunkibanneri
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bannerit.map((banneri) => (
                <div
                  key={banneri.id}
                  className="bg-white border rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{banneri.city}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(banneri.starts_at)} – {formatDate(banneri.ends_at)}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Tila:</span>{' '}
                        {statusText(banneri.status)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => poistaBanneri(banneri.id, banneri.banner_url)}
                      disabled={deletingId === banneri.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingId === banneri.id ? 'Poistetaan...' : 'Poista'}
                    </button>
                  </div>

                  {banneri.banner_url && (
                    <div className="mt-4">
                      <img
                        src={banneri.banner_url}
                        alt={`Banneri kaupungissa ${banneri.city}`}
                        className="w-full rounded-xl border object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}