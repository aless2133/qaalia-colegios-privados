'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function useAgentSettings() {
  const supabase = createClient()
  const negocio = useBusiness()
  const queryClient = useQueryClient()
  const negocioId = negocio?.id

  const { data: agente, isLoading } = useQuery({
    queryKey: ['agente_config', negocioId],
    queryFn: async () => {
      if (!negocioId) return null
      const { data, error } = await supabase.rpc('obtener_agente_completo', { p_negocio_id: negocioId })
      if (error || !data?.exito) throw new Error('Error al cargar agente')
      return data
    },
    enabled: !!negocioId,
  })

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['agente_config', negocioId] })
  }, [negocioId, queryClient])

  // Mutaciones
  const actualizarMarca = async (nombre: string, fotoFile?: File | null) => {
    if (!negocioId) return
    let fotoUrl = agente?.marca?.foto_url ?? null

    if (fotoFile) {
      const ext  = fotoFile.name.split('.').pop() || 'jpg'
      const path = `${negocioId}/${Date.now()}.${ext}`
      
      const { error: upErr } = await supabase.storage
        .from('foto-agentes')
        .upload(path, fotoFile, { upsert: true, cacheControl: '3600' })
      
      if (upErr) {
        throw new Error('Error al subir la foto del agente: ' + upErr.message)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('foto-agentes')
        .getPublicUrl(path)
        
      fotoUrl = publicUrl
    }

    await supabase.rpc('actualizar_marca_agente', { 
      p_negocio_id: negocioId, 
      p_nombre: nombre, 
      p_foto_url: fotoUrl 
    })
    refetch()
  }

  const actualizarPersonalidad = async (personalidad: string) => {
    if (!negocioId) return
    await supabase.rpc('actualizar_personalidad', { p_negocio_id: negocioId, p_personalidad: personalidad })
    refetch()
  }

  const crearRegla = async (regla: string) => {
    if (!negocioId) return
    await supabase.rpc('crear_regla', { p_negocio_id: negocioId, p_regla: regla })
    refetch()
  }

  const eliminarRegla = async (id: string) => {
    await supabase.rpc('eliminar_regla', { p_regla_id: id })
    refetch()
  }

  const crearInfo = async (titulo: string, detalles: string) => {
    if (!negocioId) return
    await supabase.rpc('crear_bloque_informacion', { p_negocio_id: negocioId, p_titulo: titulo, p_detalles: detalles })
    refetch()
  }

  const eliminarInfo = async (id: string) => {
    await supabase.rpc('eliminar_bloque_informacion', { p_bloque_id: id })
    refetch()
  }

  return {
    agente,
    isLoading,
    actualizarMarca,
    actualizarPersonalidad,
    crearRegla,
    eliminarRegla,
    crearInfo,
    eliminarInfo
  }
}