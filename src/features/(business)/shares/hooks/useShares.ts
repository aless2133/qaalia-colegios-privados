'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import { useQuery, useQueryClient } from '@tanstack/react-query'

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

export interface Propuesta {
  id:               string
  titulo:           string
  descripcion:      string | null
  activo:           boolean
  orden:            number
  fecha_creacion:   string
  total_preguntas:  number
  metodos_contacto: MetodoContacto[]
}

export interface PropuestaCompleta extends Propuesta {
  preguntas: Pregunta[]
}

export function etiquetaMetodo(m: MetodoContacto): string {
  if (m.tipo === 'whatsapp_telefono') return 'WhatsApp'
  if (m.tipo === 'correo')            return 'Correo'
  return m.etiqueta_personalizada || 'Otro'
}

// ── Borradores usados solo mientras se arma una propuesta nueva ──
interface PreguntaBorrador {
  tempId:      string
  titulo:      string
  descripcion: string
  tipo:        TipoPregunta
  opciones:    string[]
}

interface MetodoBorrador {
  tempId:   string
  tipo:     TipoMetodoContacto
  etiqueta: string
}

export function useShares() {
  const supabase = createClient()

  const negocioActivo = useBusiness()
  const negocioId     = negocioActivo?.id ?? null
  const loadingNeg    = !negocioActivo
  const queryClient   = useQueryClient()

  // ── Listado de propuestas del negocio activo ──────────
  const { data: propuestasData, isLoading: loadingPropuestas } = useQuery({
    queryKey: ['propuestas', negocioId],
    queryFn:  async () => {
      if (!negocioId) return [] as Propuesta[]

      const { data } = await supabase
        .from('propuestas')
        .select(`
          id, titulo, descripcion, activo, orden, created_at,
          propuesta_preguntas ( id ),
          propuesta_metodos_contacto ( id, tipo, etiqueta_personalizada, activo, orden )
        `)
        .eq('negocio_id', negocioId)
        .order('orden', { ascending: true })

      return ((data ?? []) as any[]).map((row): Propuesta => ({
        id:               row.id,
        titulo:           row.titulo,
        descripcion:      row.descripcion,
        activo:           row.activo,
        orden:            row.orden,
        fecha_creacion:   row.created_at,
        total_preguntas:  row.propuesta_preguntas?.length ?? 0,
        metodos_contacto: (row.propuesta_metodos_contacto ?? [])
          .slice()
          .sort((a: MetodoContacto, b: MetodoContacto) => a.orden - b.orden),
      }))
    },
    enabled:   !!negocioId,
    staleTime: 1000 * 60 * 2,
    gcTime:    1000 * 60 * 10,
  })

  const propuestas = propuestasData ?? []

  const fetchPropuestas = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['propuestas', negocioId] })
  }, [negocioId, queryClient])

  useEffect(() => {
    if (!negocioId) return
    const channel = supabase
      .channel(`propuestas-${negocioId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'propuestas',
        filter: `negocio_id=eq.${negocioId}`,
      }, () => fetchPropuestas())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'propuesta_preguntas',
      }, () => fetchPropuestas())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'propuesta_metodos_contacto',
      }, () => fetchPropuestas())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [negocioId, fetchPropuestas])

  // ── Búsqueda ───────────────────────────────────────────
  const [busqueda, setBusqueda] = useState('')

  const propuestasVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return propuestas
    return propuestas.filter(p => p.titulo.toLowerCase().includes(q))
  }, [propuestas, busqueda])

  const totalActivas = useMemo(() => propuestas.filter(p => p.activo).length, [propuestas])

  // ── Detalle de una propuesta ───────────────────────────
  const [propuestaSeleccionada, setPropuestaSeleccionada] = useState<PropuestaCompleta | null>(null)
  const [modalDetalleOpen,      setModalDetalleOpen]      = useState(false)
  const [cargandoDetalle,       setCargandoDetalle]       = useState(false)
  const [procesando,            setProcesando]            = useState(false)
  const [error,                 setError]                 = useState<string | null>(null)

  const abrirDetalle = async (propuesta: Propuesta) => {
    setError(null)
    setModalDetalleOpen(true)
    setCargandoDetalle(true)
    setPropuestaSeleccionada({ ...propuesta, preguntas: [] })

    const { data } = await supabase.rpc('obtener_propuesta_completa', { p_propuesta_id: propuesta.id })
    setCargandoDetalle(false)

    if (!data?.exito) {
      setError(data?.error || 'No se pudo cargar la propuesta')
      return
    }

    setPropuestaSeleccionada({
      ...propuesta,
      titulo:      data.titulo,
      descripcion: data.descripcion,
      activo:      data.activo,
      preguntas: (data.preguntas ?? []).map((p: any) => ({
        id:          p.id,
        titulo:      p.titulo,
        descripcion: p.descripcion,
        tipo:        p.tipo,
        activo:      p.activo,
        opciones:    p.opciones ?? [],
      })),
      metodos_contacto: data.metodos_contacto ?? propuesta.metodos_contacto,
    })
  }

  const cerrarDetalle = () => {
    setModalDetalleOpen(false)
    setPropuestaSeleccionada(null)
    setError(null)
  }

  const cambiarEstado = async (id: string, activa: boolean) => {
    setProcesando(true)
    setError(null)

    const fn = activa ? 'activar_propuesta' : 'desactivar_propuesta'
    const { data, error: rpcError } = await supabase.rpc(fn, { p_propuesta_id: id })
    setProcesando(false)

    if (rpcError || !data?.exito) {
      setError(data?.error || 'No se pudo actualizar el estado. Intenta de nuevo.')
      return
    }

    setPropuestaSeleccionada(prev => (prev && prev.id === id ? { ...prev, activo: activa } : prev))
    fetchPropuestas()
  }

  const eliminarPropuesta = async (id: string) => {
    setProcesando(true)
    setError(null)

    const { data, error: rpcError } = await supabase.rpc('eliminar_propuesta', { p_propuesta_id: id })
    setProcesando(false)

    if (rpcError || !data?.exito) {
      setError(data?.error || 'No se pudo eliminar la propuesta.')
      return false
    }

    cerrarDetalle()
    fetchPropuestas()
    return true
  }

  // ── Vista: listado o pantalla completa de creación ─────
  const [vista, setVista] = useState<'lista' | 'nueva'>('lista')

  // ── Formulario de nueva propuesta ──────────────────────
  const [nuevoTitulo,       setNuevoTitulo]       = useState('')
  const [nuevaDescripcion,  setNuevaDescripcion]  = useState('')
  const [nuevasPreguntas,   setNuevasPreguntas]   = useState<PreguntaBorrador[]>([])
  const [nuevosMetodos,     setNuevosMetodos]     = useState<MetodoBorrador[]>([])
  const [activarAlCrear,    setActivarAlCrear]    = useState(true)
  const [guardandoNueva,    setGuardandoNueva]    = useState(false)
  const [errorNueva,        setErrorNueva]        = useState<string | null>(null)

  const resetFormularioNueva = () => {
    setNuevoTitulo('')
    setNuevaDescripcion('')
    setNuevasPreguntas([])
    setNuevosMetodos([])
    setActivarAlCrear(true)
    setErrorNueva(null)
  }

  const abrirNuevo = () => {
    resetFormularioNueva()
    setVista('nueva')
  }

  const cerrarNuevo = () => {
    if (guardandoNueva) return
    setVista('lista')
    resetFormularioNueva()
  }

  const agregarPreguntaNueva = () => {
    if (nuevasPreguntas.length >= 10) return
    setNuevasPreguntas(prev => [...prev, {
      tempId:      `tmp-${Date.now()}-${prev.length}`,
      titulo:      '',
      descripcion: '',
      tipo:        'abierta',
      opciones:    [],
    }])
  }

  const actualizarPreguntaNueva = (tempId: string, patch: Partial<PreguntaBorrador>) => {
    setNuevasPreguntas(prev => prev.map(p => (p.tempId === tempId ? { ...p, ...patch } : p)))
  }

  const eliminarPreguntaNueva = (tempId: string) => {
    setNuevasPreguntas(prev => prev.filter(p => p.tempId !== tempId))
  }

  const agregarOpcionNueva = (tempId: string, texto: string) => {
    if (!texto.trim()) return
    setNuevasPreguntas(prev => prev.map(p =>
      p.tempId === tempId ? { ...p, opciones: [...p.opciones, texto.trim()] } : p
    ))
  }

  const eliminarOpcionNueva = (tempId: string, index: number) => {
    setNuevasPreguntas(prev => prev.map(p =>
      p.tempId === tempId ? { ...p, opciones: p.opciones.filter((_, i) => i !== index) } : p
    ))
  }

  const agregarMetodoNuevo = (tipo: TipoMetodoContacto) => {
    if (nuevosMetodos.length >= 6) return
    if (tipo !== 'otro' && nuevosMetodos.some(m => m.tipo === tipo)) return
    setNuevosMetodos(prev => [...prev, {
      tempId:   `tmp-${Date.now()}-${prev.length}`,
      tipo,
      etiqueta: '',
    }])
  }

  const actualizarMetodoNuevo = (tempId: string, etiqueta: string) => {
    setNuevosMetodos(prev => prev.map(m => (m.tempId === tempId ? { ...m, etiqueta } : m)))
  }

  const eliminarMetodoNuevo = (tempId: string) => {
    setNuevosMetodos(prev => prev.filter(m => m.tempId !== tempId))
  }

  const crearPropuestaCompleta = async () => {
    if (!negocioId) return false
    setErrorNueva(null)

    if (!nuevoTitulo.trim()) { setErrorNueva('El título es obligatorio'); return false }
    if (nuevaDescripcion.length > 120) { setErrorNueva('La descripción no puede superar 120 caracteres'); return false }

    for (const p of nuevasPreguntas) {
      if (!p.titulo.trim()) { setErrorNueva('Todas las preguntas necesitan un título'); return false }
      if (p.tipo === 'cerrada' && p.opciones.length < 2) {
        setErrorNueva('Las preguntas de opción múltiple necesitan al menos 2 opciones')
        return false
      }
    }

    for (const m of nuevosMetodos) {
      if (m.tipo === 'otro' && !m.etiqueta.trim()) {
        setErrorNueva('Nombra cada método de contacto personalizado')
        return false
      }
    }

    setGuardandoNueva(true)

    const { data: creada } = await supabase.rpc('crear_propuesta', {
      p_negocio_id:  negocioId,
      p_titulo:      nuevoTitulo.trim(),
      p_descripcion: nuevaDescripcion.trim() || null,
    })

    if (!creada?.exito) {
      setGuardandoNueva(false)
      setErrorNueva(creada?.error || 'No se pudo crear la propuesta')
      return false
    }

    const propuestaId = creada.propuesta_id

    for (const pregunta of nuevasPreguntas) {
      const { data: preguntaCreada } = await supabase.rpc('agregar_pregunta', {
        p_propuesta_id: propuestaId,
        p_titulo:       pregunta.titulo.trim(),
        p_descripcion:  pregunta.descripcion.trim() || null,
        p_tipo:         pregunta.tipo,
      })

      if (preguntaCreada?.exito && pregunta.tipo === 'cerrada') {
        for (const opcion of pregunta.opciones) {
          await supabase.rpc('agregar_opcion_pregunta', {
            p_pregunta_id: preguntaCreada.pregunta_id,
            p_texto:       opcion,
          })
        }
      }
    }

    for (const metodo of nuevosMetodos) {
      await supabase.rpc('agregar_metodo_contacto', {
        p_propuesta_id: propuestaId,
        p_tipo:         metodo.tipo,
        p_etiqueta:     metodo.tipo === 'otro' ? metodo.etiqueta.trim() : null,
      })
    }

    // Solo se puede activar si quedó al menos un método de contacto (lo exige activar_propuesta)
    if (activarAlCrear && nuevosMetodos.length > 0) {
      await supabase.rpc('activar_propuesta', { p_propuesta_id: propuestaId })
    }

    setGuardandoNueva(false)
    fetchPropuestas()
    setVista('lista')
    resetFormularioNueva()
    return true
  }

  const loading = loadingNeg || loadingPropuestas

  return {
    loading, negocioId,
    propuestas, propuestasVisibles,
    busqueda, setBusqueda,
    totalActivas,

    propuestaSeleccionada, modalDetalleOpen, cargandoDetalle,
    abrirDetalle, cerrarDetalle, cambiarEstado, eliminarPropuesta,
    procesando, error,

    vista, abrirNuevo, cerrarNuevo,

    nuevoTitulo, setNuevoTitulo,
    nuevaDescripcion, setNuevaDescripcion,
    nuevasPreguntas, agregarPreguntaNueva, actualizarPreguntaNueva, eliminarPreguntaNueva,
    agregarOpcionNueva, eliminarOpcionNueva,
    nuevosMetodos, agregarMetodoNuevo, actualizarMetodoNuevo, eliminarMetodoNuevo,
    activarAlCrear, setActivarAlCrear,
    crearPropuestaCompleta, guardandoNueva, errorNueva,

    refetch: fetchPropuestas,
  }
}