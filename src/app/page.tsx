'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Eye } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import ehdotukset from '@/data/ehdotusdata.json'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hakusana, setHakusana] = useState(searchParams.get('sijainti') || '')
  const [premiumIlmoitukset, setPremiumIlmoitukset] = useState<any[]>([])
  const [suositukset, setSuositukset] = useState<string[]>([])

  useEffect(() => {
    const nyt = new Date().toISOString()
    const haePremiumit = async () => {
      const { data, error } = await supabase
        .from('ilmoitukset')
        .select('*')
        .eq('premium', true)
        .eq('premium_tyyppi', 'etusivu')
        .lte('premium_alku', nyt)
        .gte('premium_loppu', nyt)
        .order('premium_alku', { ascending: true })
        .order('id', { ascending: true })
        .limit(20)

      if (!error && data) {
  const taydelliset = [...data]

  while (taydelliset.length < 20) {
    taydelliset.push({
      id: `tyhja-${taydelliset.length}`,
      otsikko: 'Vapaa mainospaikka',
      kuvaus: 'Tämä paikka voi olla sinun!',
      sijainti: '',
      kuva_url: '',
      nayttoja: 0
    })
  }

  setPremiumIlmoitukset(taydelliset)
}

    }
    haePremiumit()
  }, [])

  useEffect(() => {
    if (hakusana.length > 1) {
      const filtered = ehdotukset.filter((e) =>
        e.toLowerCase().includes(hakusana.toLowerCase())
      )
      setSuositukset(filtered.slice(0, 5))
    } else {
      setSuositukset([])
    }
  }, [hakusana])

  const hae = () => {
  const query = hakusana.trim()
  if (query) {
    router.push(`/aluehaku?sijainti=${encodeURIComponent(query)}`)
  }
}



  const avaaIlmoitus = (ilmo: any) => {
  router.push(`/ilmoitukset/${ilmo.id}`)
}


  const kategoriat = [
  'Palvelut',
  'Hyvinvointi ja Kauneus',
  'Koti ja Remontointi',
  'Eläinpalvelut',
  'Pientuottajat',
  'Käsityöläiset',
  'Media ja Luovuus',
  'Kurssit ja Koulutukset',
  'Vuokratilat ja Juhlapaikat',
  'Ilmoitustaulu',
  'Tapahtumat',
  'Vapaa-aika',
  'Muut'
]



  const urlSafeKategoria = (kategoria: string) =>
    encodeURIComponent(kategoria.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, '-'))

  return (
    <main className="bg-[#f9f5eb] text-[#333333] min-h-screen font-sans">
      <section className="py-8 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex-shrink-0">
              <Image src="/logo.png" alt="Mainoskylä logo" width={140} height={140} className="mx-auto md:mx-0" />
            </div>

            <div className="w-full text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-[#2f5332] drop-shadow-sm">
                Mainosta paikallisesti,<br />näy siellä missä olet.
              </h1>

              {/* Tämä osuus on uusi */}
            <p className="text-base md:text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
            <strong>Mainoskylä on kehitysvaiheessa. Ilmoitusten lisääminen ei vaadi maksua.</strong>
             </p>

              <div className="relative max-w-lg mx-auto md:mx-0">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Hae paikkakunta tai sana..."
                    value={hakusana}
                    onChange={(e) => setHakusana(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && hae()}
                    className="flex-grow px-6 py-3 border rounded-full shadow-sm bg-white text-lg w-full"
                  />
                  <button
                    onClick={hae}
                    className="bg-[#3f704d] text-white px-6 py-3 rounded-full text-lg hover:bg-[#2f5332]"
                  >
                    Hae
                  </button>
                </div>
                {suositukset.length > 0 && (
                  <ul className="absolute bg-white border rounded shadow w-full mt-1 z-10 max-h-40 overflow-y-auto">

                    {suositukset.map((ehto, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer text-left"
                        onClick={() => setHakusana(ehto)}
                      >
                        {ehto}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {kategoriat.map((kategoria) => (
                  <button
                    key={kategoria}
                    onClick={() => router.push(`/kategoriat/${urlSafeKategoria(kategoria)}`)}
                    className="bg-white border px-4 py-2 rounded-full text-sm shadow hover:bg-[#e0f0e0]"
                  >
                    {kategoria}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-xl font-semibold text-[#2f5332] mb-4">Etusivun Premium-ilmoitukset</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">

            {premiumIlmoitukset.map((ilmo) => (
  <div key={ilmo.id} className="bg-[#e6f4ea] border border-[#3f704d] rounded-xl p-3 shadow-sm">
    {ilmo.kuva_url ? (
      <img src={ilmo.kuva_url} alt={ilmo.otsikko} className="h-32 w-full object-cover rounded mb-2" />
    ) : (
      <div className="h-32 bg-white rounded mb-2" />
    )}

    <h3 className="font-semibold text-sm text-gray-900 truncate">
      {ilmo.otsikko || 'Vapaa mainospaikka'}
    </h3>
    <p className="text-xs text-gray-600 line-clamp-2">
      {ilmo.kuvaus || 'Tämä paikka voi olla sinun ilmoituksesi – näkyvyyttä etusivulla!'}
    </p>
    <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
      👁️ {ilmo.nayttoja || 0} katselukertaa
    </div>

    {/* ✅ Näytä painike vain jos ilmoitus on oikea eikä placeholder */}
    {'kuva_url' in ilmo && ilmo.id?.startsWith('tyhja-') === false && (
      <button
        className="mt-2 w-full px-3 py-1 text-xs bg-[#3f704d] text-white rounded hover:bg-[#2f5332]"
        onClick={() => avaaIlmoitus(ilmo)}
      >
        Näytä
      </button>
    )}

    {/* ✅ Jos haluat lisätä painikkeen “Lisää oma ilmoitus” tyhjille paikoille */}
    {ilmo.id?.startsWith('tyhja-') && (
      <button
        onClick={() => router.push('/lisaa')}
        className="mt-2 w-full px-3 py-1 text-xs bg-white text-[#3f704d] border border-[#3f704d] rounded hover:bg-[#e0f0e0]"
      >
        Lisää oma ilmoitus
      </button>
    )}
  </div>
))}

          </div>
        </div>
      </section>

      <footer className="bg-[#e6e2d8] text-sm text-[#2f5332] text-center py-8 mt-12">
        <div className="space-y-4">
          <nav className="flex flex-wrap justify-center gap-4 font-medium">
            <Link href="/tietoa" className="hover:underline">Tietoa meistä</Link>
            <Link href="/hinnasto" className="hover:underline">Hinnasto</Link>
            <Link href="/ehdot" className="hover:underline">Käyttöehdot</Link>
            <Link href="/tietosuoja" className="hover:underline">Tietosuoja</Link>
            <li><Link href="/turvallisuus" className="text-blue-600 underline">Turvallisuusohjeet</Link></li>
            <Link href="/yhteystiedot" className="hover:underline">Yhteystiedot</Link>
          </nav>
          <div className="flex justify-center gap-6 text-xl">
            <a href="https://facebook.com/mainoskyla" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="hover:text-blue-600" />
            </a>
            <a href="https://tiktok.com/@mainoskyla" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok className="hover:text-black" />
            </a>
            <a href="https://instagram.com/mainoskyla" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="hover:text-pink-500" />
            </a>
          </div>
          <div className="space-y-1">
          <p className="text-xs text-gray-600">
           Tämä sivusto on opiskelijaprojekti ja testiversio. Ilmoitukset ovat maksuttomia ja alusta on kehitysvaiheessa.
          </p>
         <p>&copy; {new Date().getFullYear()} Mainoskylä</p>
        </div>

        </div>
      </footer>
    </main>
  )
}
