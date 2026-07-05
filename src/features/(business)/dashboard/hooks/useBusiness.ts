'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useQuery, useQueryClient }         from '@tanstack/react-query'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

// Store global para sincronización en tiempo real entre componentes
const g = globalThis as any
if (!g.__negocio_store) {
  g.__negocio_store = { negocio: null, listeners: new Set() }
}
const _store = g.__negocio_store as {
  negocio: NegocioData | null
  listeners: Set<(n: NegocioData) => void>
}

export function setActiveNegocio(negocio: NegocioData): void {
  _store.negocio = negocio
  try {
    sessionStorage.setItem('negocio_activo_id', negocio.id)
    sessionStorage.setItem('negocio_activo_data', JSON.stringify(negocio))
  } catch { }
  _store.listeners.forEach(fn => fn(negocio))
}

export function useBusiness(initialNegocio?: NegocioData): NegocioData | null {
  const [negocio, setNegocio] = useState<NegocioData | null>(() => {
    if (_store.negocio) return _store.negocio

    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('negocio_activo_data')
        if (raw) return JSON.parse(raw) as NegocioData
      } catch { }
    }

    return initialNegocio ?? null
  })

  useEffect(() => {
    if (initialNegocio && !_store.negocio) {
      setActiveNegocio(initialNegocio)
    }

    const listener = (n: NegocioData) => setNegocio(n)
    _store.listeners.add(listener)

    // Sincronización de seguridad por si el estado cambió en otra interfaz
    if (_store.negocio && negocio?.id !== _store.negocio.id) {
      setNegocio(_store.negocio)
    }

    return () => { _store.listeners.delete(listener) }
  }, [initialNegocio])

  return negocio
}

// ── LÓGICA DE SELECCIÓN DE NEGOCIOS CENTRALIZADA Y ESCALABLE ──

interface BusinessSelectState {
  negocios:         NegocioData[]
  activoNegocio:    NegocioData
  modalOpen:        boolean
  loading:          boolean
  puedeCrearMas:    boolean
  negociosRestantes: number
}

export function useBusinessSelect(initialNegocio: NegocioData) {
  const supabase = createClient()
  const negocioGlobal = useBusiness()

  const [state, setState] = useState<BusinessSelectState>({
    negocios:          [initialNegocio],
    activoNegocio:     negocioGlobal ?? initialNegocio,
    modalOpen:         false,
    loading:           true,
    puedeCrearMas:     false,
    negociosRestantes: 0,
  })

  const queryClient = useQueryClient()

  const { data: qData } = useQuery({
    queryKey: ['mis_negocios'],
    queryFn:  async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('no user')
      const { data, error } = await supabase
        .rpc('obtener_mis_negocios', { p_owner_id: user.id })
      if (error || !data) throw new Error('fetch failed')
      return data
    },
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 10,
  })

  useEffect(() => {
    if (!qData) return
    const negocios: NegocioData[] = qData.negocios ?? [initialNegocio]

    supabase
      .from('negocio_perfil')
      .select('negocio_id, foto_url')
      .in('negocio_id', negocios.map(n => n.id))
      .then(({ data: perfiles }) => {
        const perfilMap = Object.fromEntries(
          (perfiles ?? []).map((pf: any) => [pf.negocio_id, pf.foto_url])
        )
        const negociosConFoto = negocios.map(n => ({
          ...n,
          foto_url: perfilMap[n.id] ?? null,
        }))
        setState(prev => {
          let preferredId = prev.activoNegocio.id
          try {
            const raw = sessionStorage.getItem('negocio_activo_data')
            if (raw) preferredId = (JSON.parse(raw) as NegocioData).id
          } catch {}
          const activo = negociosConFoto.find(n => n.id === preferredId) ?? negociosConFoto[0]
          setActiveNegocio(activo)
          return {
            ...prev,
            negocios:          negociosConFoto,
            activoNegocio:     activo,
            loading:           false,
            puedeCrearMas:     qData.puede_crear_mas   ?? false,
            negociosRestantes: qData.negocios_restantes ?? 0,
          }
        })
      })
  }, [qData])

  const fetchNegocios = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['mis_negocios'] })
  }, [queryClient])

  useEffect(() => {
    if (negocioGlobal && negocioGlobal.id !== state.activoNegocio.id) {
      setState(prev => ({ ...prev, activoNegocio: negocioGlobal }))
    }
  }, [negocioGlobal?.id])

  const switchNegocio = (negocio: NegocioData) => {
    setState(prev => ({ ...prev, activoNegocio: negocio, modalOpen: false }))
    setActiveNegocio(negocio)
  }

  const openModal  = () => setState(prev => ({ ...prev, modalOpen: true  }))
  const closeModal = () => setState(prev => ({ ...prev, modalOpen: false }))

  return {
    ...state,
    switchNegocio,
    openModal,
    closeModal,
    refetch: fetchNegocios,
  }
}