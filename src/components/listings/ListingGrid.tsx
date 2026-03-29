import type { ListingCardItem } from '@/lib/listings/listing-types'
import ListingCard from './ListingCard'

type Props = {
  items: ListingCardItem[]
}

export default function ListingGrid({ items }: Props) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600">
        Ei ilmoituksia valituilla hakuehdoilla.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ListingCard key={item.id} item={item} />
      ))}
    </div>
  )
}