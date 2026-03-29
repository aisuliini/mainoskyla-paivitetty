'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  initialQ: string
  initialSijainti: string
}

export default function SearchLocationFilter({
  initialQ,
  initialSijainti,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paikkakunta, setPaikkakunta] = useState(initialSijainti)

  useEffect(() => {
    setPaikkakunta(initialSijainti)
  }, [initialSijainti])

  function apply() {
    if (!initialQ) return

    const next = new URLSearchParams(searchParams.toString())
    const value = paikkakunta.trim()

    if (!value) next.delete('sijainti')
    else next.set('sijainti', value)

    router.replace(`/aluehaku?${next.toString()}`)
  }

  function clear() {
    setPaikkakunta('')
    const next = new URLSearchParams(searchParams.toString())
    next.delete('sijainti')
    router.replace(`/aluehaku?${next.toString()}`)
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="w-full sm:max-w-sm">
        <label className="mb-1 block text-sm font-medium">
          📍 Paikkakunta (valinnainen)
        </label>
        <input
          value={paikkakunta}
          onChange={(e) => setPaikkakunta(e.target.value)}
          placeholder="Esim. Turku"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={apply}
          className="rounded bg-[#3f704d] px-4 py-2 text-sm text-white hover:bg-[#2f5332]"
        >
          Rajaa
        </button>

        <button
          type="button"
          onClick={clear}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Tyhjennä
        </button>
      </div>
    </div>
  )
}