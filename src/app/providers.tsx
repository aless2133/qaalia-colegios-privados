'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import SplashScreen from '@/src/features/landing/components/transitions/SplashScreen'
import { createClient } from '@/src/lib/supabase/client'
 
function clearNegocioStore() {
  const g = globalThis as any
  if (g.__negocio_store) {
    g.__negocio_store.negocio = null
  }
  try {
    sessionStorage.removeItem('negocio_activo_id')
    sessionStorage.removeItem('negocio_activo_data')
  } catch {}
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        // Nuke everything del usuario anterior
        clearNegocioStore()
        queryClient.clear()
      }
    })
    return () => subscription.unsubscribe()
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen />
      {children}
    </QueryClientProvider>
  )
}