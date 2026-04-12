export type PremiumIlmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string
  nayttoja?: number
}

export type SuosittuIlmoitus = {
  id: string
  otsikko: string
  kuvaus: string
  sijainti: string
  kuva_url?: string | null
  nayttoja?: number | null
  kategoria?: string | null
}

export type HomeProps = {
  initialPremiumIlmoitukset: PremiumIlmoitus[]
  initialNytSuosittua: SuosittuIlmoitus[]
  initialUusimmat: SuosittuIlmoitus[]
}