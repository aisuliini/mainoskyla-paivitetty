'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const refreshUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data.user ?? null)
      setLoading(false)
    }

    void refreshUser()

    const onReturn = () => {
      void refreshUser()
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refreshUser()
    }

    window.addEventListener('pageshow', onReturn)
    window.addEventListener('focus', onReturn)
    document.addEventListener('visibilitychange', onVisibility)

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
      window.removeEventListener('pageshow', onReturn)
      window.removeEventListener('focus', onReturn)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
