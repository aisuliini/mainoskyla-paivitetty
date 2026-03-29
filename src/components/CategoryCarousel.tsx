'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type Category = {
  name: ReactNode
  href: string
  icon: ReactNode
  enabled?: boolean
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const visible = categories.filter((c) => c.enabled !== false)

  const pageSize = 8
  const pages: Category[][] = []

  for (let i = 0; i < visible.length; i += pageSize) {
    pages.push(visible.slice(i, i + pageSize))
  }

  return (
    <section className="w-full bg-white">
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar">
          <div className="flex snap-x snap-mandatory">
            {pages.map((page, idx) => (
              <div
                key={idx}
                className="w-[86%] shrink-0 snap-start pl-1 pr-2"
              >
                <div className="grid grid-cols-4 gap-x-3 gap-y-5 py-2">
                  {page.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="flex flex-col items-center text-center select-none"
                    >
                      <div className="grid place-items-center h-12 w-12 rounded-full bg-[#EDF5F2] ring-1 ring-[#4F8F7A]/30 shadow-sm transition hover:bg-[#DCEEE8]">
                        {cat.icon}
                      </div>

                      <div className="mt-2 max-w-[78px] min-h-[34px] text-[11px] leading-[1.15] text-[#1E3A41] text-center break-words">
                        {cat.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent" />
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-[#1E3A41]/65 shadow-sm">
              Lisää →
            </div>
          </>
        )}
      </div>
    </section>
  )
}