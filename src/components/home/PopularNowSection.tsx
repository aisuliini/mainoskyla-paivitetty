'use client'

import type { SuosittuIlmoitus } from '@/components/home/home-types'
import SectionHeader from '@/components/home/SectionHeader'
import HomeListingCarouselCard from '@/components/home/HomeListingCarouselCard'
type Props = {
  items: SuosittuIlmoitus[]
  sectionRef: React.RefObject<HTMLDivElement | null>
  onScroll: (dir: 'left' | 'right') => void
}

export default function PopularNowSection({ items, sectionRef, onScroll }: Props) {
  if (!items.length) return null

  return (
  <div className="w-full mt-2 sm:mt-5">
    <SectionHeader
      title="Suosittua juuri nyt"
      description="Kurkatuimmat palvelut ja kiinnostavat löydöt Mainoskylässä."
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

    <div className="mt-2 sm:mt-3 -mx-4 px-4 pr-6">
        <div
          ref={sectionRef}
          className="w-full flex flex-nowrap gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
         {items.map((ilmo) => (
  <HomeListingCarouselCard
    key={ilmo.id}
    item={ilmo}
    categoryLabel={ilmo.kategoria ?? undefined}
    imageOverlayClassName="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent"
  />
))}
        </div>
      </div>
    </div>
  )
}