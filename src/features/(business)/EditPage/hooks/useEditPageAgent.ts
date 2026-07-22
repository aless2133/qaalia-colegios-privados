'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export interface TipografiaOption {
  slug:        string
  nombre:      string
  font_family: string
}

export interface EditPagePerfil {
  foto_url:           string | null
  descripcion:        string
  color_marca:        string
  tipografia_slug:    string
  mensaje_bienvenida: string
}

export const MAX_DESCRIPCION = 300
export const MAX_MENSAJE     = 86

const PERFIL_VACIO: EditPagePerfil = {
  foto_url:           null,
  descripcion:        '',
  color_marca:        '#7C3AED',
  tipografia_slug:    'inter',
  mensaje_bienvenida: '',
}

// ── LÓGICA DE PERSONALIZACIÓN DE PÁGINA — CENTRALIZADA Y ESCALABLE ──
// Usa useBusiness() exactamente igual que el resto de features (useAgentSettings, etc.)
// para saber cuál es el negocio activo antes de leer/escribir su negocio_perfil.

export function useEditPageAgent() {
  const supabase    = createClient()
  const negocio     = useBusiness()
  const queryClient = useQueryClient()
  const negocioId   = negocio?.id

  const [perfil, setPerfil]           = useState<EditPagePerfil>(PERFIL_VACIO)
  const [fotoFile, setFotoFile]       = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [guardando, setGuardando]     = useState(false)
  const [guardado, setGuardado]       = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const { data: perfilData, isLoading: cargandoPerfil } = useQuery({
    queryKey: ['negocio_perfil', negocioId],
    queryFn: async () => {
      if (!negocioId) return null
      const { data, error } = await supabase
        .from('negocio_perfil')
        .select('foto_url, descripcion, color_marca, tipografia_slug, mensaje_bienvenida')
        .eq('negocio_id', negocioId)
        .single()
      if (error) throw new Error('Error al cargar la página del negocio')
      return data as EditPagePerfil
    },
    enabled:   !!negocioId,
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 10,
  })

  const { data: tipografias, isLoading: cargandoTipografias } = useQuery({
    queryKey: ['tipografias_catalogo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipografia_catalogo')
        .select('slug, nombre, font_family')
        .eq('activo', true)
        .order('orden', { ascending: true })
      if (error || !data) throw new Error('Error al cargar las tipografías')
      return data as TipografiaOption[]
    },
    staleTime: 1000 * 60 * 30,
    gcTime:    1000 * 60 * 60,
  })

  // Sincroniza el estado editable local cuando llegan los datos del servidor
  useEffect(() => {
    if (!perfilData) return
    setPerfil({
      foto_url:           perfilData.foto_url ?? null,
      descripcion:        perfilData.descripcion ?? '',
      color_marca:        perfilData.color_marca ?? '#7C3AED',
      tipografia_slug:    perfilData.tipografia_slug ?? 'inter',
      mensaje_bienvenida: perfilData.mensaje_bienvenida ?? '',
    })
  }, [perfilData])

  const actualizarFoto = useCallback((file: File) => {
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }, [])

  const guardarCambios = useCallback(async () => {
    if (!negocioId) return
    setGuardando(true)
    setError(null)
    try {
      let fotoUrl = perfil.foto_url

      if (fotoFile) {
        const ext  = fotoFile.name.split('.').pop() || 'jpg'
        const path = `${negocioId}/${Date.now()}.${ext}`

        const { error: upErr } = await supabase.storage
          .from('foto-negocio')
          .upload(path, fotoFile, { upsert: true, cacheControl: '3600' })

        if (upErr) throw new Error('Error al subir la foto del negocio')

        const { data: { publicUrl } } = supabase.storage
          .from('foto-negocio')
          .getPublicUrl(path)

        fotoUrl = publicUrl
      }

      const { error: updErr } = await supabase
        .from('negocio_perfil')
        .update({
          foto_url:           fotoUrl,
          descripcion:        perfil.descripcion.slice(0, MAX_DESCRIPCION),
          color_marca:        perfil.color_marca,
          tipografia_slug:    perfil.tipografia_slug,
          mensaje_bienvenida: perfil.mensaje_bienvenida.slice(0, MAX_MENSAJE),
        })
        .eq('negocio_id', negocioId)

      if (updErr) throw new Error('Error al guardar los cambios')

      setFotoFile(null)
      setPerfil(prev => ({ ...prev, foto_url: fotoUrl }))
      queryClient.invalidateQueries({ queryKey: ['negocio_perfil', negocioId] })

      setGuardado(true)
      setTimeout(() => setGuardado(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }, [negocioId, perfil, fotoFile, supabase, queryClient])

  return {
    negocio,
    perfil,
    setPerfil,
    fotoPreview: fotoPreview ?? perfil.foto_url,
    actualizarFoto,
    tipografias: tipografias ?? [],
    loading:     cargandoPerfil || cargandoTipografias,
    guardando,
    guardado,
    error,
    guardarCambios,
  }
}