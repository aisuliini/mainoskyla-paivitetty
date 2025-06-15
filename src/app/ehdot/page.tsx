export default function Kayttoehdot() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Käyttöehdot</h1>

      <p>
        Mainoskylä (https://mainoskyla.fi) on kehitteillä oleva opiskelijaprojekti ja testiversio. 
        Palvelu on maksuton ja tarkoitettu kokeilukäyttöön. 
        Käyttämällä sivustoa hyväksyt seuraavat ehdot.
      </p>

      <h2 className="mt-6 font-semibold">1. Palvelun sisältö</h2>
      <p>
        Käyttäjät voivat lisätä sivustolle ilmoituksia, jotka näkyvät julkisesti muille kävijöille. 
        Ilmoitusten lisääminen ja katselu on maksutonta.
      </p>

      <h2 className="mt-6 font-semibold">2. Käyttäjän vastuu</h2>
      <ul className="list-disc ml-6">
        <li>Käyttäjä on itse vastuussa omien ilmoitustensa sisällöstä.</li>
        <li>Ilmoituksissa ei saa olla huijausyrityksiä, maksupyyntöjä, arkaluonteisia tietoja tai sopimatonta sisältöä.</li>
        <li>Palvelun kautta ei saa markkinoida tai myydä laittomia tuotteita tai palveluita.</li>
      </ul>

      <h2 className="mt-6 font-semibold">3. Palvelun rajoitukset</h2>
      <p>
        Sivuston kehittäjä ei vastaa ilmoitusten sisällöstä, teknisistä ongelmista tai mahdollisista väärinkäytöksistä. 
        Ilmoituksia voidaan poistaa ilman erillistä ilmoitusta.
      </p>

      <h2 className="mt-6 font-semibold">4. Tietoturva ja kirjautuminen</h2>
      <p>
        Kirjautuminen tapahtuu sähköpostiin lähetettävällä Magic Link -linkillä. 
        Sivustolla ei käytetä salasanoja.
      </p>

      <h2 className="mt-6 font-semibold">5. Yhteystiedot</h2>
      <p>
        Kaikki kysymykset ja väärinkäytösepäilyt voi lähettää osoitteeseen: info@mainoskyla.fi
      </p>

      <p className="text-sm mt-6 text-gray-500">Päivitetty: 8.6.2025</p>
    </div>
  )
}
