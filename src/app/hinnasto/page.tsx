// app/hinnasto/page.tsx

export default function Hinnasto() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hinnasto</h1>

      <p>
        <strong>Mainoskylä on kehitysvaiheessa ja täysin maksuton.</strong> Palvelun käyttö, ilmoitusten lisääminen ja selaaminen ei maksa tällä hetkellä mitään.
      </p>

      <p className="mt-4 text-red-600 font-semibold">
        Älä koskaan anna pankkitunnuksia, maksukortin tietoja tai siirrä rahaa tuntemattomille. Ilmoituksiin liittyvät maksut tai rahapyynnöt voivat olla huijausyrityksiä.
      </p>

      <p className="mt-4">
        Mikäli maksullisia toimintoja otetaan käyttöön tulevaisuudessa, niistä tiedotetaan selkeästi etukäteen.
      </p>

      <p className="text-sm mt-6 text-gray-500">Päivitetty: 23.6.2025</p>
    </div>
  )
}
