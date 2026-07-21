'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'

export interface NegocioAgente {
  id:           string
  nombre:       string
  slug:         string
  tipo_negocio: string
  ciudad:       string
  telefono:     string
  correo:       string
  nombre_dueno: string
  foto_dueno:   string | null
}

export interface ReglaAgente {
  id:     string
  regla:  string
  activo: boolean
  orden:  number
}

export interface InfoAgente {
  id:       string
  titulo:   string | null
  detalles: string
  activo:   boolean
  orden:    number
}
export interface ConfigAgente {
  id:           string
  nombre:       string
  foto_url:     string | null
  personalidad: string
  reglas:       ReglaAgente[]
  informacion:  InfoAgente[]
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

interface NegocioYAgenteCache {
  negocio: NegocioAgente
  agente:  ConfigAgente
}

const _negocioCache = new Map<string, NegocioYAgenteCache>()

const MOCK_ACCIONES: AccionAgente[] = [
  { id: 'acc-1', nombre: 'Catálogo',          icono: 'Bag2' },
  { id: 'acc-2', nombre: 'Cotizar producto',  icono: 'DocumentText' },
  { id: 'acc-3', nombre: 'Reportar problema', icono: 'Warning2' },
  { id: 'acc-4', nombre: 'Agendar reunión',   icono: 'Calendar' },
]

export function useAgent(slug: string) {
  const supabase = createClient()
  const cacheado = _negocioCache.get(slug)

  const [negocio, setNegocio] = useState<NegocioAgente | null>(cacheado?.negocio ?? null)
  const [agente, setAgente]   = useState<ConfigAgente | null>(cacheado?.agente ?? null)
  const [loading, setLoading] = useState(!cacheado)
  const [error, setError]     = useState<string | null>(null)
  const [agenteActivo, setAgenteActivo] = useState(true)

  const [acciones] = useState<AccionAgente[]>(MOCK_ACCIONES)
  const [mensajes, setMensajes] = useState<MensajeAgente[]>([])
  const [texto, setTexto]       = useState('')
  const [enviando, setEnviando] = useState(false)

  const nombreAgente = agente?.nombre ?? ''
  const fotoAgente   = agente?.foto_url ?? null

  const fetchNegocio = useCallback(async () => {
    const cache = _negocioCache.get(slug)
    if (cache) {
      setNegocio(cache.negocio)
      setAgente(cache.agente)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase.rpc('obtener_negocio_por_slug', {
      p_slug: slug,
    })

    if (err || !data?.exito) {
      setError(data?.error ?? 'Negocio no encontrado')
      setLoading(false)
      return
    }

    const negocioData: NegocioAgente = data.negocio
    const agenteData: ConfigAgente = data.agente

    setNegocio(negocioData)
    setAgente(agenteData)
    _negocioCache.set(slug, { negocio: negocioData, agente: agenteData })
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
    
    const historialParaGemini = mensajes
    setMensajes(prev => [...prev, mensajeCliente])
    setTexto('')
    setEnviando(true)
    enviarAGemini(limpio, historialParaGemini)

    async function enviarAGemini(mensajeTexto: string, historial: MensajeAgente[]) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            mensaje: mensajeTexto,
            historial: historial.map(m => ({ rol: m.rol, texto: m.texto })),
          }),
        })

        const data = await res.json()

        const textoRespuesta = data?.exito
          ? data.respuesta
          : 'Lo siento, tuve un problema para responder. ¿Puedes intentar de nuevo?'

        const mensajeAgente: MensajeAgente = {
          id: `msg-${Date.now() + 1}`,
          rol: 'agente',
          texto: textoRespuesta,
          fecha: new Date().toISOString(),
        }
        setMensajes(prev => [...prev, mensajeAgente])
      } catch {
        const mensajeError: MensajeAgente = {
          id: `msg-${Date.now() + 1}`,
          rol: 'agente',
          texto: 'Lo siento, no pude conectarme en este momento. Intenta de nuevo en unos segundos.',
          fecha: new Date().toISOString(),
        }
        setMensajes(prev => [...prev, mensajeError])
      } finally {
        setEnviando(false)
      }
    }
    }, [slug, mensajes])

  const seleccionarAccion = useCallback((accion: AccionAgente) => {
    enviarMensaje(accion.nombre)
  }, [enviarMensaje])

  const limpiarChat = useCallback(() => {
    setMensajes([])
    setTexto('')
    setEnviando(false)
  }, [])

  useEffect(() => {
    const handleLimpiar = () => limpiarChat()
    window.addEventListener('limpiar-chat-agente', handleLimpiar)
    return () => window.removeEventListener('limpiar-chat-agente', handleLimpiar)
  }, [limpiarChat])

  const toggleAgente = useCallback(() => {
    setAgenteActivo(prev => !prev)
  }, [])

  return {
    limpiarChat,
    negocio,
    agente,
    loading,
    error,
    nombreAgente,
    fotoAgente,
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