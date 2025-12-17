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
<body className={`${inter.className} bg-[#F6F7F7] text-charcoal min-h-screen flex flex-col overflow-x-hidden`}>



        <AuthProvider>
          {/* Yhtenäinen header, responsiivinen */}
          <Header />

          {/* Pääsisältö */}
<main className="flex-grow w-full">
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
