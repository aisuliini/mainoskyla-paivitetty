'use client'

import { PlusCircle, ImageIcon, Eye } from 'lucide-react'

const steps = [
  {
    icon: PlusCircle,
    title: 'Luo ilmoitus',
    description:
      'Kirjoita palvelusi tiedot helposti ja valitse sopiva kategoria muutamassa minuutissa.',
  },
  {
    icon: ImageIcon,
    title: 'Lisää kuvat ja tiedot',
    description:
      'Kuvat, kuvaus ja sijainti auttavat asiakasta ymmärtämään heti, mitä tarjoat.',
  },
  {
    icon: Eye,
    title: 'Julkaise ja tule löydetyksi',
    description:
      'Kun ilmoitus on julkaistu, palvelusi löytyy Mainoskylästä paikallisia etsiville.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-[#FAFCFB] px-4 sm:px-6 py-12 sm:py-16 border-t border-black/5">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E3A41]">
            Ilmoituksen lisääminen on helppoa
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-charcoal/70">
            Mainoskylässä palvelun lisääminen onnistuu nopeasti. Selkeä ilmoitus auttaa
            asiakkaita löytämään sinut helpommin.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
  {steps.map((step, index) => {
    const Icon = step.icon

    return (
      <div key={step.title} className="relative text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#EDF5F2] text-[#1E3A41] ring-1 ring-[#4F8F7A]/20">
          <Icon size={24} />
        </div>

        <div className="mt-4 text-sm font-semibold text-[#4F6763]">
          Vaihe 0{index + 1}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-[#1E3A41]">
          {step.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-charcoal/70 max-w-xs mx-auto">
          {step.description}
        </p>
      </div>
    )
  })}
</div>
      </div>
    </section>
  )
}