export default function Kayttoehdot() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Käyttöehdot</h1>
        <p className="mt-2 text-gray-700">
          Näitä käyttöehtoja sovelletaan Mainoskylä-palvelun käyttöön (mainoskyla.fi). Käyttämällä
          palvelua hyväksyt nämä ehdot.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Mainoskylä on kehitysvaiheessa (beta). Palvelu on toistaiseksi maksuton ja sitä kehitetään
          jatkuvasti.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">1. Palvelun tarkoitus</h2>
        <p className="text-gray-700">
          Mainoskylä on paikallinen ilmoitusalusta, jossa käyttäjät voivat julkaista ilmoituksia (esim.
          palvelut, tapahtumat ja muut ilmoitukset). Ilmoitukset näkyvät julkisesti muille kävijöille.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">2. Käyttäjän vastuu ja sallitut sisällöt</h2>
        <p className="text-gray-700">
          Olet vastuussa julkaisemastasi sisällöstä ja siitä, että sinulla on oikeus käyttää siihen liittyviä
          tekstejä, kuvia ja muita materiaaleja.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>Älä julkaise huijauksia, harhaanjohtavaa sisältöä tai perusteettomia maksupyyntöjä.</li>
          <li>Älä julkaise arkaluonteisia henkilötietoja (esim. henkilötunnus, pankkitiedot, yksityiset osoitteet).</li>
          <li>Älä julkaise vihapuhetta, häirintää, pornografiaa, väkivaltaa tai muuten sopimatonta sisältöä.</li>
          <li>Älä markkinoi tai myy laittomia tuotteita tai palveluita.</li>
          <li>Älä lisää haitallisia linkkejä (esim. haittaohjelmia, tietojenkalastelua) tai roskapostia.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">3. Ilmoitusten moderointi ja poistaminen</h2>
        <p className="text-gray-700">
          Mainoskylällä on oikeus (mutta ei velvollisuutta) tarkastaa, muokata, piilottaa tai poistaa sisältöä,
          joka rikkoo näitä ehtoja, on epäilyttävää, loukkaa oikeuksia tai heikentää palvelun laatua.
          Ilmoituksia voidaan poistaa myös ilman ennakkoilmoitusta.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">4. Kirjautuminen ja tietoturva</h2>
        <p className="text-gray-700">
          Rekisteröityminen ja kirjautuminen tapahtuu sähköpostiosoitteella ja salasanalla. Tilin turvallisuus
          (esim. salasanan säilyttäminen) on käyttäjän vastuulla.
        </p>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <p className="text-gray-800 font-medium mb-1">Tietojenkalastelu ja maksutiedot</p>
          <p className="text-gray-700">
            Mainoskylä ei pyydä kirjautumisen tai rekisteröitymisen yhteydessä pankkitietoja, luottokorttitietoja
            tai muita maksutietoja. Jos saat viestin, jossa pyydetään maksutietoja Mainoskylään liittyen,
            kyseessä ei ole Mainoskylän virallinen viesti.
          </p>
          <p className="text-gray-700 mt-2">
            Viralliset viestit ohjaavat aina Mainoskylän omille sivuille (mainoskyla.fi).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">5. Vastuunrajoitus</h2>
        <p className="text-gray-700">
          Mainoskylä tarjotaan “sellaisena kuin se on”. Kehitysvaiheen vuoksi palvelussa voi esiintyä katkoksia,
          virheitä tai toiminnallisia puutteita. Mainoskylä ei vastaa käyttäjien ilmoitusten sisällöstä,
          ilmoitusten perusteella syntyvistä sopimuksista, vahingoista tai menetyksistä.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">6. Oikeudet sisältöön</h2>
        <p className="text-gray-700">
          Säilytät oikeudet omaan sisältöösi. Julkaisemalla ilmoituksen annat Mainoskylälle oikeuden näyttää,
          jakaa ja esittää sisältöä palvelussa ja sen markkinoinnissa (esim. esikatselukuvat tai otteet),
          siltä osin kuin se on palvelun toiminnan kannalta tarpeellista.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">7. Ehtojen muutokset</h2>
        <p className="text-gray-700">
          Näitä ehtoja voidaan päivittää palvelun kehittyessä. Ajantasainen versio löytyy tältä sivulta.
          Jatkamalla palvelun käyttöä hyväksyt päivitetyt ehdot.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="mt-6 text-lg font-semibold">8. Yhteystiedot</h2>
        <p className="text-gray-700">
          Kysymykset ja väärinkäytösepäilyt: <span className="font-medium">info@mainoskyla.fi</span>
        </p>
      </section>

      <footer className="mt-8">
        <p className="text-sm text-gray-500">Päivitetty: 8.6.2025</p>
      </footer>
    </main>
  )
}
