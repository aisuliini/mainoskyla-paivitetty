'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/consent/events'

export default function Footer() {
  return (
    <footer className="bg-[#EAF1EE] text-[#1E3A41] mt-0 border-t border-black/5">
      <div className="max-w-screen-xl mx-auto px-6 py-8 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm sm:text-[15px] font-medium">
            <Link href="/tietoa" className="text-[#1E3A41] hover:opacity-70 transition">
              Tietoa meistä
            </Link>
            <Link href="/hinnasto" className="text-[#1E3A41] hover:opacity-70 transition">
              Hinnasto
            </Link>
            <Link href="/ehdot" className="text-[#1E3A41] hover:opacity-70 transition">
              Käyttöehdot
            </Link>
            <Link href="/tietosuoja" className="text-[#1E3A41] hover:opacity-70 transition">
              Tietosuoja
            </Link>
            <Link href="/turvallisuus" className="text-[#1E3A41] hover:opacity-70 transition">
              Turvallisuusohjeet
            </Link>
            <Link href="/yhteystiedot" className="text-[#1E3A41] hover:opacity-70 transition">
              Yhteystiedot
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
              className="text-[#1E3A41] hover:opacity-70 transition"
            >
              Evästeasetukset
            </button>
          </nav>

          <div className="mt-5 flex justify-center gap-4 text-[22px]">
            <a
              href="https://facebook.com/mainoskyla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 ring-1 ring-black/5 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com/mainoskyla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 ring-1 ring-black/5 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm transition"
            >
              <FaInstagram />
            </a>
          </div>

          <div className="mt-5 space-y-1 text-center">
            <p className="text-xs sm:text-sm text-charcoal/60">
              Tuo palvelusi näkyville siellä, missä paikalliset asiakkaat etsivät tekijöitä.
            </p>
            <p className="text-sm text-[#1E3A41]/80">
              &copy; {new Date().getFullYear()} Mainoskylä
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}