'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type CategoryItem = {
  name: string
  href: string
  icon: React.ReactNode
}

type Props = {
  categories: CategoryItem[]
}

/** chunk -> sivut (Tori-tyyli: 2 riviä, 4 saraketta = 8 kategoriaa / “sivu”) */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function CategoryCarousel({ categories }: Props) {
  const router = useRouter()
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const pages = useMemo(() => chunk(categories, 8), [categories])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const updateShadows = () => {
      const maxScroll = el.scrollWidth - el.clientWidth
      setCanLeft(el.scrollLeft > 2)
      setCanRight(el.scrollLeft < maxScroll - 2)
    }

    // init
    updateShadows()

    const onScroll = () => updateShadows()
    el.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(() => updateShadows())
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative -mx-4">
      {/* fade vasen/oikea = vihje että voi selata */}
      {canLeft && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10" />
      )}
      {canRight && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />
      )}

      {/* pieni “Selaa →” vain jos oikealle on sisältöä */}
      {canRight && (
        <div className="pointer-events-none absolute right-3 top-2 z-20 text-[11px] text-[#1E3A41]/70 bg-white/70 px-2 py-1 rounded-full">
          Selaa →
        </div>
      )}

      {/* IMPORTANT: overflow piilottaa bodyn vaakaleveyden -> sivu ei enää “liiku” */}
      <div className="overflow-hidden">
        <div
          ref={scrollerRef}
          className="
            w-full overflow-x-auto overflow-y-hidden
            touch-pan-x scroll-smooth
            no-scrollbar
            snap-x snap-mandatory
            px-4 pr-14
          "
        >
          <div className="flex gap-4 w-max py-2">
            {pages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className="
                  flex-none snap-start
                  w-[calc(100vw-1.5rem)]
                  max-w-[520px]
                  bg-white
                "
              >
                <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                  {page.map((c) => (
                    <button
                      key={c.href}
                      type="button"
                      onClick={() => router.push(c.href)}
                      className="
                        flex flex-col items-center justify-start
                        gap-2
                        py-2
                        rounded-2xl
                        hover:bg-black/5
                        active:scale-[0.99]
                        transition
                      "
                    >
                      <span className="w-12 h-12 rounded-2xl ring-1 ring-black/10 bg-white shadow-sm flex items-center justify-center">
                        {c.icon}
                      </span>
                      <span className="text-[11px] leading-tight text-[#1E3A41] text-center w-[74px]">
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
