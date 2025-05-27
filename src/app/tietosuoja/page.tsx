export default function Tietosuoja() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tietosuojaseloste</h1>
      <p className="mb-4">
        Mainoskylä.fi kerää ja käsittelee käyttäjien henkilötietoja ainoastaan palvelun tarjoamisen ja ylläpidon mahdollistamiseksi.
      </p>
      <p className="mb-4">
        Kerättäviä tietoja voivat olla esimerkiksi sähköpostiosoite ja käyttäjän jättämät ilmoitustiedot. Tietoja ei luovuteta kolmansille osapuolille ilman käyttäjän suostumusta, ellei laki toisin vaadi.
      </p>
      <p className="mb-4">
        Käyttäjällä on oikeus tarkastaa, korjata tai poistaa omat tietonsa. Pyynnöt voi lähettää sähköpostitse osoitteeseen <a href="mailto:info@mainoskyla.fi" className="underline text-blue-600">info@mainoskyla.fi</a>.
      </p>
      <p>
        Palvelussa voidaan käyttää evästeitä käyttäjäkokemuksen parantamiseksi. Käyttäjä voi halutessaan estää evästeiden käytön selaimensa asetuksista.
      </p>
    </main>
  )
}
