'use client'

import { useEffect, useState } from 'react'

export type EstadoAsistente = 'activo' | 'pausado'
export type TipoOpcion = 'auto_respuesta' | 'contacto' | 'urgencia' | 'idioma'
export type TipoAjuste = 'perfil' | 'enlace' | 'marca' | 'notificaciones'

export interface Asistente {
  id:          string
  nombre:      string
  foto_url:    string | null
  descripcion: string
  estado:      EstadoAsistente
  enlace:      string
}

export interface OpcionAsistente {
  id:          string
  tipo:        TipoOpcion
  nombre:      string
  descripcion: string
  activa:      boolean
}

export interface AjusteAsistente {
  id:          string
  tipo:        TipoAjuste
  nombre:      string
  descripcion: string
}

// TODO: reemplazar por datos reales (Supabase, API, etc). Esto es solo para maquetar el diseño.
const MOCK_ASISTENTE: Asistente = {
  id: 'asis-1',
  nombre: 'Sofía',
  foto_url: null,
  descripcion: 'Asistente virtual de tu enlace único. Responde dudas, cotiza productos y agenda reuniones por ti.',
  estado: 'activo',
  enlace: 'qaalia.com/e/elian-dev',
}

const MOCK_OPCIONES: OpcionAsistente[] = [
  { id: 'op-1', tipo: 'auto_respuesta', nombre: 'Respuesta automática', descripcion: 'El asistente responde solo, sin esperar tu aprobación.', activa: true },
  { id: 'op-2', tipo: 'contacto',       nombre: 'Solicitar datos de contacto', descripcion: 'Pide WhatsApp o correo antes de finalizar una solicitud.', activa: true },
  { id: 'op-3', tipo: 'urgencia',       nombre: 'Detección de urgencia', descripcion: 'Marca como prioritarias las solicitudes con lenguaje urgente.', activa: false },
  { id: 'op-4', tipo: 'idioma',         nombre: 'Multiidioma', descripcion: 'Responde automáticamente en el idioma del cliente.', activa: false },
]

const MOCK_AJUSTES: AjusteAsistente[] = [
  { id: 'aj-1', tipo: 'perfil',         nombre: 'Editar perfil del asistente', descripcion: 'Nombre, foto, personalidad y reglas de respuesta.' },
  { id: 'aj-2', tipo: 'enlace',         nombre: 'Editar página de enlace único', descripcion: 'Textos, catálogo visible y orden de las acciones.' },
  { id: 'aj-3', tipo: 'marca',          nombre: 'Editar marca y colores', descripcion: 'Logo, color principal y estilo visual del enlace.' },
  { id: 'aj-4', tipo: 'notificaciones', nombre: 'Notificaciones', descripcion: 'Cuándo y cómo te avisamos de nuevas solicitudes.' },
]

export function useAssistant() {
  const [loading, setLoading] = useState(true)
  const [asistente, setAsistente] = useState<Asistente | null>(null)
  const [opciones, setOpciones] = useState<OpcionAsistente[]>([])
  const [ajustes] = useState<AjusteAsistente[]>(MOCK_AJUSTES)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    // TODO: reemplazar por el fetch real
    const timer = setTimeout(() => {
      setAsistente(MOCK_ASISTENTE)
      setOpciones(MOCK_OPCIONES)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [])

  const alternarOpcion = async (id: string, activa: boolean) => {
    setProcesando(true)
    setError(null)
    try {
      // TODO: reemplazar por la llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 300))
      setOpciones(prev => prev.map(o => (o.id === id ? { ...o, activa } : o)))
    } catch {
      setError('No se pudo actualizar la opción. Intenta de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  const personalizar = () => {
    // TODO: abrir el flujo de personalización del asistente (nombre, reglas, contexto)
  }

  const abrirAjuste = (tipo: TipoAjuste) => {
    // TODO: abrir el formulario/página correspondiente a cada ajuste
    void tipo
  }

  const copiarEnlace = async () => {
    if (!asistente) return
    try {
      await navigator.clipboard.writeText(`https://${asistente.enlace}`)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setError('No se pudo copiar el enlace.')
    }
  }

  return {
    loading,
    asistente,
    opciones,
    ajustes,
    procesando,
    error,
    copiado,
    alternarOpcion,
    personalizar,
    abrirAjuste,
    copiarEnlace,
  }
}