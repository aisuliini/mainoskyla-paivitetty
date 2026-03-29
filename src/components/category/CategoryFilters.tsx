'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const ALLOWED_SORTS = ['uusin', 'aakkoset'] as const
export type SortValue = (typeof ALLOWED_SORTS)[number]

type Props = {
  initialQ: string
  initialSijainti: string
  initialSort: SortValue
}

export default function CategoryFilters({
  initialQ,
  initialSijainti,
  initialSort,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(initialQ)
  const [sijainti, setSijainti] = useState(initialSijainti)
  const [sort, setSort] = useState<SortValue>(initialSort)

  useEffect(() => {
    setQ(initialQ)
    setSijainti(initialSijainti)
    setSort(initialSort)
  }, [initialQ, initialSijainti, initialSort])

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())

    const trimmedQ = q.trim()
    const trimmedSijainti = sijainti.trim()

    if (trimmedQ) params.set('q', trimmedQ)
    else params.delete('q')

    if (trimmedSijainti) params.set('sijainti', trimmedSijainti)
    else params.delete('sijainti')

    params.set('sort', sort)
    params.delete('page')

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  function resetFilters() {
    setQ('')
    setSijainti('')
    setSort('uusin')
    router.push(pathname)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      applyFilters()
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hae ilmoituksia"
          className="rounded-xl border px-3 py-2 text-sm"
        />

        <input
          value={sijainti}
          onChange={(e) => setSijainti(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paikkakunta"
          className="rounded-xl border px-3 py-2 text-sm"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          className="rounded-xl border px-3 py-2 text-sm"
        >
          <option value="uusin">Uusimmat</option>
          <option value="aakkoset">Aakkosjärjestys</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="flex-1 rounded-xl bg-[#4F6763] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Hae
          </button>

          <button
            onClick={resetFilters}
            className="rounded-xl border px-4 py-2 text-sm font-medium text-[#1E3A41] hover:bg-gray-50"
          >
            Tyhjennä
          </button>
        </div>
      </div>
    </div>
  )
}