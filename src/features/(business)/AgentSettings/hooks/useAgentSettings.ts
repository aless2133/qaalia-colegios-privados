'use client'

import { useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useAgentBusiness } from '@/src/features/(business)/assistant/hooks/useAgentBusiness'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function useAgentSettings() {
  const supabase = createClient()
  const { agenteId } = useAgentBusiness()
  const queryClient = useQueryClient()

  const { data: agente, isLoading } = useQuery({
    queryKey: ['agente_config', agenteId],
    queryFn: async () => {
      if (!agenteId) return null
      const { data, error } = await supabase.rpc('obtener_agente_completo', { p_agente_id: agenteId })
      if (error || !data?.exito) throw new Error('Error al cargar agente')
      return data
    },
    enabled: !!agenteId,
  })

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['agente_config', agenteId] })
  }, [agenteId, queryClient])

  const actualizarMarca = async (nombre: string, fotoFile?: File | null) => {
    if (!agenteId) return
    let fotoUrl = agente?.marca?.foto_url ?? null

    if (fotoFile) {
      const ext  = fotoFile.name.split('.').pop() || 'jpg'
      const path = `${agenteId}/${Date.now()}.${ext}`

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
      p_agente_id: agenteId,
      p_nombre:    nombre,
      p_foto_url:  fotoUrl,
    })
    refetch()
  }

  const actualizarDescripcion = async (descripcion: string) => {
    if (!agenteId) return
    await supabase.rpc('actualizar_descripcion_agente', { p_agente_id: agenteId, p_descripcion: descripcion })
    refetch()
  }

  const actualizarPersonalidad = async (personalidad: string) => {
    if (!agenteId) return
    await supabase.rpc('actualizar_personalidad', { p_agente_id: agenteId, p_personalidad: personalidad })
    refetch()
  }

  const crearRegla = async (regla: string) => {
    if (!agenteId) return
    await supabase.rpc('crear_regla', { p_agente_id: agenteId, p_regla: regla })
    refetch()
  }

  const eliminarRegla = async (id: string) => {
    await supabase.rpc('eliminar_regla', { p_regla_id: id })
    refetch()
  }

  const crearInfo = async (titulo: string, detalles: string) => {
    if (!agenteId) return
    await supabase.rpc('crear_bloque_informacion', { p_agente_id: agenteId, p_titulo: titulo, p_detalles: detalles })
    refetch()
  }

  const eliminarInfo = async (id: string) => {
    await supabase.rpc('eliminar_bloque_informacion', { p_bloque_id: id })
    refetch()
  }

  const asignarAccion = async (accionId: string) => {
    if (!agenteId) return
    await supabase.rpc('asignar_accion_agente', { p_agente_id: agenteId, p_accion_id: accionId })
    refetch()
  }

  const quitarAccion = async (accionId: string) => {
    if (!agenteId) return
    await supabase.rpc('quitar_accion_agente', { p_agente_id: agenteId, p_accion_id: accionId })
    refetch()
  }

    const subirDocumento = async (file: File) => {
    if (!agenteId) return
    const ext  = file.name.split('.').pop() || 'pdf'
    const path = `${agenteId}/${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('documentos-agentes')
      .upload(path, file, { upsert: true, cacheControl: '3600' })

    if (upErr) {
      throw new Error('Error al subir el documento: ' + upErr.message)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documentos-agentes')
      .getPublicUrl(path)

    const { data, error } = await supabase.rpc('agregar_documento_agente', {
      p_agente_id: agenteId,
      p_nombre_archivo: file.name,
      p_url: publicUrl,
      p_tipo_archivo: file.type || ext,
      p_tamano_bytes: file.size,
    })

    if (error || !data?.exito) {
      throw new Error(data?.error || 'Error al registrar el documento')
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    fetch('/api/documentos/procesar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        agente_id: agenteId,
        path,
        url: publicUrl,
        tipo_archivo: file.type || ext,
      }),
    }).catch((e) => console.error('No se pudo procesar el documento:', e))

    refetch()
  }

  const eliminarDocumento = async (id: string) => {
    await supabase.rpc('eliminar_documento_agente', { p_documento_id: id })
    refetch()
  }

  return {
    agente,
    isLoading,
    actualizarMarca,
    actualizarDescripcion,
    actualizarPersonalidad,
    crearRegla,
    eliminarRegla,
    crearInfo,
    eliminarInfo,
    asignarAccion,
    quitarAccion,
    subirDocumento,
    eliminarDocumento,
  }
}