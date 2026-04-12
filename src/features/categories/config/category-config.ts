export type CategoryConfig = {
  readonly slug: string
  readonly name: string
  readonly title: string
  readonly description: string
  readonly seoTitle: string
  readonly seoDescription: string
  readonly legacyValues?: readonly string[]
}

export const CATEGORY_CONFIG: readonly CategoryConfig[] = [
  {
    slug: 'arjen-palvelut',
    name: 'Arjen palvelut',
    title: 'Arjen palvelut',
    description: 'Löydä arkea helpottavat paikalliset palvelut helposti.',
    seoTitle: 'Arjen palvelut | Mainoskylä',
    seoDescription:
      'Löydä siivous, asiointiapu, ompelukorjaukset, huoltopalvelut ja muut arjen palvelut Mainoskylästä.',
    legacyValues: ['Arjen palvelut', 'arjen-palvelut'],
  },
  {
  slug: 'erikoisliikkeet-ja-myymalat',
  name: 'Erikoisliikkeet ja myymälät',
  title: 'Erikoisliikkeet ja myymälät',
  description: 'Tutustu paikallisiin erikoisliikkeisiin ja pieniin myymälöihin.',
  seoTitle: 'Erikoisliikkeet ja myymälät | Mainoskylä',
  seoDescription:
    'Löydä paikalliset erikoisliikkeet, putiikit, kukkakaupat, pyöräliikkeet ja muut myymälät Mainoskylästä.',
  legacyValues: ['Erikoisliikkeet ja myymälät', 'erikoisliikkeet-ja-myymalat'],
},
  {
    slug: 'koti-ja-remontointi',
    name: 'Koti ja remontointi',
    title: 'Koti ja remontointi',
    description: 'Löydä paikalliset koti- ja remontointipalvelut helposti.',
    seoTitle: 'Koti ja remontointi | Mainoskylä',
    seoDescription:
      'Löydä paikalliset koti- ja remontointipalvelut Mainoskylästä. Selaa ilmoituksia paikkakunnittain.',
    legacyValues: ['Koti ja Remontointi', 'koti-ja-remontointi'],
  },
  {
    slug: 'hyvinvointi-ja-kauneus',
    name: 'Hyvinvointi ja kauneus',
    title: 'Hyvinvointi ja kauneus',
    description: 'Löydä hyvinvoinnin ja kauneuden palveluita läheltäsi.',
    seoTitle: 'Hyvinvointi ja kauneus | Mainoskylä',
    seoDescription:
      'Selaa hierojat, kosmetologit, parturi-kampaajat ja muut hyvinvoinnin palvelut Mainoskylässä.',
    legacyValues: ['Hyvinvointi ja Kauneus', 'hyvinvointi-ja-kauneus'],
  },
  {
    slug: 'elainpalvelut',
    name: 'Eläinpalvelut',
    title: 'Eläinpalvelut',
    description: 'Löydä paikalliset eläinpalvelut ja lemmikkien osaajat.',
    seoTitle: 'Eläinpalvelut | Mainoskylä',
    seoDescription:
      'Löydä trimmaus, hoito, koulutus ja muut eläinpalvelut Mainoskylästä.',
    legacyValues: ['Eläinpalvelut', 'elainpalvelut'],
  },
  {
    slug: 'luovat-palvelut-ja-esiintyjat',
    name: 'Luovat palvelut ja esiintyjät',
    title: 'Luovat palvelut ja esiintyjät',
    description: 'Löydä luovat tekijät, media-alan osaajat ja esiintyjät.',
    seoTitle: 'Luovat palvelut ja esiintyjät | Mainoskylä',
    seoDescription:
      'Selaa kuvaajat, videokuvaajat, graafikot, muusikot, näyttelijät ja muut luovat palvelut Mainoskylässä.',
    legacyValues: ['Media ja Luovuus', 'media-ja-luovuus'],
  },
  {
    slug: 'kasityolaiset-ja-pientuottajat',
    name: 'Käsityöläiset ja pientuottajat',
    title: 'Käsityöläiset ja pientuottajat',
    description: 'Tutustu paikallisiin käsityöläisiin, tekijöihin ja pientuottajiin.',
    seoTitle: 'Käsityöläiset ja pientuottajat | Mainoskylä',
    seoDescription:
      'Löydä käsityöt, lähituotteet, uniikit tuotteet ja pientuottajien palvelut Mainoskylästä.',
    legacyValues: [
  'Käsityöläiset',
  'käsityöläiset',
  'kasityolaiset',
  'Pientuottajat',
  'pientuottajat',
  'Käsityöläiset ja pientuottajat',
],
  },
  {
    slug: 'tapahtumat-ja-juhlapalvelut',
    name: 'Tapahtumat ja juhlapalvelut',
    title: 'Tapahtumat ja juhlapalvelut',
    description: 'Löydä tapahtumia, ohjelmaa ja juhlapalveluita helposti.',
    seoTitle: 'Tapahtumat ja juhlapalvelut | Mainoskylä',
    seoDescription:
      'Selaa tapahtumat, catering, koristelu, ohjelmapalvelut ja muut juhlapalvelut Mainoskylässä.',
    legacyValues: ['Tapahtumat', 'tapahtumat'],
  },
  {
    slug: 'tilat-ja-vuokraus',
    name: 'Tilat ja vuokraus',
    title: 'Tilat ja vuokraus',
    description: 'Löydä vuokrattavat tilat, juhlatilat ja muut varattavat kohteet.',
    seoTitle: 'Tilat ja vuokraus | Mainoskylä',
    seoDescription:
      'Löydä juhlatilat, vuokratilat ja muut varattavat tilat Mainoskylästä helposti.',
    legacyValues: ['Vuokratilat ja Juhlapaikat', 'vuokratilat-ja-juhlapaikat'],
  },
  {
    slug: 'valmennus-ja-asiantuntijapalvelut',
    name: 'Valmennus ja asiantuntijapalvelut',
    title: 'Valmennus ja asiantuntijapalvelut',
    description: 'Löydä valmentajat, kouluttajat, mentorit ja asiantuntijapalvelut.',
    seoTitle: 'Valmennus ja asiantuntijapalvelut | Mainoskylä',
    seoDescription:
      'Selaa valmennus-, koulutus-, mentorointi- ja asiantuntijapalvelut Mainoskylässä.',
    legacyValues: ['Kurssit ja koulutukset', 'kurssit-ja-koulutukset'],
  },
]

export function getCategoryBySlug(slug: string) {
  return CATEGORY_CONFIG.find((category) => category.slug === slug)
}

export function normalizeCategoryValue(value: string | null | undefined) {
  if (!value) return ''

  const normalizedInput = value.trim()

  const exact = CATEGORY_CONFIG.find(
    (category) => category.slug.toLowerCase() === normalizedInput.toLowerCase()
  )
  if (exact) return exact.slug

  const legacy = CATEGORY_CONFIG.find((category) =>
    (category.legacyValues ?? []).some(
      (legacyValue) => legacyValue.trim().toLowerCase() === normalizedInput.toLowerCase()
    )
  )
  if (legacy) return legacy.slug

  return normalizedInput
}