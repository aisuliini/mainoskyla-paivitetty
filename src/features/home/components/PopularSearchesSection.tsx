'use client'

import { useRouter } from 'next/navigation'

const haut = [
  'Doula',
  'Suutari',
  'Personal trainer',
  'Kotiapu',
  'Hieronta',
  'Siivouspalvelu',
  'Koiranhoito',
  'Pihatyöt',
  'Virtuaaliassistentti',
  'Lyhyterapia',
  'Hermoratahieronta',
  'Koirahieronta',
  'Juhlatarvikkeet',
  'Ohjelmapalvelut',
]

export default function PopularSearchesSection() {
  const router = useRouter()

  function handleSearchClick(haku: string) {
    router.push(`/haku?q=${encodeURIComponent(haku)}`)
  }

  return (
    <section className="bg-white px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-screen-xl mx-auto text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-[#1E3A41]">
          Suosittuja hakuja
        </h3>

        <p className="mt-2 text-sm sm:text-base text-charcoal/70">
          Aloita selaaminen suosituista paikallisista hauista.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {haut.map((haku) => (
            <button
              key={haku}
              type="button"
              onClick={() => handleSearchClick(haku)}
              className="
  rounded-full
  bg-white
  px-4 py-2.5
  text-sm font-medium text-[#1E3A41]
  ring-1 ring-black/10
  shadow-sm
  transition-all duration-200
  hover:bg-[#EDF5F2]
  hover:ring-[#4F8F7A]/40
  hover:-translate-y-[1px]
  hover:shadow-md
  active:scale-[0.97]
"
            >
              {haku}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}