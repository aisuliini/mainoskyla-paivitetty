// src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/context/AuthContext'
import { Manrope } from 'next/font/google'



const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export const metadata = {
  title: 'Mainoskylä – Paikallista mainontaa helposti',
  description: 'Ilmoita ja löydä paikalliset palvelut...',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${manrope.className} bg-beige text-charcoal`}> 

        <AuthProvider>
          {/* Yhtenäinen header, responsiivinen */}
          <Header />

          {/* Pääsisältö */}
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          <CookieBanner />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
