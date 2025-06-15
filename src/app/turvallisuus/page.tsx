// app/turvallisuus/page.tsx

export default function Turvallisuus() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Turvallisuusohjeet</h1>
      <p>
        Mainoskylä on ilmoitusalusta, jossa käyttäjät voivat lisätä omia ilmoituksiaan. Palvelu on testiversio ja tarkoitettu käytettäväksi rehellisesti ja turvallisesti.
      </p>

      <h2 className="mt-6 font-semibold">❌ Kielletty sisältö:</h2>
      <ul className="list-disc ml-6">
        <li>Huijausyritykset tai petolliset ilmoitukset</li>
        <li>Pankkitunnusten tai maksukorttien pyytäminen</li>
        <li>Henkilötunnusten tai arkaluonteisten tietojen kerääminen</li>
        <li>Linkit sivustoihin, jotka voivat olla haitallisia</li>
      </ul>

      <p className="mt-4">
        Tällaiset ilmoitukset poistetaan ja käyttäjät voidaan estää palvelusta.
      </p>

      <h2 className="mt-6 font-semibold">🔒 Kirjautuminen ja käyttäjätunnus</h2>
      <p>
        Kirjautuminen tapahtuu turvallisesti sähköpostin kautta Supabasen Magic Link -menetelmällä. Et saa salasanaa tai käyttäjätunnusta – vain linkki sähköpostiisi.
      </p>
      <p className="mt-2">
        Jos et saanut kirjautumislinkkiä, tarkista roskapostikansio. Linkki on voimassa vain hetken.
      </p>

      <h2 className="mt-6 font-semibold">📬 Ilmoita väärinkäytöksistä</h2>
      <p>
        Jos huomaat epäilyttävää sisältöä, ilmoita sähköpostilla: info@mainoskyla.fi
      </p>

      <p className="text-sm mt-6 text-gray-500">Päivitetty: 8.6.2025</p>
    </div>
  )
}
