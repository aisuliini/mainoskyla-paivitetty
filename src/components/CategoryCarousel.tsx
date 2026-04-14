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
      <div className="overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar px-4">
  <div className="flex snap-x snap-mandatory gap-3 pr-6">
          {pages.map((page, idx) => (
            <div
              key={idx}
              className="w-[84%] shrink-0 snap-start"
            >
              <div className="grid grid-cols-4 gap-x-3 gap-y-4 py-2">
                {page.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="flex flex-col items-center text-center select-none"
                  >
                    <div className="flex items-center justify-center h-[38px] w-[38px] rounded-full bg-[#EDF5F2] ring-1 ring-[#4F8F7A]/30 shadow-sm transition hover:bg-[#DCEEE8] overflow-visible [&_svg]:h-[16px] [&_svg]:w-[16px] [&_svg]:shrink-0">
                      {cat.icon}
                    </div>

                    <div className="mt-2 max-w-[72px] min-h-[34px] text-[10.5px] leading-[1.15] text-[#1E3A41] text-center break-words">
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