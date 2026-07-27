'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'

export interface AgenteData {
  id:                 string
  nombre:             string
  foto_url:           string | null
  descripcion:        string | null
  activo:             boolean
  es_predeterminado:  boolean
  created_at:         string
}

// Store global para sincronización en tiempo real entre componentes
const g = globalThis as any
if (!g.__agente_store) {
  g.__agente_store = { agenteId: null, listeners: new Set() }
}
const _store = g.__agente_store as {
  agenteId:  string | null
  listeners: Set<(id: string) => void>
}

function storageKey(negocioId: string) {
  return `agente_activo_id:${negocioId}`
}

export function setActiveAgentId(negocioId: string, agenteId: string): void {
  _store.agenteId = agenteId
  try {
    sessionStorage.setItem(storageKey(negocioId), agenteId)
  } catch {}
  _store.listeners.forEach(fn => fn(agenteId))
}

export function useAgentBusiness() {
  const supabase = createClient()
  const negocio = useBusiness()
  const negocioId = negocio?.id
  const queryClient = useQueryClient()

  const [agenteId, setAgenteId] = useState<string | null>(() => _store.agenteId)

  const { data: qData, isLoading } = useQuery({
    queryKey: ['agentes_negocio', negocioId],
    queryFn: async () => {
      if (!negocioId) return null
      const { data, error } = await supabase.rpc('obtener_agentes_negocio', { p_negocio_id: negocioId })
      if (error || !data?.exito) throw new Error('Error al cargar agentes')
      return data
    },
    enabled: !!negocioId,
    staleTime: 1000 * 60 * 2,
  })

  const agentes: AgenteData[] = qData?.agentes ?? []

  // Resuelve cuál agente debe quedar activo cada vez que cambia el negocio o su lista de agentes
  useEffect(() => {
    if (!negocioId || agentes.length === 0) return

    let preferido: string | null = null
    try {
      preferido = sessionStorage.getItem(storageKey(negocioId))
    } catch {}

    const existe = preferido && agentes.some(a => a.id === preferido)
    const predeterminado = agentes.find(a => a.es_predeterminado) ?? agentes[0]
    const resuelto = existe ? preferido! : predeterminado.id

    setActiveAgentId(negocioId, resuelto)
    setAgenteId(resuelto)
  }, [negocioId, qData])

  useEffect(() => {
    const listener = (id: string) => setAgenteId(id)
    _store.listeners.add(listener)
    return () => { _store.listeners.delete(listener) }
  }, [])

  const agenteActivo = agentes.find(a => a.id === agenteId) ?? agentes.find(a => a.es_predeterminado) ?? null

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['agentes_negocio', negocioId] })
  }, [negocioId, queryClient])

  const seleccionar = (id: string) => {
    if (!negocioId) return
    setActiveAgentId(negocioId, id)
  }

  const crearAgente = async (nombre: string, descripcion?: string) => {
    if (!negocioId) return
    const { data } = await supabase.rpc('crear_agente', {
      p_negocio_id:  negocioId,
      p_nombre:      nombre,
      p_descripcion: descripcion ?? null,
    })
    if (data?.exito && data.agente_id) {
      setActiveAgentId(negocioId, data.agente_id)
    }
    refetch()
    return data
  }

  const eliminarAgente = async (id: string) => {
    const { data } = await supabase.rpc('eliminar_agente', { p_agente_id: id })
    if (data?.exito) {
      if (id === agenteId && negocioId) {
        const predeterminado = agentes.find(a => a.es_predeterminado)
        if (predeterminado) setActiveAgentId(negocioId, predeterminado.id)
      }
      refetch()
    }
    return data
  }

  const toggleAgente = async (id: string, activo: boolean) => {
    const { data } = await supabase.rpc('toggle_agente', { p_agente_id: id, p_activo: activo })
    refetch()
    return data
  }

  return {
    agentes,
    agenteActivo,
    agenteId,
    isLoading,
    seleccionar,
    crearAgente,
    eliminarAgente,
    toggleAgente,
    refetch,
  }
}