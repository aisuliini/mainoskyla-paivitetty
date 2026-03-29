'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import paikkakunnat from '@/data/suomen-paikkakunnat.json'

const ESIMERKKIHAKUJA = [
  'kotiapu',
  'siivous',
  'remontti',
  'hieronta',
  'koirahoitaja',
  'valokuvaaja',
  'juhlatila',
  'pihanhoito',
] as const

export default function HomeSearch() {
  const router = useRouter()
  const [hakusana, setHakusana] = useState('')
  const [showDesktopSuggest, setShowDesktopSuggest] = useState(false)

  const query = hakusana.trim().toLowerCase()

  const palveluEhdotukset = useMemo(() => {
    if (!query) return [...ESIMERKKIHAKUJA].slice(0, 8)
    return ESIMERKKIHAKUJA.filter((x) => x.toLowerCase().includes(query)).slice(0, 8)
  }, [query])

  const paikkaEhdotukset = useMemo(() => {
    if (!query) return []
    return (paikkakunnat as string[])
      .filter((p) => p.toLowerCase().includes(query))
      .slice(0, 8)
  }, [query])

  const hae = () => {
    const q = hakusana.trim()
    if (!q) return
    router.push(`/aluehaku?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto mt-4 sm:mt-6 text-left">
      <div className="w-full">
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => router.push('/haku')}
            className="
              w-full rounded-full border border-charcoal/15 bg-white
              pl-5 pr-12 py-4 text-left
              text-charcoal/70
              relative
            "
            aria-label="Avaa haku"
          >
            Hae paikkakuntaa tai palvelua...
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/60">
              <Search size={20} />
            </span>
          </button>
        </div>

        <div className="sm:hidden mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => router.push('/lisaa')}
            className="
              rounded-full
              px-8 py-3
              text-sm font-semibold
              bg-[#EDF5F2] text-[#1E3A41]
              hover:bg-[#DCEEE8]
              transition
              ring-1 ring-[#4F8F7A]/35
            "
          >
            Lisää ilmoitus (ilmainen)
          </button>
        </div>

        <div className="hidden sm:block">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              hae()
            }}
            className="relative"
          >
            <input
              type="search"
              placeholder="Hae palvelua tai tekijää..."
              value={hakusana}
              onChange={(e) => {
                setHakusana(e.target.value)
                setShowDesktopSuggest(true)
              }}
              onFocus={() => setShowDesktopSuggest(true)}
              onBlur={() => {
                setTimeout(() => setShowDesktopSuggest(false), 120)
              }}
              className="
                w-full rounded-full border border-charcoal/15 bg-white
                pl-5 pr-12 py-4 text-charcoal placeholder:text-charcoal/50
                outline-none focus:outline-none focus:ring-0 focus:border-charcoal/30
              "
              inputMode="search"
              enterKeyHint="search"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
            />

            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/70 hover:text-persikka transition"
              aria-label="Hae"
            >
              <Search size={20} />
            </button>

            {showDesktopSuggest &&
              (palveluEhdotukset.length > 0 || paikkaEhdotukset.length > 0) && (
                <div className="absolute left-0 right-0 mt-2 z-20">
                  <div className="bg-white/95 backdrop-blur border border-black/10 rounded-2xl shadow-md overflow-hidden">
                    <ul className="max-h-80 overflow-y-auto py-1">
                      {paikkaEhdotukset.length > 0 && (
                        <li className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-wide text-charcoal/50">
                          Paikkakunnat
                        </li>
                      )}

                      {paikkaEhdotukset.slice(0, 8).map((p) => (
                        <li key={`paikka-${p}`}>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center justify-between"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setHakusana(p)
                              setShowDesktopSuggest(false)
                              router.push(`/aluehaku?q=${encodeURIComponent(p)}`)
                            }}
                          >
                            <span>{p}</span>
                            <span className="text-[11px] text-charcoal/40">alue</span>
                          </button>
                        </li>
                      ))}

                      {palveluEhdotukset.length > 0 && (
                        <li className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-wide text-charcoal/50">
                          Palvelut ja tekijät
                        </li>
                      )}

                      {palveluEhdotukset.slice(0, 8).map((x) => (
                        <li key={`palvelu-${x}`}>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center justify-between"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setHakusana(x)
                              setShowDesktopSuggest(false)
                              router.push(`/aluehaku?q=${encodeURIComponent(x)}`)
                            }}
                          >
                            <span>{x}</span>
                            <span className="text-[11px] text-charcoal/40">haku</span>
                          </button>
                        </li>
                      ))}

                      <li className="border-t border-black/10 mt-1">
                        <button
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-black/5 font-semibold text-[#1E3A41]"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setShowDesktopSuggest(false)
                            hae()
                          }}
                        >
                          Näytä kaikki tulokset →
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
          </form>

          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.push('/lisaa')}
              className="
                rounded-full px-7 py-3 text-sm font-semibold
                bg-[#EDF5F2] text-[#1E3A41]
                hover:bg-[#DCEEE8] transition
                ring-1 ring-[#4F8F7A]/35
              "
            >
              Lisää ilmoitus (ilmainen)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}