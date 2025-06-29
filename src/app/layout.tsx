import './globals.css'
import MobiiliHeader from '@/components/Header'
import { Rubik } from 'next/font/google'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '400', '600'], //  esim. '300' tai '800' tarpeen mukaan
})

export const metadata = {
  title: 'Mainoskylä – Paikallista mainontaa helposti',
  description:
    'Ilmoita ja löydä paikalliset palvelut, tuotteet ja tapahtumat yhdestä paikasta. Mainoskylä yhdistää asiakkaat ja tekijät koko Suomessa.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${rubik.className} bg-white text-gray-800`}>
        <MobiiliHeader />
        {children}
      </body>
    </html>
  )
}
