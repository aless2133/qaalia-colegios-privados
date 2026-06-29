'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'

export type TeamAuthStatus = 'checking' | 'unauthenticated' | 'authorized' | 'unauthorized'

export interface TeamMember {
  correo: string
  nombre: string
}

export interface TeamAuthState {
  status: TeamAuthStatus
  user:   any | null
  member: TeamMember | null
}

export function useTeamAuthLogic(options?: {
  redirectOnAuthorized?:   string
  redirectOnUnauthorized?: string
  redirectOnUnauth?:       string
}) {
  const router   = useRouter()
  const supabase = createClient()
  const [state, setState] = useState<TeamAuthState>({
    status: 'checking',
    user:   null,
    member: null,
  })

  useEffect(() => {
    let mounted = true

    const verificar = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          if (!mounted) return
          setState({ status: 'unauthenticated', user: null, member: null })
          if (options?.redirectOnUnauth) router.replace(options.redirectOnUnauth)
          return
        }

        const { data, error: rpcError } = await supabase
          .rpc('verificar_acceso_admin', { p_correo: user.email })

        if (!mounted) return

        if (rpcError || !data?.autorizado) {
          await supabase.auth.signOut()
          setState({ status: 'unauthorized', user: null, member: null })
          if (options?.redirectOnUnauthorized) router.replace(options.redirectOnUnauthorized)
          return
        }

        const member: TeamMember = { correo: data.correo, nombre: data.nombre }
        setState({ status: 'authorized', user, member })
        if (options?.redirectOnAuthorized) router.replace(options.redirectOnAuthorized)
      } catch {
        if (!mounted) return
        setState({ status: 'unauthenticated', user: null, member: null })
        if (options?.redirectOnUnauth) router.replace(options.redirectOnUnauth)
      }
    }

    verificar()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') verificar()
      if (event === 'SIGNED_OUT') {
        if (!mounted) return
        setState({ status: 'unauthenticated', user: null, member: null })
        if (options?.redirectOnUnauth) router.replace(options.redirectOnUnauth)
      }
    })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  return state
}