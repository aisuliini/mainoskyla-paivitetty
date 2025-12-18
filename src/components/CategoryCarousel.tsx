'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Category = {
  name: string
  href: string
  icon: React.ReactNode
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  const updateShadows = () => {
    const el = scrollerRef.current
    if (!el) return
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 2)
  }

  useEffect(() => {
    updateShadows()
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => updateShadows()
    el.addEventListener('scroll', onScroll, { passive: true })

    // myös kun layout muuttuu (fontit, kuvat, viewport)
    const ro = new ResizeObserver(() => updateShadows())
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll as any)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative">
      {/* Fade vasen (näkyy vasta kun on scrollattu vähän) */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
      )}

      {/* Fade oikea + vihje */}
      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-2 top-2 z-20 text-[11px] text-[#1E3A41]/70 bg-white/80 px-2 py-1 rounded-full shadow-sm ring-1 ring-black/5">
            Selaa →
          </div>
        </>
      )}

      {/* Scroll-rivi */}
      <div
        ref={scrollerRef}
        className="w-full overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] scroll-smooth"
      >
        {/* pr-16 tekee “tilan” jotta viimeinen ei liimaudu reunaan */}
        <div className="flex gap-3 w-max pr-16 py-2 px-1">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center gap-2 h-12 px-4 rounded-full bg-white ring-1 ring-black/10 shadow-sm active:scale-[0.98] transition flex-none"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4F6763]/10">
                {c.icon}
              </span>
              <span className="text-sm whitespace-nowrap text-[#1E3A41]">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tekstivihje (näkyy vain jos oikealle voi scrollata) */}
      {canScrollRight && (
        <p className="mt-2 text-[11px] text-[#1E3A41]/55 text-center">
          Vedä sivulle nähdäksesi lisää kategorioita
        </p>
      )}
    </div>
  )
}
