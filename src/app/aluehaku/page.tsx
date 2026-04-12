import type { Metadata } from 'next'
import ListingGrid from '@/features/listings/components/ListingGrid'
import CityBanner from '@/features/banners/components/CityBanner'
import SearchLocationFilter from '@/components/search/SearchLocationFilter'
import { getSearchListings } from '@/features/search/server/getSearchListings'
import CategoryPagination from '@/features/categories/components/CategoryPagination'


type PageProps = {
  searchParams: Promise<{
    q?: string
    sijainti?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const q = (sp.q ?? '').trim()
  const sijainti = (sp.sijainti ?? '').trim()

  if (!q && !sijainti) {
    return {
      title: 'Haku | Mainoskylä',
      description: 'Hae paikallisia palveluita Mainoskylästä.',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const title =
    q && sijainti
      ? `Hakutulokset: ${q} – ${sijainti} | Mainoskylä`
      : `Hakutulokset: ${q || sijainti} | Mainoskylä`

  const description =
    q && sijainti
      ? `Selaa hakutuloksia haulle ${q} paikkakunnalla ${sijainti}.`
      : `Selaa hakutuloksia haulle ${q || sijainti} Mainoskylässä.`

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function AluehakuPage({ searchParams }: PageProps) {
  const sp = await searchParams

  const q = (sp.q ?? '').trim()
  const sijainti = (sp.sijainti ?? '').trim()

  const parsedPage = Number(sp.page || '1')
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const hakusana = q || (!q && sijainti ? sijainti : '')

  const otsikkoTeksti = !hakusana
    ? 'Haku'
    : q && sijainti
      ? `Hakutulokset: ${q} — ${sijainti}`
      : `Hakutulokset: ${hakusana}`

  const result = await getSearchListings({
    q,
    sijainti,
    page,
    pageSize: 24,
  })

  return (
    <main className="mx-auto max-w-screen-xl p-6">
      {!hakusana ? (
        <div className="max-w-xl">
          <h1 className="mb-2 text-2xl font-bold">Haku</h1>
          <p className="text-gray-600">
            Kirjoita hakusana yläpalkin hakuun, niin näytän tulokset tässä.
            <br />
            Tällä sivulla voit rajata tuloksia paikkakunnalla.
          </p>
        </div>
      ) : (
        <>
          <h1 className="mb-4 text-2xl font-bold">{otsikkoTeksti}</h1>

          <div className="mb-6">
            <CityBanner city={sijainti || hakusana} />
          </div>

          {q ? (
            <SearchLocationFilter
              initialQ={q}
              initialSijainti={sijainti}
            />
          ) : null}

                    <div className="mb-4 text-sm text-gray-600">
            {result.total} ilmoitusta
          </div>

          <ListingGrid items={result.items} />

          <CategoryPagination
            currentPage={result.page}
            hasMore={result.hasMore}
            pathname="/aluehaku"
            searchParams={{
              q,
              sijainti,
            }}
          />
        </>
      )}
    </main>
  )
}