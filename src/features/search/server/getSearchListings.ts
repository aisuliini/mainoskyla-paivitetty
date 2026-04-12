import { supabaseServer } from '@/lib/supabaseServer'
import type { ListingCardItem } from '../../listings/types/listing-types'

type GetSearchListingsParams = {
  q?: string
  sijainti?: string
  page?: number
  pageSize?: number
}

export type GetSearchListingsResult = {
  items: ListingCardItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, '')
}

export async function getSearchListings({
  q = '',
  sijainti = '',
  page = 1,
  pageSize = 24,
}: GetSearchListingsParams): Promise<GetSearchListingsResult> {
  const trimmedQ = q.trim()
  const trimmedSijainti = sijainti.trim()

  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.min(pageSize, 24)
      : 24

  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  if (!trimmedQ && !trimmedSijainti) {
    return {
      items: [],
      total: 0,
      page: safePage,
      pageSize: safePageSize,
      hasMore: false,
    }
  }

  const nytISO = new Date().toISOString()

  let query = supabaseServer
    .from('ilmoitukset')
    .select(
      'id, otsikko, sijainti, kategoria, kuva_url, premium, premium_loppu, luotu',
      { count: 'exact' }
    )
    .eq('visible', true)
    .or(
      `and(voimassa_alku.is.null,voimassa_loppu.is.null),and(voimassa_alku.lte.${nytISO},voimassa_loppu.gte.${nytISO}),and(voimassa_alku.is.null,voimassa_loppu.gte.${nytISO}),and(voimassa_alku.lte.${nytISO},voimassa_loppu.is.null)`.replace(/\s+/g, '')
    )

  if (trimmedQ) {
    const safeQ = escapeLike(trimmedQ)
    query = query.or(
      `otsikko.ilike.%${safeQ}%,sijainti.ilike.%${safeQ}%`.replace(/\s+/g, '')
    )
  }

  if (trimmedSijainti) {
    const safeSijainti = escapeLike(trimmedSijainti)
    query = query.ilike('sijainti', `%${safeSijainti}%`)
  }

  query = query.order('premium', { ascending: false }).order('luotu', { ascending: false })

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error('getSearchListings error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      q: trimmedQ,
      sijainti: trimmedSijainti,
      page: safePage,
      pageSize: safePageSize,
    })

    throw new Error(`Hakutulosten haku epäonnistui: ${error.message}`)
  }

  return {
    items: (data ?? []) as ListingCardItem[],
    total: typeof count === 'number' ? count : 0,
    page: safePage,
    pageSize: safePageSize,
    hasMore: typeof count === 'number' ? to + 1 < count : false,
  }
}