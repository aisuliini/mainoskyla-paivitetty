// app/haku/HakuClient.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ArrowLeft, X } from 'lucide-react'

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

function normalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // poista aksentit
}

export default function HakuClient() {
  const router = useRouter()
  const sp = useSearchParams()

  // q URL:stä (source of truth)
  const urlQ = useMemo(() => (sp.get('q') ?? '').trim(), [sp])

  // input state
  const [q, setQ] = useState(urlQ)

  // pidä input synkassa back/forward / linkit / refresh
  useEffect(() => {
    setQ(urlQ)
  }, [urlQ])

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
    return () => clearTimeout(t)
  }, [])

  // Ehdotukset
  const filtered = useMemo(() => {
    const n = normalize(q)
    if (!n) return []
    return (SUOSITUT as readonly string[])
      .filter((x) => normalize(x).includes(n))
      .slice(0, 6)
  }, [q])

  // Navigoi aluehakuun
  const go = (val: string) => {
    const query = val.trim()
    if (!query) return
    router.push(`/aluehaku?q=${encodeURIComponent(query)}`)
  }

  // Enter = haku
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    go(q)
  }

  // Päivitä URL /haku?q=... kevyesti (ei pakko, mutta “täydellinen”)
  // Tämä tekee että jos käyttäjä kirjoittaa ja kopioi linkin, q pysyy mukana.
  useEffect(() => {
    const next = q.trim()
    const current = urlQ.trim()
    if (next === current) return

    const params = new URLSearchParams(sp.toString())
    if (next) params.set('q', next)
    else params.delete('q')

    const qs = params.toString()
    router.replace(qs ? `/haku?${qs}` : '/haku', { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]) // tarkoituksella vain q: sta (estää loopit)

  const clear = () => {
    setQ('')
    inputRef.current?.focus()
  }

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

          <form onSubmit={onSubmit} className="relative flex-1">
            <input
              ref={inputRef}
              id="haku-input"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hae palvelua tai tekijää..."
              autoComplete="off"
              className="w-full rounded-full border border-black/10 bg-white pl-5 pr-20 py-3 outline-none focus:border-black/20"
              aria-label="Haku"
            />

            {/* tyhjennä */}
            {q?.trim() && (
              <button
                type="button"
                onClick={clear}
                className="absolute right-11 top-1/2 -translate-y-1/2 text-black/55 hover:text-black/80 p-2"
                aria-label="Tyhjennä haku"
              >
                <X size={18} />
              </button>
            )}

            {/* submit */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black/80 p-2"
              aria-label="Hae"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* sisältö */}
      <div className="max-w-screen-md mx-auto px-4 py-5">
        {/* Ehdotukset */}
        {q.trim() && filtered.length > 0 && (
          <section className="mb-5" aria-label="Ehdotukset">
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
          </section>
        )}

        {/* Suositut haut */}
        <section aria-label="Suositut haut">
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
        </section>
      </div>
    </main>
  )
}
