// app/tietosuoja/page.tsx

export default function Tietosuoja() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tietosuojaseloste</h1>
        <p className="mt-2 text-gray-700">
          Tämä tietosuojaseloste kuvaa, miten Mainoskylä (mainoskyla.fi) käsittelee henkilötietoja
          palvelun käytön yhteydessä. Käyttämällä palvelua hyväksyt tietojen käsittelyn tämän selosteen mukaisesti.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Palvelu on kehitysvaiheessa (beta), ja toimintaa sekä tietojen käsittelyä voidaan päivittää palvelun kehittyessä.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">1. Rekisterinpitäjä</h2>
        <p className="text-gray-700">
          Rekisterinpitäjä: Mainoskylä
          <br />
          Yhteys: <span className="font-medium">info@mainoskyla.fi</span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">2. Mitä tietoja kerätään?</h2>
        <p className="text-gray-700">Palvelussa voidaan käsitellä seuraavia tietoja:</p>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>
            <span className="font-medium">Tilin tiedot:</span> sähköpostiosoite ja mahdollinen nimi/nimimerkki (rekisteröityminen ja kirjautuminen)
          </li>
          <li>
            <span className="font-medium">Ilmoituksen tiedot:</span> otsikko, kuvaus, sijainti/paikkakunta, kuvat ja muut ilmoitukseen syötetyt tiedot
          </li>
          <li>
            <span className="font-medium">Tekniset ja käyttötiedot:</span> esimerkiksi laite-/selain- ja lokitiedot, sivuston käyttö (käyntimäärät, sivulataukset, käyttöpolut)
          </li>
          <li>
            <span className="font-medium">Eväste- ja mittaustiedot (jos käytössä):</span> analytiikka ja mainonnan mittaus/kohdennus suostumuksen perusteella
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">3. Mihin tarkoituksiin tietoja käytetään?</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>tilin luomiseen, kirjautumiseen ja käyttäjän tunnistamiseen</li>
          <li>ilmoitusten julkaisemiseen, näyttämiseen ja hallintaan</li>
          <li>palvelun toimivuuden varmistamiseen, kehittämiseen ja tietoturvan parantamiseen</li>
          <li>käytön seurantaan ja tilastointiin (analytiikka)</li>
          <li>markkinoinnin ja mainonnan mittaamiseen/kohdentamiseen vain suostumuksella (jos käytössä)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">4. Käsittelyn oikeusperuste</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>
            <span className="font-medium">Sopimus:</span> tilin luominen ja palvelun tarjoaminen käyttäjälle
          </li>
          <li>
            <span className="font-medium">Oikeutettu etu:</span> palvelun turvallisuus, väärinkäytösten ehkäisy ja perusanalytiikka
          </li>
          <li>
            <span className="font-medium">Suostumus:</span> ei-välttämättömät evästeet, analytiikka ja mahdollinen mainonnan mittaus/kohdennus
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">5. Mistä tieto tulee?</h2>
        <p className="text-gray-700">
          Tiedot saadaan pääasiassa sinulta itseltäsi (rekisteröitymisen ja ilmoituksen luonnin yhteydessä)
          sekä palvelun käytön aikana syntyvistä teknisistä tiedoista (esim. lokit ja evästetiedot, jos käytössä).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">6. Tietojen säilytys</h2>
        <p className="text-gray-700">
          Säilytämme henkilötietoja vain niin kauan kuin se on tarpeen tässä selosteessa kuvattuihin tarkoituksiin.
          Tilin tiedot ja ilmoitusten hallintaan liittyvät tiedot säilyvät yleensä niin kauan kuin käyttäjätili on olemassa
          tai kunnes pyydät tietojen poistamista, ellei laki edellytä pidempää säilytystä.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">7. Tietojen suojaus</h2>
        <p className="text-gray-700">
          Tietoja suojataan asianmukaisin teknisin ja organisatorisin toimenpitein. Käyttäjätietoja voidaan säilyttää
          Supabase-palvelussa, joka tarjoaa nykyaikaiset suojausratkaisut. Pääsy tietoihin on rajattu.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">8. Tietojen luovutus ja siirrot</h2>
        <p className="text-gray-700">
          Emme myy henkilötietojasi. Tietoja voidaan käsitellä luotettavien palveluntarjoajien avulla, jotka toimivat
          henkilötietojen käsittelijöinä (esim. hosting, tietokanta, analytiikka).
        </p>
        <p className="text-gray-700">
          Jos käytössä on kolmannen osapuolen analytiikka tai mainonnan mittaus (esim. Google), näihin palveluihin voi
          liittyä tietojen käsittelyä myös EU/ETA-alueen ulkopuolella. Tällöin siirrot tehdään sovellettavien
          tietosuojasääntöjen mukaisin suojatoimin (esim. vakiolausekkeet).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">9. Evästeet ja seuranta</h2>
        <p className="text-gray-700">
          Palvelu voi käyttää evästeitä ja vastaavia tekniikoita palvelun toiminnan kannalta välttämättömiin tarkoituksiin
          (esim. istunnon hallinta). Lisäksi voidaan käyttää analytiikkaa ja/tai mainonnan mittausta vain, jos annat siihen suostumuksen.
        </p>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <p className="text-gray-800 font-medium mb-1">Suostumus</p>
          <p className="text-gray-700">
  Pyydämme suostumuksen ennen ei-välttämättömien evästeiden asettamista. Voit hallita evästevalintoja
  sivustolla näytettävän evästebannerin kautta sekä selaimesi asetuksista.
</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">10. Käyttäjän oikeudet</h2>
        <p className="text-gray-700">Sinulla on oikeus:</p>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>saada pääsy omiin tietoihisi</li>
          <li>pyytää tietojen oikaisua tai poistamista</li>
          <li>rajoittaa käsittelyä tai vastustaa käsittelyä tietyissä tilanteissa</li>
          <li>siirtää tiedot järjestelmästä toiseen (soveltuvin osin)</li>
          <li>peruuttaa suostumus (jos käsittely perustuu suostumukseen)</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Oikeuspyynnöt voi lähettää: <span className="font-medium">info@mainoskyla.fi</span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">11. Kolmansien osapuolten linkit</h2>
        <p className="text-gray-700">
          Palvelu voi sisältää linkkejä kolmansien osapuolten sivustoille. Emme vastaa näiden sivustojen sisällöstä tai
          tietosuojakäytännöistä. Suosittelemme tutustumaan erikseen kunkin palvelun tietoihin.
        </p>

        <p className="text-gray-700">
          Esimerkki (jos käytössä):{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Googlen tietosuojakäytäntö
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">12. Muutokset</h2>
        <p className="text-gray-700">
          Voimme päivittää tätä selostetta palvelun kehittyessä. Ajantasainen versio on aina tällä sivulla.
        </p>
      </section>

      <footer className="mt-8">
        <p className="text-sm text-gray-500">Päivitetty: 6.7.2025</p>
      </footer>
    </main>
  )
}
