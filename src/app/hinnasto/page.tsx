// app/hinnasto/page.tsx

export default function Hinnasto() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hinnasto</h1>
      <p>
        Mainoskylä on tällä hetkellä <strong>opiskelijaprojekti ja testivaiheessa</strong>. Kaikki ilmoitukset ovat maksuttomia.
      </p>

      <h2 className="mt-6 font-semibold">Tällä hetkellä ilmaisia:</h2>
      <ul className="list-disc ml-6">
        <li>Tavallinen ilmoitus</li>
        <li>Premium-näkyvyys (jos tarjolla)</li>
        <li>Palvelun käyttö</li>
      </ul>

      <h2 className="mt-6 font-semibold">Tulevaisuudessa mahdollisesti maksullisia:</h2>
      <ul className="list-disc ml-6">
        <li>Ilmoituksen nosto</li>
        <li>Premium-paikat (esim. etusivu tai kärkeen)</li>
        <li>Yrityksille näkyvyyspaketit</li>
      </ul>

      <p className="mt-4">
        Kaikista muutoksista tiedotetaan etukäteen. Tällä hetkellä maksullisia toimintoja ei ole.
      </p>

      <p className="text-sm mt-6 text-gray-500">Päivitetty: 8.6.2025</p>
    </div>
  )
}
