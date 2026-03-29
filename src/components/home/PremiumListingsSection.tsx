'use client'

import SafeCardImage from '@/components/listings/SafeCardImage'
import Katselukerrat from '@/components/Katselukerrat'
import type { PremiumIlmoitus } from '@/components/home/home-types'


type Props = {
  items: PremiumIlmoitus[]
  onOpenListing: (id: string) => void
  onAddListing: () => void
}

export default function PremiumListingsSection({
  items,
  onOpenListing,
  onAddListing,
}: Props) {
  if (!items.length) return null

  return (
    <section className="bg-[#F6FAF8] px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#1E3A41] mb-2">
          Etusivulla näkyvät ilmoitukset
        </h2>

        <p className="text-xs text-charcoal/60 mb-3">
          Premium-ilmoitukset näkyvät etusivulla sekä lisäksi hauissa ja kategorioissa.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((ilmo) => (
            <div
              key={ilmo.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!ilmo.id.startsWith('tyhja-')) {
                  onOpenListing(ilmo.id)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !ilmo.id.startsWith('tyhja-')) {
                  onOpenListing(ilmo.id)
                }
              }}
              className={`
                group bg-white ring-1 ring-black/5
                rounded-[22px] overflow-hidden
                shadow-sm
                transition-all duration-300 ease-out
                ${
                  ilmo.id.startsWith('tyhja-')
                    ? 'cursor-default'
                    : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'
                }
              `}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F6F7F7]">
                {!ilmo.id.startsWith('tyhja-') && (
                  <span className="absolute top-2 left-2 z-10 text-[10px] bg-[#EDF5F2] text-[#1E3A41] px-2 py-1 rounded-full font-medium">
                    Suositeltu
                  </span>
                )}

                <SafeCardImage
                  src={ilmo.kuva_url}
                  alt={ilmo.otsikko}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
              </div>

              <div className="px-3 pb-3 pt-1.5">
                <h3 className="text-[15px] sm:text-base font-semibold leading-snug text-[#1E3A41] line-clamp-2 min-h-[40px]">
                  {ilmo.otsikko}
                </h3>

                {ilmo.sijainti && (
                  <div className="mt-1 text-xs font-medium text-charcoal/65 truncate">
                    {ilmo.sijainti}
                  </div>
                )}

                {ilmo.kuvaus && (
                  <p className="mt-1.5 text-[13px] leading-5 text-charcoal/75 line-clamp-2 min-h-[38px]">
                    {ilmo.kuvaus}
                  </p>
                )}

                {ilmo.id.startsWith('tyhja-') ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddListing()
                    }}
                    className="
                      mt-3 w-full px-3 py-2.5 text-xs font-semibold
                      rounded-full
                      bg-[#EDF5F2]
                      text-[#1E3A41]
                      ring-1 ring-[#4F8F7A]/35
                      hover:bg-[#DCEEE8]
                      hover:ring-[#4F8F7A]/55
                      transition
                    "
                  >
                    Lisää oma ilmoitus
                  </button>
                ) : (
                  <div className="mt-2.5">
                    <Katselukerrat count={ilmo.nayttoja || 0} small />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}