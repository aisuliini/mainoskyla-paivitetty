export default function TietosuojaSivu() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tietosuojaseloste</h1>

      <p className="mb-4">
        Tämä tietosuojaseloste kertoo, miten Mainoskylä kerää, käyttää ja suojaa henkilötietoja.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Kerättävät tiedot</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Sähköpostiosoite (kirjautumista ja ilmoitusten hallintaa varten)</li>
        <li>Ilmoitusten sisällöt ja ajankohdat</li>
        <li>Maksutiedot, jos käytät maksullisia palveluja</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">Tietojen käyttö</h2>
      <p className="mb-4">
        Tietoja käytetään ainoastaan palvelun tarjoamiseen ja kehittämiseen. Emme myy tai jaa tietoja kolmansille osapuolille ilman suostumustasi.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Evästeet</h2>
      <p className="mb-4">
        Sivusto käyttää evästeitä käyttäjäkokemuksen parantamiseksi. Voit estää evästeet selaimesi asetuksista.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Tietojen säilytys</h2>
      <p className="mb-4">
        Tietoja säilytetään vain niin kauan kuin on tarpeen palvelun toiminnan ja lain vaatimusten kannalta.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Yhteystiedot</h2>
      <p>
        Haluatko tarkistaa, muokata tai poistaa tietosi? Ota yhteyttä: <strong>tuki@mainoskyla.fi</strong>
      </p>
    </main>
  )
}
