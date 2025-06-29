// app/turvallisuus/page.tsx

export default function Turvallisuus() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-[#333]">
      <h1 className="text-3xl font-bold mb-4 text-[#2f5332]">Turvallisuusohjeet</h1>

      <div className="bg-red-100 border border-red-300 text-red-800 text-sm rounded px-4 py-3 mb-6">
        ⚠️ Älä koskaan anna pankkitunnuksia, maksukortin tietoja tai siirrä rahaa ilmoittajalle. Ilmoituksiin liittyvät maksupyynnöt voivat olla huijausyrityksiä.
      </div>

      <p className="mb-4">
        Mainoskylä on ilmoitusalusta, jossa käyttäjät voivat lisätä omia ilmoituksiaan. Palvelu on kehitysvaiheessa, joten pyydämme käyttäjiä noudattamaan turvallisuusohjeita ja ilmoittamaan mahdollisista väärinkäytöksistä.
      </p>

      <h2 className="mt-6 font-semibold text-lg">❌ Kielletty sisältö</h2>
      <ul className="list-disc ml-6 mt-2 text-sm">
        <li>Huijausyritykset tai petolliset ilmoitukset</li>
        <li>Pankki- tai maksutietojen pyytäminen käyttäjiltä</li>
        <li>Henkilötunnusten tai muiden arkaluonteisten tietojen kerääminen</li>
        <li>Linkit haitallisiin tai harhaanjohtaviin sivustoihin</li>
        <li>Laiton toiminta tai Suomen lakia rikkova sisältö</li>
        <li>Vihapuhe, rasismi tai syrjivä sisältö</li>
        <li>Ahdistelu, seksuaalinen sisältö tai väkivalta</li>
        <li>Monitasomarkkinointi (MLM), kryptohuijaukset tai sijoitushuijaukset</li>
      </ul>

      <p className="mt-4 text-sm">
        Tällaiset ilmoitukset poistetaan ja käyttäjät voidaan estää palvelusta.
      </p>

      <h2 className="mt-6 font-semibold text-lg">🔒 Kirjautuminen</h2>
      <p className="text-sm mt-2">
        Kirjautuminen tapahtuu sähköpostiosoitteella ja salasanalla. Kun kirjaudut sisään, saat vahvistuslinkin sähköpostiisi (Supabasen toimittamana), jolla varmistetaan kirjautuminen.
      </p>
      <p className="text-sm mt-2">
        Tarkista myös roskaposti, jos linkki ei saavu. Linkki on voimassa vain lyhyen ajan.
      </p>

      <h2 className="mt-6 font-semibold text-lg">🕵️‍♀️ Miten tunnistaa huijausilmoitus?</h2>
      <ul className="list-disc ml-6 mt-2 text-sm">
        <li>Ilmoitus vaikuttaa liian hyvältä ollakseen totta (esim. edullinen hinta, epärealistiset lupaukset)</li>
        <li>Ilmoittaja pyytää rahaa tai tietoja (pankkitunnukset, korttitiedot) etukäteen</li>
        <li>Ilmoituksessa on kiireen tuntua: &quot;toimi heti&quot;, &quot;vain tänään&quot; jne.</li>
        <li>Kirjoitusvirheitä tai kieli kuulostaa oudolta</li>
        <li>Sähköpostiosoite ei vaikuta luotettavalta tai sisältää satunnaisia kirjaimia</li>
      </ul>

      <p className="text-sm mt-4">
        Jos jokin tuntuu epäilyttävältä, älä jatka yhteydenpitoa ja ilmoita asiasta meille: <strong>info@mainoskyla.fi</strong>
      </p>

      <h2 className="mt-6 font-semibold text-lg">📬 Ilmoita väärinkäytöksistä</h2>
      <p className="text-sm mt-2">
        Jos huomaat epäilyttävää toimintaa tai sisältöä, ilmoita siitä meille: <strong>info@mainoskyla.fi</strong>
      </p>

      <p className="text-xs mt-8 text-gray-500">Päivitetty: 23.6.2025</p>
    </div>
  )
}
