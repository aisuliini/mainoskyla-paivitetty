'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type Category = {
  name: string
  href: string
  icon: ReactNode
  enabled?: boolean // jos puuttuu -> oletetaan true
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const visible = categories.filter((c) => c.enabled !== false)

  // pilkotaan 8 kategoriaa / sivu (4 x 2)
  const pageSize = 8
  const pages: Category[][] = []
  for (let i = 0; i < visible.length; i += pageSize) {
    pages.push(visible.slice(i, i + pageSize))
  }

  return (
    <section className="w-full bg-white">
      <div className="w-full overflow-x-auto overscroll-x-contain touch-pan-x scroll-smooth no-scrollbar">
        <div className="flex w-full snap-x snap-mandatory">
          {pages.map((page, idx) => (
            <div key={idx} className="min-w-full snap-start px-4 md:px-6">
              <div
                className="
                  grid grid-cols-4
                  gap-y-4 gap-x-3
                  py-3
                  md:gap-y-8 md:gap-x-8
                  md:max-w-5xl md:mx-auto
                "
              >
                {page.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="flex flex-col items-center text-center select-none"
                  >
                    <div className="grid place-items-center h-12 w-12 rounded-full bg-white ring-1 ring-black/10 shadow-sm">
                      {cat.icon}
                    </div>
                    <div className="mt-2 text-[12px] leading-tight text-charcoal">
                      {cat.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
