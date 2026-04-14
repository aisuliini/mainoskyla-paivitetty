'use client'

import type { SuosittuIlmoitus } from '@/features/home/types/home-types'
import SectionHeader from '@/features/home/components/SectionHeader'
import HomeListingCarouselCard from './HomeListingCarouselCard'

type Props = {
  items: SuosittuIlmoitus[]
  sectionRef: React.RefObject<HTMLDivElement | null>
  onScroll: (dir: 'left' | 'right') => void
  onViewed?: (id: string) => void
}

export default function PopularNowSection({
  items = [],
  sectionRef,
  onScroll,
  onViewed,
}: Props) {
  if (items.length === 0) return null

  return (
  <div className="w-full mt-2 sm:mt-5 mb-10 sm:mb-12">
      <SectionHeader
        title="Suosittua juuri nyt"
        description="Kurkatuimmat palvelut ja kiinnostavat löydöt Mainoskylässä."
        actions={
          <>
            <button onClick={() => onScroll('left')}>‹</button>
            <button onClick={() => onScroll('right')}>›</button>
          </>
        }
      />

      <div className="mt-2 sm:mt-3 -mx-4 overflow-x-auto no-scrollbar px-4 pb-2">
  <div
    ref={sectionRef}
    className="flex items-stretch gap-3 pr-4"
  >
  {items.map((ilmo) => (
    <div
      key={ilmo.id}
      className="min-w-[250px] max-w-[250px] snap-start shrink-0 self-stretch"
    >
      <HomeListingCarouselCard
        item={ilmo}
        onViewed={onViewed}
        categoryLabel={ilmo.kategoria ?? undefined}
      />
    </div>
  ))}
</div>
      </div>
    </div>
  )
}