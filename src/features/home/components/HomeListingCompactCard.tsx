import Link from 'next/link'
import { Eye } from 'lucide-react'
import SafeCardImage from '@/components/shared/SafeCardImage'
import type { SuosittuIlmoitus } from '@/features/home/types/home-types'

type Props = {
  item: SuosittuIlmoitus
  categoryLabel?: string
}

export default function HomeListingCompactCard({
  item,
  categoryLabel,
}: Props) {
  return (
    <Link
      href={`/ilmoitukset/${item.id}`}
      className="
        group
        snap-start
        flex-none
        w-[170px] sm:w-[190px] lg:w-[210px]
        rounded-[18px]
        overflow-hidden
        bg-white
        ring-1 ring-black/5
        shadow-sm
        transition-transform duration-200
        hover:scale-[1.02]
        text-left
      "
    >
      <div className="relative w-full aspect-[16/10] bg-[#F6F7F7] overflow-hidden">
        <SafeCardImage
          src={item.kuva_url}
          alt={item.otsikko}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 170px, (max-width: 1024px) 190px, 210px"
        />
      </div>

      <div className="p-2.5">
        <div className="font-semibold text-[14px] leading-snug text-[#1E3A41] line-clamp-2 min-h-[38px]">
          {item.otsikko}
        </div>

        <div className="mt-1 text-xs text-charcoal/70 truncate">
          {item.sijainti}
        </div>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-charcoal/60">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F7F7] px-2 py-1">
            <Eye className="h-3.5 w-3.5" />
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