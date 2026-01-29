'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ArrowLeft } from 'lucide-react'

const SUOSITUT = [
  'kotiapu',
  'siivous',
  'remontti',
  'hieronta',
  'koirahoitaja',
  'valokuvaaja',
  'juhlatila',
  'pihanhoito',
] as const

export default function HakuPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const initial = (sp.get('q') || '').trim()

  const [q, setQ] = useState(initial)

  const filtered = useMemo(() => {
    if (!q) return []
    const lower = q.toLowerCase()
    return (SUOSITUT as readonly string[]).filter((x) => x.includes(lower)).slice(0, 6)
  }, [q])

  const go = (val: string) => {
    const query = val.trim()
    if (!query) return
    router.push(`/aluehaku?q=${encodeURIComponent(query)}`)
  }

  useEffect(() => {
    // automaattisesti fokus kenttään mobiilissa
    const t = setTimeout(() => {
      const el = document.getElementById('haku-input') as HTMLInputElement | null
      el?.focus()
    }, 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* yläpalkki */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-black/5"
            aria-label="Takaisin"
          >
            <ArrowLeft size={20} />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              go(q)
            }}
            className="relative flex-1"
          >
            <input
              id="haku-input"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hae palvelua tai tekijää..."
              className="w-full rounded-full border border-black/10 bg-white pl-5 pr-11 py-3 outline-none focus:border-black/20"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60"
              aria-label="Hae"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* sisältö */}
      <div className="max-w-screen-md mx-auto px-4 py-5">
        {/* jos kirjoittaa, näytä ehdotuksia */}
        {q && filtered.length > 0 && (
          <div className="mb-5">
            <div className="text-xs text-black/50 mb-2">Ehdotukset</div>
            <div className="space-y-2">
              {filtered.map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => go(x)}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-black/10 hover:bg-black/5"
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suositut haut (näkyy aina) */}
        <div>
          <div className="text-xs text-black/50 mb-2">Suositut haut</div>
          <div className="space-y-2">
            {SUOSITUT.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => go(x)}
                className="w-full text-left px-4 py-3 rounded-2xl border border-black/10 hover:bg-black/5"
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
