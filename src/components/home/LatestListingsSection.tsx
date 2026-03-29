'use client'

import { CATEGORY_CONFIG, normalizeCategoryValue } from '@/lib/categories/category-config'
import type { SuosittuIlmoitus } from '@/components/home/home-types'
import SectionHeader from '@/components/home/SectionHeader'
import HomeListingCarouselCard from '@/components/home/HomeListingCarouselCard'
type Props = {
  items: SuosittuIlmoitus[]
  sectionRef: React.RefObject<HTMLDivElement | null>
  onScroll: (dir: 'left' | 'right') => void
}

function getCategoryLabel(value?: string | null) {
  const normalized = normalizeCategoryValue(value)
  const found = CATEGORY_CONFIG.find((category) => category.slug === normalized)
  return found?.name ?? value ?? ''
}

export default function LatestListingsSection({ items, sectionRef, onScroll }: Props) {
  if (!items.length) return null

  return (
    <section className="bg-white px-4 sm:px-6 py-8">
      <div className="max-w-screen-xl mx-auto">
        <SectionHeader
          title="Uusimmat ilmoitukset"
          description="Tuoreimmat tekijät ja palvelut – lisääntyvät koko ajan"
          actions={
            <>
              <button
                type="button"
                onClick={() => onScroll('left')}
                className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
                aria-label="Selaa vasemmalle"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => onScroll('right')}
                className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
                aria-label="Selaa oikealle"
              >
                ›
              </button>
            </>
          }
        />

        <div className="mt-3 -mx-4 px-4 pr-6">
          <div
            ref={sectionRef}
            className="w-full flex flex-nowrap gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((ilmo) => (
  <HomeListingCarouselCard
    key={ilmo.id}
    item={ilmo}
    categoryLabel={ilmo.kategoria ? getCategoryLabel(ilmo.kategoria) : undefined}
    imageOverlayClassName="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 via-black/10 to-transparent"
  />
))}
          </div>
        </div>
      </div>
    </section>
  )
}