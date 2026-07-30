'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAgentSettings } from '@/src/features/(business)/AgentSettings/hooks/useAgentSettings'
export type EstadoAsistente = 'activo' | 'pausado'
export type TipoOpcion = 'desactivar' | 'enlace' | 'antispam' | 'multiidioma'
export type TipoAjuste = 'personalizar_agente' | 'personalizar_pagina' | 'marca' | 'clave'
import { useRouter } from 'next/navigation'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import { useAgentBusiness } from '@/src/features/(business)/assistant/hooks/useAgentBusiness'
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
  descripcion: 'Asistente virtual de tu enlace único. Responde dudas, de todos tus clientes por ti.',
  estado: 'activo',
  enlace: 'qaalia.com/e/elian-dev',
}

const MOCK_OPCIONES: OpcionAsistente[] = [
  { id: 'op-4', tipo: 'multiidioma',         nombre: 'Multiidioma', descripcion: 'Responde automáticamente en el idioma del cliente.', activa: false },
  { id: 'op-2', tipo: 'enlace',       nombre: 'Convertir enlaces en botones', descripcion: 'Transforma automáticamente cualquier URL que mencione el agente en un botón interactivo dentro del chat.', activa: true },
  { id: 'op-3', tipo: 'antispam',       nombre: 'Filtro de contenido inapropiado', descripcion: 'Finaliza el chat y bloquea al usuario al detectar lenguaje ofensivo, de odio o contenido ilícito.', activa: true },
  { id: 'op-1', tipo: 'desactivar', nombre: 'Desactivar agente', descripcion: 'Desactiva temporalmente el agente. Se mostrará un mensaje indicando que estás fuera de servicio.', activa: true },
]

const MOCK_AJUSTES: AjusteAsistente[] = [
  { id: 'aj-1', tipo: 'personalizar_agente',         nombre: 'Personalizar agente', descripcion: 'Nombre, foto, personalidad, reglas de respuesta y contexto de tu negocio.' },
  { id: 'aj-2', tipo: 'personalizar_pagina',         nombre: 'Personalizar página del negocio', descripcion: 'Foto, descripción, tipografía, color, mensaje personalizado.' },
  { id: 'aj-3', tipo: 'marca',          nombre: 'Dominio personalizado', descripcion: 'Conecta tu propia dominio para reemplazar el enlace generado por defecto.' },
  { id: 'aj-4', tipo: 'clave', nombre: 'Protección con clave', descripcion: 'Exige una clave al entrar para que solo clientes autorizados puedan hablar con tu agente.' },
]

export function useAssistant() {
  const { agente } = useAgentSettings()
  const { agenteActivo, toggleAgente } = useAgentBusiness()
  const negocio = useBusiness()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [asistenteBase, setAsistenteBase] = useState<Asistente | null>(null)
  const [opciones, setOpciones] = useState<OpcionAsistente[]>([])
  const [ajustes] = useState<AjusteAsistente[]>(MOCK_AJUSTES)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [editandoPagina, setEditandoPagina] = useState(false)

  const enlaceReal = useMemo(() => {
    if (!negocio?.slug) return null
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/agent/${negocio.slug}`
  }, [negocio?.slug])

  const enlaceCorto = useMemo(() =>
    enlaceReal ? enlaceReal.replace(/^https?:\/\//, '') : 'Sin enlace configurado'
  , [enlaceReal])

  useEffect(() => {
    // TODO: reemplazar por el fetch real
    const timer = setTimeout(() => {
      setAsistenteBase(MOCK_ASISTENTE)
      setOpciones(MOCK_OPCIONES)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [])

  const alternarOpcion = async (id: string, activa: boolean) => {
    const opcion = opciones.find(o => o.id === id)

    // "Desactivar agente" va conectado al backend real: afecta únicamente
    // al agente que está activo en este momento para este negocio.
    if (opcion?.tipo === 'desactivar') {
      if (!agenteActivo) return
      setProcesando(true)
      setError(null)
      try {
        const data = await toggleAgente(agenteActivo.id, !activa)
        if (!data?.exito) {
          setError('No se pudo actualizar el agente. Intenta de nuevo.')
        }
      } catch {
        setError('No se pudo actualizar el agente. Intenta de nuevo.')
      } finally {
        setProcesando(false)
      }
      return
    }

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
    // TODO: abrir el formulario/página correspondiente a cada ajuste (marca, clave)
    if (tipo === 'personalizar_agente') {
      router.push('/settings')
      return
    }
    if (tipo === 'personalizar_pagina') {
      setEditandoPagina(true)
      return
    }
    void tipo
  }
  
  const cerrarEditorPagina = () => {
    setEditandoPagina(false)
  }

  const copiarEnlace = async () => {
    if (!enlaceReal) return
    try {
      await navigator.clipboard.writeText(enlaceReal)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setError('No se pudo copiar el enlace.')
    }
  }
  
  const asistente: Asistente | null = asistenteBase
    ? {
        ...asistenteBase,
        nombre:      agente?.marca?.nombre   || asistenteBase.nombre,
        foto_url:    agente?.marca?.foto_url ?? asistenteBase.foto_url,
        descripcion: agente?.descripcion     || asistenteBase.descripcion,
        estado:      agenteActivo ? (agenteActivo.activo ? 'activo' : 'pausado') : asistenteBase.estado,
        enlace:      enlaceCorto,
      }
    : null

    const opcionesConEstado = useMemo(() => (
    opciones.map(o =>
      o.tipo === 'desactivar' && agenteActivo
        ? { ...o, activa: !agenteActivo.activo }
        : o
    )
  ), [opciones, agenteActivo])

  return {
    loading,
    asistente,
    opciones: opcionesConEstado,
    ajustes,
    procesando,
    error,
    copiado,
    editandoPagina,
    alternarOpcion,
    personalizar,
    abrirAjuste,
    copiarEnlace,
    cerrarEditorPagina,
  }
}