// app/tietosuoja/page.tsx

export default function Tietosuoja() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tietosuojaseloste</h1>
      <p>
        Tämä sivusto (Mainoskylä, https://mainoskyla.fi) on opiskelijatyönä toteutettava, kehitysvaiheessa oleva testiversio.
        Sivuston tarkoituksena on kokeilla ilmoitusalustan toiminnallisuuksia ei-kaupallisessa ympäristössä.
      </p>

      <h2 className="mt-6 font-semibold">1. Kerättävät tiedot</h2>
      <p>Palvelussa kerätään seuraavia tietoja:</p>
      <ul className="list-disc ml-6">
        <li>Käyttäjän sähköpostiosoite ja nimi (kirjautumisen yhteydessä)</li>
        <li>Ilmoituksen tiedot: otsikko, kuvaus, paikkakunta, kuvat</li>
        <li>Sivuston käyttötietoja (esim. millä sivuilla käydään, anonyymi analytiikka)</li>
      </ul>

      <h2 className="mt-6 font-semibold">2. Tietojen käyttötarkoitus</h2>
      <p>
        Tietoja käytetään ainoastaan ilmoitusten julkaisemiseen sekä palvelun tekniseen kehittämiseen. 
        Tietoja ei käytetä markkinointiin, eikä niitä luovuteta kolmansille osapuolille.
      </p>

      <h2 className="mt-6 font-semibold">3. Tietojen säilytys ja suojaus</h2>
      <p>
        Tiedot tallennetaan Supabase-palveluun (EU:n sisällä), joka käyttää nykyaikaisia suojausmenetelmiä. 
        Tiedot poistetaan käyttäjän pyynnöstä tai kun testipalvelu suljetaan.
      </p>

      <h2 className="mt-6 font-semibold">4. Evästeet</h2>
      <p>
        Sivusto käyttää evästeitä käyttäjän istunnon hallintaan. Evästeitä ei käytetä kolmannen osapuolen seurantaan.
      </p>

      <h2 className="mt-6 font-semibold">5. Käyttäjän oikeudet</h2>
      <p>
        Voit pyytää omien tietojesi tarkastamista tai poistamista ottamalla yhteyttä sähköpostitse.
      </p>

      <h2 className="mt-6 font-semibold">6. Yhteystiedot</h2>
      <p>Sähköposti: info@mainoskyla.fi</p>

      <p className="text-sm mt-6 text-gray-500">Päivitetty: 8.6.2025</p>
    </div>
  )
}
