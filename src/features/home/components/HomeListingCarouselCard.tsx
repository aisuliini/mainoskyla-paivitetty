import Link from 'next/link'
import { Eye } from 'lucide-react'
import SafeCardImage from '@/components/shared/SafeCardImage'
import type { SuosittuIlmoitus } from '@/features/home/types/home-types'
import { registerView } from '@/features/listings/utils/viewTracker'

type Props = {
  item: SuosittuIlmoitus
  onViewed?: (id: string) => void
  categoryLabel?: string
  imageOverlayClassName?: string
}

export default function HomeListingCarouselCard({
  item,
  onViewed,
  categoryLabel,
  imageOverlayClassName = 'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent',
}: Props) {
  async function handleClick() {
    const counted = await registerView(item.id)

    if (counted) {
      onViewed?.(item.id)
    }
  }

  return (
    <Link
      href={`/ilmoitukset/${item.id}`}
      onClick={handleClick}
      className="
        group
        snap-start
        flex-none
        w-[220px] sm:w-[260px] lg:w-[300px]
        bg-white ring-1 ring-black/5
        rounded-[22px] overflow-hidden
        shadow-sm hover:shadow-lg
        hover:-translate-y-1
        transition-all duration-300
        text-left
      "
    >
      <div className="relative w-full aspect-[3/2] bg-[#F6F7F7] overflow-hidden">
        <SafeCardImage
          src={item.kuva_url}
          alt={item.otsikko}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
        />

        <div className={imageOverlayClassName} />
      </div>

      <div className="p-3">
        <div className="font-semibold text-sm text-[#1E3A41] truncate">
          {item.otsikko}
        </div>

        <div className="text-xs text-charcoal/70 truncate">
          {item.sijainti}
        </div>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-charcoal/60">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F7F7] px-2 py-1">
            <Eye className="h-4 w-4" />
            {item.nayttoja ?? 0}
          </span>

          {categoryLabel ? (
            <span className="truncate rounded-full bg-[#F6F7F7] px-2 py-1">
              {categoryLabel}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}