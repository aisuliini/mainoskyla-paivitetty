import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryBySlug } from '@/features/categories/config/category-config'
import {
  getCategoryListings,
  type CategoryListingSort,
} from '@/features/categories/server/getCategoryListings'
import ListingGrid from '@/features/listings/components/ListingGrid'
import CategoryFilters from '@/features/categories/components/CategoryFilters'
import CategoryPagination from '@/features/categories/components/CategoryPagination'
type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    page?: string
    sijainti?: string
    q?: string
    sort?: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Kategoriaa ei löytynyt | Mainoskylä',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: {
      canonical: `/kategoriat/${category.slug}`,
    },
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
      url: `https://mainoskyla.fi/kategoriat/${category.slug}`,
      siteName: 'Mainoskylä',
      locale: 'fi_FI',
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await searchParams

  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const parsedPage = Number(sp.page || '1')
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const sijainti = sp.sijainti?.trim() || ''
  const q = sp.q?.trim() || ''

  const allowedSorts: CategoryListingSort[] = ['uusin', 'aakkoset']
  const sort: CategoryListingSort = allowedSorts.includes(sp.sort as CategoryListingSort)
    ? (sp.sort as CategoryListingSort)
    : 'uusin'

  const result = await getCategoryListings({
    categorySlug: category.slug,
    page,
    pageSize: 24,
    sijainti,
    q,
    sort,
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">{category.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 md:text-base">
          {category.description}
        </p>
      </header>

            <CategoryFilters
        initialQ={q}
        initialSijainti={sijainti}
        initialSort={sort}
      />

                  <section className="mt-6">
        <div className="mb-4 text-sm text-gray-600">
          {result.total} ilmoitusta
        </div>

        <ListingGrid items={result.items} />

        <CategoryPagination
          currentPage={result.page}
          hasMore={result.hasMore}
          pathname={`/kategoriat/${category.slug}`}
          searchParams={{
            q,
            sijainti,
            sort,
          }}
        />
      </section>
    </main>
  )
}