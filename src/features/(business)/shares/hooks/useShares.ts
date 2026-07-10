'use client'

import { useEffect, useMemo, useState } from 'react'

export type TipoAccion = 'catalogo' | 'formulario' | 'agenda' | 'personalizada'

export interface Accion {
  id:                 string
  nombre:             string
  descripcion:        string
  tipo:               TipoAccion
  activa:             boolean
  fecha_creacion:     string
  usos:               number
  campos_solicitados: string[]
}

// TODO: reemplazar por datos reales (Supabase, API, etc). Esto es solo para maquetar el diseño.
const MOCK_ACCIONES: Accion[] = [
  {
    id: 'acc-1',
    nombre: 'Cotizar producto',
    descripcion: 'Muestra el catálogo completo de tu inventario para que el cliente elija y solicite precio.',
    tipo: 'catalogo',
    activa: true,
    fecha_creacion: '2026-06-20T10:00:00',
    usos: 34,
    campos_solicitados: ['WhatsApp', 'Correo'],
  },
  {
    id: 'acc-2',
    nombre: 'Solicitar proyecto a medida',
    descripcion: 'Formulario para que el cliente describa el proyecto de software que necesita.',
    tipo: 'formulario',
    activa: true,
    fecha_creacion: '2026-06-20T10:05:00',
    usos: 12,
    campos_solicitados: ['WhatsApp', 'Correo'],
  },
  {
    id: 'acc-3',
    nombre: 'Reportar problema',
    descripcion: 'Permite a tus clientes reportar un inconveniente y elegir la categoría del problema.',
    tipo: 'formulario',
    activa: true,
    fecha_creacion: '2026-06-21T09:30:00',
    usos: 8,
    campos_solicitados: ['WhatsApp'],
  },
  {
    id: 'acc-4',
    nombre: 'Agendar reunión',
    descripcion: 'Comparte tu disponibilidad y genera un enlace de Zoom o Meet automáticamente.',
    tipo: 'agenda',
    activa: false,
    fecha_creacion: '2026-06-22T14:15:00',
    usos: 5,
    campos_solicitados: ['Correo'],
  },
]

const SUGERENCIAS: Record<string, { descripcion: string; tipo: TipoAccion }> = {
  'Cotizar producto': {
    descripcion: 'Muestra tu catálogo para que el cliente elija y pida precio.',
    tipo: 'catalogo',
  },
  'Solicitar proyecto a medida': {
    descripcion: 'Formulario para que el cliente describa lo que necesita.',
    tipo: 'formulario',
  },
  'Reportar problema': {
    descripcion: 'Permite reportar un inconveniente por categoría.',
    tipo: 'formulario',
  },
  'Agendar reunión': {
    descripcion: 'Comparte tu disponibilidad con enlace de Zoom o Meet.',
    tipo: 'agenda',
  },
}

export function useShares() {
  const [loading, setLoading] = useState(true)
  const [acciones, setAcciones] = useState<Accion[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [accionSeleccionada, setAccionSeleccionada] = useState<Accion | null>(null)
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: reemplazar por el fetch real
    const timer = setTimeout(() => {
      setAcciones(MOCK_ACCIONES)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [])

  const accionesVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return acciones
    return acciones.filter(a => a.nombre.toLowerCase().includes(q))
  }, [acciones, busqueda])

  const totalActivas = useMemo(() => acciones.filter(a => a.activa).length, [acciones])

  const abrirDetalle = (accion: Accion) => {
    setAccionSeleccionada(accion)
    setModalDetalleOpen(true)
  }

  const cerrarDetalle = () => setModalDetalleOpen(false)

  const cambiarEstado = async (id: string, activa: boolean) => {
    setProcesando(true)
    setError(null)
    try {
      // TODO: reemplazar por la llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 300))
      setAcciones(prev => prev.map(a => (a.id === id ? { ...a, activa } : a)))
      setAccionSeleccionada(prev => (prev && prev.id === id ? { ...prev, activa } : prev))
    } catch {
      setError('No se pudo actualizar el estado. Intenta de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  const abrirNuevo = () => {
    // TODO: abrir formulario de creación de acción
  }

  const crearDesdeSugerencia = (nombre: string) => {
    const sugerencia = SUGERENCIAS[nombre]
    if (!sugerencia) return
    const nueva: Accion = {
      id: `acc-${Date.now()}`,
      nombre,
      descripcion: sugerencia.descripcion,
      tipo: sugerencia.tipo,
      activa: true,
      fecha_creacion: new Date().toISOString(),
      usos: 0,
      campos_solicitados: [],
    }
    setAcciones(prev => [nueva, ...prev])
  }

  return {
    loading,
    acciones,
    accionesVisibles,
    busqueda,
    setBusqueda,
    totalActivas,
    accionSeleccionada,
    modalDetalleOpen,
    abrirDetalle,
    cerrarDetalle,
    cambiarEstado,
    abrirNuevo,
    crearDesdeSugerencia,
    procesando,
    error,
  }
}