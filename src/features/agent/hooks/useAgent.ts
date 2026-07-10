'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'

export interface NegocioAgente {
  id:           string
  nombre:       string
  slug:         string
  tipo_negocio: string
  ciudad:       string
  nombre_dueno: string
  foto_dueno:   string | null
}

export interface AccionAgente {
  id:     string
  nombre: string
  icono:  string
}

export interface ProductoAgente {
  id:       string
  nombre:   string
  precio:   number
  foto_url: string
}

export interface MensajeAgente {
  id:         string
  rol:        'cliente' | 'agente'
  texto:      string
  fecha:      string
  productos?: ProductoAgente[]
}

const _negocioCache = new Map<string, NegocioAgente>()

// TODO: reemplazar por fetch real a una tabla "acciones" cuando exista (creadas por el negocio)
const MOCK_ACCIONES: AccionAgente[] = [
  { id: 'acc-1', nombre: 'Catálogo',          icono: 'Bag2' },
  { id: 'acc-2', nombre: 'Cotizar producto',  icono: 'DocumentText' },
  { id: 'acc-3', nombre: 'Reportar problema', icono: 'Warning2' },
  { id: 'acc-4', nombre: 'Agendar reunión',   icono: 'Calendar' },
]

export function useAgent(slug: string) {
  const supabase = createClient()
  const cacheado = _negocioCache.get(slug)

  const [negocio, setNegocio]   = useState<NegocioAgente | null>(cacheado ?? null)
  const [loading, setLoading]   = useState(!cacheado)
  const [error, setError]       = useState<string | null>(null)

  // TODO: reemplazar por columna/tabla real cuando exista el on/off del agente
  const [agenteActivo, setAgenteActivo] = useState(true)

  const [acciones] = useState<AccionAgente[]>(MOCK_ACCIONES)
  const [mensajes, setMensajes] = useState<MensajeAgente[]>([])
  const [texto, setTexto]       = useState('')
  const [enviando, setEnviando] = useState(false)

  // TODO: cuando exista tabla "agentes" (nombre, reglas, restricciones, contexto)
  // reemplazar este fallback por el nombre configurado por el negocio.
  const nombreAgente = negocio?.nombre ?? ''

  const fetchNegocio = useCallback(async () => {
    const cache = _negocioCache.get(slug)
    if (cache) {
      setNegocio(cache)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('negocios')
      .select('id, nombre, slug, tipo_negocio, ciudad, nombre_dueno, foto_dueno')
      .eq('slug', slug)
      .eq('activo', true)
      .limit(1)
      .single()

    if (err || !data) {
      setError('Negocio no encontrado')
      setLoading(false)
      return
    }

    setNegocio(data)
    _negocioCache.set(slug, data)
    setLoading(false)
  }, [slug])

  useEffect(() => { fetchNegocio() }, [fetchNegocio])

  const enviarMensaje = useCallback(async (contenido: string) => {
    const limpio = contenido.trim()
    if (!limpio) return

    const mensajeCliente: MensajeAgente = {
      id: `msg-${Date.now()}`,
      rol: 'cliente',
      texto: limpio,
      fecha: new Date().toISOString(),
    }
    setMensajes(prev => [...prev, mensajeCliente])
    setTexto('')
    setEnviando(true)

    // TODO: reemplazar por la llamada real al agente IA (RPC / endpoint del backend)
    await new Promise(resolve => setTimeout(resolve, 700))

    const mensajeAgente: MensajeAgente = {
      id: `msg-${Date.now() + 1}`,
      rol: 'agente',
      texto: 'Gracias por tu mensaje, en un momento te ayudo con eso.',
      fecha: new Date().toISOString(),
    }
    setMensajes(prev => [...prev, mensajeAgente])
    setEnviando(false)
  }, [])

  const seleccionarAccion = useCallback((accion: AccionAgente) => {
    enviarMensaje(accion.nombre)
  }, [enviarMensaje])

  const toggleAgente = useCallback(() => {
    // TODO: reemplazar por RPC real de activar/desactivar agente
    setAgenteActivo(prev => !prev)
  }, [])

  return {
    negocio,
    loading,
    error,
    nombreAgente,
    agenteActivo,
    toggleAgente,
    acciones,
    seleccionarAccion,
    mensajes,
    enviarMensaje,
    texto,
    setTexto,
    enviando,
  }
}