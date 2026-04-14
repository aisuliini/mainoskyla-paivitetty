'use client'

import type { SuosittuIlmoitus } from '@/features/home/types/home-types'
import SectionHeader from '@/features/home/components/SectionHeader'
import HomeListingCompactCard from './HomeListingCompactCard'
import { registerView } from '@/features/listings/utils/viewTracker'

type Props = {
  items: SuosittuIlmoitus[]
  sectionRef: React.RefObject<HTMLDivElement | null>
  onScroll: (dir: 'left' | 'right') => void
  onViewed?: (id: string) => void
}

export default function LatestListingsSection({
  items = [],
  sectionRef,
  onScroll,
  onViewed,
}: Props) {
  if (items.length === 0) return null

  async function handleClick(id: string) {
    const counted = await registerView(id)
    if (counted) {
      onViewed?.(id)
    }
  }

  return (
    <div className="w-full mt-2 sm:mt-4">
      <SectionHeader
        title="Uusimmat ilmoitukset"
        description="Viimeksi lisätyt palvelut Mainoskylässä."
        actions={
          <>
            <button onClick={() => onScroll('left')}>‹</button>
            <button onClick={() => onScroll('right')}>›</button>
          </>
        }
      />

      <div className="mt-2 relative">
        <div
          ref={sectionRef}
          className="flex gap-3 scroll-x pr-6"
        >
          {items.map((ilmo) => (
            <div
  key={ilmo.id}
  onClick={() => handleClick(ilmo.id)}
  className="min-w-[280px] max-w-[280px] snap-start shrink-0 rounded-[22px] overflow-hidden"
>
  <HomeListingCompactCard
    item={ilmo}
    categoryLabel={ilmo.kategoria ?? undefined}
  />
</div>
          ))}
        </div>
      </div>
    </div>
  )
}