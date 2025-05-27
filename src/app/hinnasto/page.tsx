export default function HinnastoSivu() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hinnasto</h1>

      <p className="mb-6">
        Mainoskylä on maksuton palvelu peruskäyttäjille. Tarjoamme lisänäkyvyyttä ja erottumista tukevia maksullisia vaihtoehtoja niille, jotka haluavat enemmän näkyvyyttä.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Perusilmoitus – 0 €</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Ilmoitus näkyy kategoriasivulla ja haussa</li>
        <li>1 kuva ja vapaamuotoinen kuvaus</li>
        <li>Voimassa 30 päivää</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Premium-näkyvyys – 9,90 €/kk</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Ilmoitus näkyy etusivulla</li>
        <li>Kuvake & korostus värillä</li>
        <li>Jatkuva näkyvyys niin kauan kuin premium on voimassa</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Nosto – 1,90 € / kerta</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Ilmoitus nousee kategorian kärkeen 7 päiväksi</li>
        <li>Voit tehdä nostoja koska tahansa</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Yrityspaketti – 29,90 €/kk</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Rajoittamaton määrä ilmoituksia</li>
        <li>Kaikki ilmoitukset näkyvät etusivulla</li>
        <li>Yhteydenottolomake ja yritysprofiili</li>
      </ul>

      <p className="mt-6 text-sm text-gray-600">Kaikki hinnat sisältävät ALV 24 %. Palvelun tarjoaa Mainoskylä Oy.</p>
    </main>
  )
}
