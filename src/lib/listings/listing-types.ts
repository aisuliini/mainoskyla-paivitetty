export type ListingCardItem = {
  id: string
  otsikko: string
  sijainti: string | null
  kategoria: string | null
  kuva_url: string | null
  premium: boolean | null
  premium_loppu: string | null
  luotu: string | null
  kuvaus_lyhyt?: string | null
}