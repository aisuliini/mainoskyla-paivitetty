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

      <div className="mt-2 sm:mt-3 -mx-4 px-4 pr-6">
        <div
  ref={sectionRef}
  className="flex gap-3 scroll-x pr-6"
>
  {items.map((ilmo) => (
    <div
      key={ilmo.id}
      className="min-w-[300px] max-w-[300px] snap-start shrink-0 rounded-[22px] overflow-hidden"
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