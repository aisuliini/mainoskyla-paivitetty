'use client'

export default function HinnastoPage() {
  return (
    <main className="bg-[#f9f5eb] text-[#333333] min-h-screen font-sans py-12 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#2f5332]">Hinnasto</h1>

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">🟢 Perusilmoitus</h2>
          <p className="mb-1">(Kampanjassa nyt ilmainen, normaalisti alla olevin hinnoin)</p>
          <ul className="list-disc list-inside ml-4 text-sm">
            <li>7 päivää: 0,90 €</li>
            <li>14 päivää: 1,40 €</li>
            <li>30 päivää: 1,90 €</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">⭐ Etusivun Premium</h2>
          <p className="mb-1">(Näkyy etusivun yläosassa, max 12 paikkaa)</p>
          <ul className="list-disc list-inside ml-4 text-sm">
            <li>7 päivää: 6,90 €</li>
            <li>14 päivää: 9,90 €</li>
            <li>30 päivää: 14,90 €</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">📂 Kategorian Premium</h2>
          <p className="mb-1">(Näkyy kategorian yläosassa, max 6 paikkaa)</p>
          <ul className="list-disc list-inside ml-4 text-sm">
            <li>7 päivää: 4,90 €</li>
            <li>14 päivää: 6,90 €</li>
            <li>30 päivää: 9,90 €</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">🔼 Nosto</h2>
          <p className="text-sm ml-4">Kertanosto listan kärkeen: 0,90 €</p>
        </div>
      </section>
    </main>
  )
}
