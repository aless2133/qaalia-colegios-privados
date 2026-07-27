'use client'

import { useState, useMemo, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import { useQuery } from '@tanstack/react-query'

export type TipoMetodoContacto = 'whatsapp_telefono' | 'correo' | 'otro'
export type TipoPregunta       = 'abierta' | 'cerrada'

export interface MetodoContacto {
  id:                     string
  tipo:                   TipoMetodoContacto
  etiqueta_personalizada: string | null
  activo:                 boolean
  orden:                  number
}

export interface OpcionPregunta {
  id:    string
  texto: string
}

export interface Pregunta {
  id:          string
  titulo:      string
  descripcion: string | null
  tipo:        TipoPregunta
  activo:      boolean
  opciones:    OpcionPregunta[]
}

export interface Actividad {
  id:               string
  titulo:           string
  descripcion:      string | null
  orden:            number
  total_preguntas:  number
  metodos_contacto: MetodoContacto[]
}

export interface ActividadCompleta extends Actividad {
  preguntas: Pregunta[]
}

export function etiquetaMetodo(m: MetodoContacto): string {
  if (m.tipo === 'whatsapp_telefono') return 'WhatsApp'
  if (m.tipo === 'correo')            return 'Correo'
  return m.etiqueta_personalizada || 'Otro'
}

// ── Hook público: recibe el slug y reutiliza useAgent para saber
// a qué negocio pertenece (misma resolución/caché que ya usa el chat) ──
export function useActivity(slug: string) {
  const supabase = createClient()

  const { negocio, loading: loadingNegocio } = useAgent(slug)
  const negocioId = negocio?.id ?? null

  // ── Listado de actividades activas del negocio ────────
  const { data: actividadesData, isLoading: loadingActividades } = useQuery({
    queryKey: ['actividades-publico', negocioId],
    queryFn:  async () => {
      if (!negocioId) return [] as Actividad[]

      const { data } = await supabase
        .from('acciones')
        .select(`
          id, 
          nombre, 
          descripcion_corta, 
          orden,
          propuestas!inner (
            propuesta_preguntas ( id ),
            propuesta_metodos_contacto ( id, tipo, etiqueta_personalizada, activo, orden )
          )
        `)
        .eq('negocio_id', negocioId)
        .eq('tipo', 'propuesta')
        .eq('activo', true)
        .order('orden', { ascending: true })

      return ((data ?? []) as any[]).map((row): Actividad => {
        // Extraemos la data de la tabla hija (Supabase puede devolver objeto o arreglo)
        const propuestaData = Array.isArray(row.propuestas) ? row.propuestas[0] : row.propuestas;

        return {
          id:               row.id,
          titulo:           row.nombre,
          descripcion:      row.descripcion_corta,
          orden:            row.orden,
          total_preguntas:  propuestaData?.propuesta_preguntas?.length ?? 0,
          metodos_contacto: (propuestaData?.propuesta_metodos_contacto ?? [])
            .filter((m: MetodoContacto) => m.activo)
            .slice()
            .sort((a: MetodoContacto, b: MetodoContacto) => a.orden - b.orden),
        }
      })
    },
    enabled:   !!negocioId,
    staleTime: 1000 * 60 * 2,
    gcTime:    1000 * 60 * 10,
  })

  const actividades = actividadesData ?? []

  // ── Búsqueda ───────────────────────────────────────────
  const [busqueda, setBusqueda] = useState('')

  const actividadesVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return actividades
    return actividades.filter(a => a.titulo.toLowerCase().includes(q))
  }, [actividades, busqueda])

  // ── Detalle de una actividad ───────────────────────────
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadCompleta | null>(null)
  const [modalOpen,             setModalOpen]             = useState(false)
  const [cargandoDetalle,       setCargandoDetalle]       = useState(false)
  const [error,                 setError]                 = useState<string | null>(null)

  const abrirDetalle = useCallback(async (actividad: Actividad) => {
    setError(null)
    setModalOpen(true)
    setCargandoDetalle(true)
    setActividadSeleccionada({ ...actividad, preguntas: [] })

    const { data } = await supabase.rpc('obtener_propuesta_completa', { p_propuesta_id: actividad.id })
    setCargandoDetalle(false)

    if (!data?.exito) {
      setError(data?.error || 'No se pudo cargar la actividad')
      return
    }

    setActividadSeleccionada({
      ...actividad,
      titulo:      data.titulo,
      descripcion: data.descripcion,
      preguntas: (data.preguntas ?? []).map((p: any) => ({
        id:          p.id,
        titulo:      p.titulo,
        descripcion: p.descripcion,
        tipo:        p.tipo,
        activo:      p.activo,
        opciones:    p.opciones ?? [],
      })),
      metodos_contacto: (data.metodos_contacto ?? actividad.metodos_contacto)
        .filter((m: MetodoContacto) => m.activo),
    })
  }, [supabase])

  const cerrarDetalle = useCallback(() => {
    setModalOpen(false)
    setActividadSeleccionada(null)
    setError(null)
  }, [])

  const loading = loadingNegocio || loadingActividades

  return {
    loading, negocio,
    actividades, actividadesVisibles,
    busqueda, setBusqueda,

    actividadSeleccionada, modalOpen, cargandoDetalle, error,
    abrirDetalle, cerrarDetalle,
  }
}