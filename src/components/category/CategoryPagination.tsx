import Link from 'next/link'

type Props = {
  currentPage: number
  hasMore: boolean
  pathname: string
  searchParams: {
    q?: string
    sijainti?: string
    sort?: string
  }
}

function buildHref(
  pathname: string,
  page: number,
  searchParams: Props['searchParams']
) {
  const params = new URLSearchParams()

  if (searchParams.q) params.set('q', searchParams.q)
  if (searchParams.sijainti) params.set('sijainti', searchParams.sijainti)
  if (searchParams.sort) params.set('sort', searchParams.sort)
  if (page > 1) params.set('page', String(page))

  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export default function CategoryPagination({
  currentPage,
  hasMore,
  pathname,
  searchParams,
}: Props) {
  const prevPage = currentPage - 1
  const nextPage = currentPage + 1

  return (
    <nav className="mt-8 flex items-center justify-between" aria-label="Sivutus">
      <div>
        {currentPage > 1 ? (
          <Link
            href={buildHref(pathname, prevPage, searchParams)}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Edellinen
          </Link>
        ) : (
          <span className="inline-block rounded-xl border px-4 py-2 text-sm text-gray-400">
            Edellinen
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600">Sivu {currentPage}</div>

      <div>
        {hasMore ? (
          <Link
            href={buildHref(pathname, nextPage, searchParams)}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Seuraava
          </Link>
        ) : (
          <span className="inline-block rounded-xl border px-4 py-2 text-sm text-gray-400">
            Seuraava
          </span>
        )}
      </div>
    </nav>
  )
}