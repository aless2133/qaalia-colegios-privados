'use client'
// lib/auth/UseLogic.ts
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'

export type AuthStatus =
  | 'checking'
  | 'unauthenticated'
  | 'has_business'
  | 'no_business'

export interface NegocioData {
  id: string
  nombre: string
  slug: string
  plan: string
  tipo_negocio: string
  ciudad: string
  telefono: string
  correo: string
  nombre_dueno: string
  foto_dueno: string | null
  deuna_merchant_id: string | null
  activo: boolean
  created_at: string
  foto_url: string
}

export interface AuthState {
  status: AuthStatus
  user: any | null
  negocio: NegocioData | null
}

// Hook principal de auth — úsalo en page.tsx de rutas protegidas
export function useAuthLogic(options?: {
  redirectOnBusiness?: string   // ej: si ya tiene negocio, redirige a
  redirectOnNoBusiness?: string // ej: si no tiene negocio, redirige a
  redirectOnUnauth?: string     // ej: si no está autenticado, redirige a
}) {
  const router   = useRouter()
  const supabase = createClient()
  const [state, setState] = useState<AuthState>({
    status: 'checking',
    user: null,
    negocio: null,
  })

  useEffect(() => {
    let mounted = true

    const verificar = async () => {
      try {
        // 1. Verificar sesión activa
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          if (!mounted) return
          setState({ status: 'unauthenticated', user: null, negocio: null })
          if (options?.redirectOnUnauth) router.replace(options.redirectOnUnauth)
          return
        }

        // 2. Verificar si tiene negocio
        const { data, error: rpcError } = await supabase
          .rpc('obtener_mi_negocio', { p_owner_id: user.id })

        if (!mounted) return

        if (rpcError) {
          setState({ status: 'no_business', user, negocio: null })
          if (options?.redirectOnNoBusiness) router.replace(options.redirectOnNoBusiness)
          return
        }

        if (data?.tiene_negocio) {
          const negocio = data.datos as NegocioData
          setState({ status: 'has_business', user, negocio })
          if (options?.redirectOnBusiness) router.replace(options.redirectOnBusiness)
        } else {
          setState({ status: 'no_business', user, negocio: null })
          if (options?.redirectOnNoBusiness) router.replace(options.redirectOnNoBusiness)
        }
      } catch {
        if (!mounted) return
        setState({ status: 'unauthenticated', user: null, negocio: null })
        if (options?.redirectOnUnauth) router.replace(options.redirectOnUnauth)
      }
    }

    verificar()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event) => {
    if (event === 'SIGNED_IN') verificar()
    if (event === 'TOKEN_REFRESHED') {
      // Sincroniza Next.js para que el servidor conozca las cookies nuevas
      router.refresh()
      verificar()
    }
    if (event === 'SIGNED_OUT') {
      if (!mounted) return
      setState({ status: 'unauthenticated', user: null, negocio: null })
      if (options?.redirectOnUnauth) router.replace(options.redirectOnUnauth)
    }
  }
)

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return state
}

export function useGoogleAuth() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const loginWithGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      const redirectTo = `${window.location.origin}/auth/callback`

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options:  { redirectTo, queryParams: { prompt: 'select_account' } },
      })

      if (oauthError) setError('Error al conectar con Google. Intenta de nuevo.')
    } catch {
      setError('Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return { loginWithGoogle, logout, loading, error }
}