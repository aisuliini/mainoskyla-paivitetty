import { supabaseServer } from '@/lib/supabaseServer'
import type { ListingCardItem } from './listing-types'
import { getCategoryBySlug } from '@/lib/categories/category-config'

export type CategoryListingSort = 'uusin' | 'aakkoset'

type GetCategoryListingsParams = {
  categorySlug: string
  page?: number
  pageSize?: number
  sijainti?: string
  q?: string
  sort?: CategoryListingSort
}

export type GetCategoryListingsResult = {
  items: ListingCardItem[]
  page: number
  pageSize: number
  hasMore: boolean
  total: number
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, '')
}

export async function getCategoryListings({
  categorySlug,
  page = 1,
  pageSize = 24,
  sijainti,
  q,
  sort = 'uusin',
}: GetCategoryListingsParams): Promise<GetCategoryListingsResult> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.min(pageSize, 24)
      : 24

  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  const category = getCategoryBySlug(categorySlug)

    if (!category) {
    return {
      items: [],
      page: safePage,
      pageSize: safePageSize,
      hasMore: false,
      total: 0,
    }
  }

  const categoryValues = Array.from(
    new Set([category.slug, ...(category.legacyValues ?? [])])
  )

  let query = supabaseServer
    .from('ilmoitukset')
    .select(
      'id, otsikko, sijainti, kategoria, kuva_url, premium, premium_loppu, luotu',
      { count: 'exact' }
    )
    .eq('visible', true)
    .in('kategoria', categoryValues)

  const trimmedSijainti = sijainti?.trim()
  if (trimmedSijainti) {
    query = query.ilike('sijainti', `%${escapeLike(trimmedSijainti)}%`)
  }

   const trimmedQ = q?.trim()
  if (trimmedQ) {
    const safeQ = escapeLike(trimmedQ)
    query = query.ilike('otsikko', `%${safeQ}%`)
  }

  if (sort === 'aakkoset') {
    query = query
      .order('premium', { ascending: false })
      .order('otsikko', { ascending: true })
  } else {
    query = query
      .order('premium', { ascending: false })
      .order('luotu', { ascending: false })
  }

  const { data, count, error } = await query.range(from, to)

    if (error) {
    console.error('getCategoryListings error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      categorySlug,
      page: safePage,
      pageSize: safePageSize,
      sijainti: trimmedSijainti ?? '',
      q: trimmedQ ?? '',
      sort,
    })

    throw new Error(`Kategoriadatan haku epäonnistui: ${error.message}`)
  }

    return {
    items: (data ?? []) as ListingCardItem[],
    page: safePage,
    pageSize: safePageSize,
    hasMore: typeof count === 'number' ? to + 1 < count : false,
    total: typeof count === 'number' ? count : 0,
  }
}