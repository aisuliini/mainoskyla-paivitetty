// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Mainoskylä. Ilmoitukset ovat maksuttomia.
      </div>
    </footer>
  )
}
