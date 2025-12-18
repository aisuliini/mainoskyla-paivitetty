'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type Category = {
  name: string
  href: string
  icon: ReactNode
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  // pilkotaan 8 kategoriaa / sivu (4 x 2)
  const pageSize = 8
  const pages: Category[][] = []
  for (let i = 0; i < categories.length; i += pageSize) {
    pages.push(categories.slice(i, i + pageSize))
  }

  return (
    <section className="w-full bg-white">
      {/* tärkeät: overflow-x-auto + snap + overscroll-x-contain + touch-pan-x */}
      <div className="w-full overflow-x-auto overscroll-x-contain touch-pan-x scroll-smooth no-scrollbar">
        <div className="flex w-full snap-x snap-mandatory">
          {pages.map((page, idx) => (
            <div
              key={idx}
              className="min-w-full snap-start px-4 md:px-6"
            >
              {/* tämä grid on se “Tori 2 riviä” */}
              <div className="grid grid-cols-4 gap-y-6 gap-x-4 py-3 md:max-w-3xl md:mx-auto">
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
