// src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/context/AuthContext'
import { Inter } from 'next/font/google'


const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
<body className={`${inter.className} bg-[#F6F7F7] text-charcoal min-h-screen flex flex-col`}>



        <AuthProvider>
          {/* Yhtenäinen header, responsiivinen */}
          <Header />

          {/* Pääsisältö */}
<main className="flex-grow mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
  <div className="bg-white rounded-3xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6 lg:p-8">
    {children}
  </div>
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
