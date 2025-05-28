import './globals.css'
import MobiiliHeader from '@/components/Header' // uusi header tähän

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
      <body className="bg-white text-gray-800">
        <MobiiliHeader /> {/* käytetään uutta headeria */}
        {children}
      </body>
    </html>
  )
}
