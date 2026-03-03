import { Suspense } from 'react'
import AuthCallbackClient from './AuthCallbackClient'

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-md mx-auto p-6">
          <h1 className="text-xl font-semibold">Vahvistetaan kirjautuminen…</h1>
          <p className="text-sm opacity-70 mt-2">Hetki vielä.</p>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}