export default function TietoaSivu() {
  return (
    <main className="px-6 py-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tietoa Mainoskylästä</h1>
        <p className="mt-3 text-base text-gray-700">
          Mainoskylä on suomalainen ilmoitusalusta, joka auttaa paikalliset palvelut, pienyrittäjät ja tapahtumat löytymään helposti.
          Julkaiseminen on vaivatonta, ja tavoitteena on tehdä paikallisesta näkyvyydestä arkipäivää – koko Suomessa.
        </p>
      </header>

      <section className="grid gap-4 mb-8">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Miksi Mainoskylä on olemassa?</h2>
          <p className="text-gray-700">
          Paikalliset palvelut ja tapahtumat jäävät usein hajalleen eri kanaviin, jolloin ne eivät löydä
          oikeaa yleisöään. Mainoskylä kokoaa paikalliset tekijät yhteen selkeään näkymään, jossa
          löytäminen on helppoa ja näkyvyys reilua.
        </p>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Kenelle tämä on?</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Pienyrittäjille ja tekijöille (palvelut, hyvinvointi, remontti, luovuus, eläinpalvelut jne.)</li>
            <li>Tapahtumien järjestäjille (kirppikset, kurssit, työpajat, yhdistykset)</li>
            <li>Asukkaille, jotka haluavat löytää tekijän läheltä – kaupungista tai kylältä</li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Periaatteet</h2>
          <ul className="text-gray-700 space-y-2">
            <li><span className="font-medium">Selkeys:</span> ilmoitukset ovat helppoja lukea ja vertailla.</li>
            <li><span className="font-medium">Paikallisuus:</span> näkyvyys kuuluu myös pienille paikkakunnille.</li>
            <li><span className="font-medium">Luottamus:</span> panostetaan turvalliseen ja siistiin alustan käyttöön.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border bg-gray-50 p-5">
        <h2 className="text-lg font-semibold mb-2">Rakennetaan tätä yhdessä</h2>
        <p className="text-gray-700">
          Mainoskylää kehitetään jatkuvasti käyttäjäpalautteen pohjalta. Jos sinulla on kehitysideoita tai toiveita,
          ne ovat enemmän kuin tervetulleita.
        </p>
      </section>
    </main>
  )
}
