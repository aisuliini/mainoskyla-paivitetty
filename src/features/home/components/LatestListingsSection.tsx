'use client'

import type { SuosittuIlmoitus } from '@/features/home/types/home-types'
import SectionHeader from '@/features/home/components/SectionHeader'
import HomeListingCompactCard from './HomeListingCompactCard'

type Props = {
  items: SuosittuIlmoitus[]
  sectionRef: React.RefObject<HTMLDivElement | null>
  onScroll: (dir: 'left' | 'right') => void
}

export default function LatestListingsSection({
  items = [],
  sectionRef,
  onScroll,
}: Props) {
  if (items.length === 0) return null

  return (
    <div className="w-full mt-2 sm:mt-4">
      <SectionHeader
        title="Uusimmat ilmoitukset"
        description="Viimeksi lisätyt palvelut Mainoskylässä."
        actions={
          <>
            <button
              type="button"
              onClick={() => onScroll('left')}
              className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => onScroll('right')}
              className="h-9 w-9 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 flex items-center justify-center"
            >
              ›
            </button>
          </>
        }
      />

      <div className="mt-2">
        <div
          ref={sectionRef}
          className="w-full flex flex-nowrap gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {items.map((ilmo) => (
  <HomeListingCompactCard
    key={ilmo.id}
    item={ilmo}
    categoryLabel={ilmo.kategoria ?? undefined}
  />
))}
        </div>
      </div>
    </div>
  )
}