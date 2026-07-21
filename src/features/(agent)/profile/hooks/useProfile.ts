'use client'

import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import { useActivity } from '@/src/features/(agent)/activity/hooks/useActivity'

// ── Hook público del perfil: no duplica ninguna consulta.
// Reutiliza useAgent (datos del negocio + agente) y useActivity
// (listado de actividades activas), ambos ya cacheados por slug. ──
export function useProfile(slug: string) {
  const { negocio, agente, loading: loadingNegocio, error } = useAgent(slug)
  const { actividades, loading: loadingActividades } = useActivity(slug)

  return {
    negocio,
    agente,
    error,

    actividades,
    loadingActividades,

    loading: loadingNegocio,
  }
}