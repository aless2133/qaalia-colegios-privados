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

// Config completa del agente, tal como la devuelve obtener_negocio_por_slug
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

  const [negocio, setNegocio] = useState<NegocioAgente | null>(cacheado?.negocio ?? null)
  const [agente, setAgente]   = useState<ConfigAgente | null>(cacheado?.agente ?? null)
  const [loading, setLoading] = useState(!cacheado)
  const [error, setError]     = useState<string | null>(null)

  // TODO: reemplazar por columna/tabla real cuando exista el on/off del agente
  const [agenteActivo, setAgenteActivo] = useState(true)

  const [acciones] = useState<AccionAgente[]>(MOCK_ACCIONES)
  const [mensajes, setMensajes] = useState<MensajeAgente[]>([])
  const [texto, setTexto]       = useState('')
  const [enviando, setEnviando] = useState(false)

  // Nombre y foto reales configurados por el negocio para su agente.
  // Si no hay foto, el resto de la UI cae de vuelta al ícono Cpu de iconsax.
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

    // Una sola llamada: trae negocio + agente + reglas + información activa.
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

    // Guardamos el historial actual antes de agregar el mensaje nuevo,
    // para reenviarlo como contexto a Gemini.
    setMensajes(prev => {
      const historialParaGemini = prev
      enviarAGemini(limpio, historialParaGemini)
      return [...prev, mensajeCliente]
    })
    setTexto('')
    setEnviando(true)

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
  }, [slug])

  const seleccionarAccion = useCallback((accion: AccionAgente) => {
    enviarMensaje(accion.nombre)
  }, [enviarMensaje])

  const toggleAgente = useCallback(() => {
    // TODO: reemplazar por RPC real de activar/desactivar agente
    setAgenteActivo(prev => !prev)
  }, [])

  return {
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