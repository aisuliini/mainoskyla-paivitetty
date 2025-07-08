import './globals.css'
import MobiiliHeader from '@/components/Header'
import { Rubik } from 'next/font/google'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/context/AuthContext'

const rubik = Rubik({
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
      <body className={`${rubik.className} bg-[#F7FAF9] text-[#1E3A41]`}>
        <AuthProvider>
          <MobiiliHeader />
          {children}
          <CookieBanner />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
