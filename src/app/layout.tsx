// src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/context/AuthContext'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mainoskyla.fi'),

  title: {
    default: 'Mainoskylä – löydä paikalliset palvelut ja ilmoita helposti',
    template: '%s | Mainoskylä',
  },

  description:
    'Mainoskylä on suomalainen palvelu, jossa löydät paikalliset palvelut ja voit ilmoittaa omat palvelusi helposti. Koko Suomi.',

  icons: {
    icon: '/favicon.ico',
  },

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    url: 'https://mainoskyla.fi',
    siteName: 'Mainoskylä',
    title: 'Mainoskylä – löydä paikalliset palvelut ja ilmoita helposti',
    description:
      'Löydä paikalliset palvelut tai tule löydetyksi. Ilmoitukset koko Suomesta.',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Mainoskylä – paikalliset palvelut',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Mainoskylä',
    description:
      'Löydä paikalliset palvelut tai tule löydetyksi. Ilmoitukset koko Suomesta.',
    images: ['/og.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Kun Google Search Console, lisää tämä:
  // verification: {
  //   google: 'SUN_VERIFICATION_CODE_TAHAN',
  // },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body
        className={`${inter.className} bg-[#F6F7F7] text-charcoal min-h-screen flex flex-col overflow-x-hidden`}
      >
        <AuthProvider>
          <Header />

          <main className="flex-grow w-full">{children}</main>

          <Footer />
          <CookieBanner />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
