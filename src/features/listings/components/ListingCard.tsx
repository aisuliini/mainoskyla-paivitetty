import Link from 'next/link'
import type { ListingCardItem } from '@/features/listings/types/listing-types'
import SafeCardImage from '../../../components/shared/SafeCardImage'


type Props = {
  item: ListingCardItem
}

export default function ListingCard({ item }: Props) {
  return (
    <Link
      href={`/ilmoitukset/${item.id}`}
      className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        <SafeCardImage
          src={item.kuva_url}
          alt={item.otsikko}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {item.premium ? (
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
            Premium
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <h2 className="line-clamp-2 text-base font-semibold text-gray-900">
          {item.otsikko}
        </h2>

        <div className="mt-2 text-sm text-gray-600">
          {item.sijainti || 'Sijainti puuttuu'}
        </div>
      </div>
    </Link>
  )
}