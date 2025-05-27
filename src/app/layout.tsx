import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Mainoskylä – Paikallista mainontaa helposti',
  description: 'Ilmoita ja löydä paikalliset palvelut, tuotteet ja tapahtumat yhdestä paikasta. Mainoskylä yhdistää asiakkaat ja tekijät koko Suomessa.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="bg-white text-gray-800">
        <Header />
        {children}
      </body>
    </html>
  )
}

