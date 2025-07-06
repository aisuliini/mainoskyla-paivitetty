// app/tietosuoja/page.tsx

export default function Tietosuoja() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tietosuojaseloste</h1>

      <p>
        Tämä sivusto (Mainoskylä, https://mainoskyla.fi) on opiskelijatyönä toteutettava, kehitysvaiheessa oleva testiversio. Sivuston tarkoituksena on kokeilla ilmoitusalustan toiminnallisuuksia ei-kaupallisessa ympäristössä. Palvelun kehittämisen yhteydessä voidaan hyödyntää myös digitaalisen markkinoinnin työkaluja, kuten Google Adsia.
      </p>

      <h2 className="mt-6 font-semibold">1. Kerättävät tiedot</h2>
      <p>Palvelussa kerätään seuraavia tietoja:</p>
      <ul className="list-disc ml-6">
        <li>Käyttäjän sähköpostiosoite ja nimi (kirjautumisen yhteydessä)</li>
        <li>Ilmoituksen tiedot: otsikko, kuvaus, paikkakunta, kuvat</li>
        <li>Sivuston käyttötietoja (esim. millä sivuilla käydään, kävijämäärät, hakusanat)</li>
        <li>Tietoja käyttäjän toiminnasta, kuten klikkauksista tai mainosnäytöistä (Google Ads)</li>
      </ul>

      <h2 className="mt-6 font-semibold">2. Tietojen käyttötarkoitus</h2>
      <p>
        Tietoja käytetään:
      </p>
      <ul className="list-disc ml-6">
        <li>ilmoitusten julkaisemiseen ja hallintaan</li>
        <li>palvelun tekniseen ylläpitoon ja kehittämiseen</li>
        <li>sivuston käytön seurantaan ja tilastointiin</li>
        <li>mainonnan kohdentamiseen ja mittaamiseen (esim. Google Ads)</li>
      </ul>
      <p>
        Tietoja ei luovuteta ulkopuolisille muuhun kuin edellä mainittuihin tarkoituksiin. Google Ads -palvelun käyttö voi tarkoittaa, että Google käsittelee tietojasi omien ehtojensa ja tietosuojakäytäntöjensä mukaisesti.
      </p>

      <h2 className="mt-6 font-semibold">3. Tietojen säilytys ja suojaus</h2>
      <p>
        Käyttäjätiedot tallennetaan Supabase-palveluun (EU:n sisällä), joka käyttää nykyaikaisia suojausmenetelmiä. Analytiikka- ja mainosdata voi sijaita Googlen palvelimilla EU-alueella tai EU:n ulkopuolella. Tiedot poistetaan käyttäjän pyynnöstä tai kun testipalvelu suljetaan.
      </p>

      <h2 className="mt-6 font-semibold">4. Evästeet ja seuranta</h2>
      <p>
        Sivusto käyttää evästeitä istunnon hallintaan sekä analytiikkaan ja mainonnan kohdentamiseen. 
        Evästeiden avulla voidaan:
      </p>
      <ul className="list-disc ml-6">
        <li>pitää käyttäjä kirjautuneena palveluun</li>
        <li>kerätä tilastotietoa palvelun käytöstä</li>
        <li>kohdentaa mainontaa Google Adsin kautta</li>
      </ul>
      <p>
        Käyttäjältä pyydetään suostumus evästeiden käyttöön ennen kuin evästeitä, joita ei tarvita sivuston toiminnallisuuksiin, asetetaan selaimeen.
      </p>

      <h2 className="mt-6 font-semibold">5. Käyttäjän oikeudet</h2>
      <p>
        Käyttäjällä on oikeus tarkastaa, korjata tai pyytää poistamaan häntä koskevat tiedot. Voit ottaa yhteyttä alla olevaan sähköpostiosoitteeseen.
      </p>

      <h2 className="mt-6 font-semibold">6. Kolmannet osapuolet</h2>
      <p>
        Sivusto voi käyttää Google Ads -palvelua mainonnan näyttämiseen ja mainosten tehokkuuden seurantaan. Google voi yhdistää näitä tietoja muihin tietoihin, joita käyttäjä on antanut Googlelle tai joita Google on kerännyt käyttäjän muusta käytöstä.
      </p>
      <p>
        Lue lisää Googlen tietosuojakäytännöstä osoitteessa:{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Google Privacy Policy
        </a>.
      </p>

      <h2 className="mt-6 font-semibold">7. Yhteystiedot</h2>
      <p>Sähköposti: info@mainoskyla.fi</p>

      <p className="text-sm mt-6 text-gray-500">Päivitetty: 6.7.2025</p>
    </div>
  )
}
