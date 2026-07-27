'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/src/lib/supabase/client'
export interface BrandingAgente {
  logo_url:           string | null
  descripcion:        string | null
  color_marca:        string | null
  mensaje_bienvenida: string | null
  font_family:        string | null
}
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
  branding?:    BrandingAgente
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
  descripcion:        string | null
  activo:             boolean
  es_predeterminado:  boolean
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

interface NegocioYAgentesCache {
  negocio: NegocioAgente
  agentes: ConfigAgente[]
}

const _negocioCache = new Map<string, NegocioYAgentesCache>()

// Sincroniza agenteActivoId entre todas las instancias de useAgent(slug)
// montadas al mismo tiempo (ej. la del Navbar y la del Core), para que el
// cambio de agente sea instantáneo sin necesidad de recargar la página.
const _agenteActivoListeners = new Map<string, Set<(id: string) => void>>()

function emitirCambioAgenteActivo(slug: string, id: string) {
  _agenteActivoListeners.get(slug)?.forEach(fn => fn(id))
}

function storageKeyAgenteCliente(slug: string) {
  return `agente_activo_cliente:${slug}`
}
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
  const [agentes, setAgentes] = useState<ConfigAgente[]>(cacheado?.agentes ?? [])
  const [agenteActivoId, setAgenteActivoIdState] = useState<string | null>(() => {
    if (!cacheado?.agentes?.length) return null
    let preferido: string | null = null
    try { preferido = sessionStorage.getItem(storageKeyAgenteCliente(slug)) } catch {}
    const existe = preferido && cacheado.agentes.some(a => a.id === preferido)
    return existe ? preferido! : (cacheado.agentes.find(a => a.es_predeterminado)?.id ?? cacheado.agentes[0].id)
  })
  const [loading, setLoading] = useState(!cacheado)
  const [error, setError]     = useState<string | null>(null)
  const [agenteActivo, setAgenteActivo] = useState(true)

  const [acciones] = useState<AccionAgente[]>(MOCK_ACCIONES)
  const [mensajes, setMensajes] = useState<MensajeAgente[]>([])
  const [texto, setTexto]       = useState('')
  const [enviando, setEnviando] = useState(false)

    // Se suscribe a cambios de agente activo disparados por CUALQUIER
  // instancia de useAgent(slug) (ej. el Navbar), no solo la propia.
  useEffect(() => {
    const listeners = _agenteActivoListeners.get(slug) ?? new Set()
    const listener = (id: string) => setAgenteActivoIdState(id)
    listeners.add(listener)
    _agenteActivoListeners.set(slug, listeners)
    return () => { listeners.delete(listener) }
  }, [slug])

  const primerRenderAgenteActivo = useRef(true)
  useEffect(() => {
    if (primerRenderAgenteActivo.current) {
      primerRenderAgenteActivo.current = false
      return
    }
    // Nueva conversación: el agente que entra tiene su propio entrenamiento
    // (personalidad, reglas, información), así que no se arrastra el
    // historial armado para el agente anterior. Corre sin importar si el
    // cambio vino de esta instancia o de otra sincronizada.
    setMensajes([])
    setTexto('')
  }, [agenteActivoId])

  const agente = agentes.find(a => a.id === agenteActivoId) ?? agentes.find(a => a.es_predeterminado) ?? agentes[0] ?? null
  const nombreAgente = agente?.nombre ?? ''
  const fotoAgente   = agente?.foto_url ?? null

  const fetchNegocio = useCallback(async () => {
    const cache = _negocioCache.get(slug)
    if (cache) {
      setNegocio(cache.negocio)
      setAgentes(cache.agentes)
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

    const negocioData: NegocioAgente  = data.negocio
    const agentesData: ConfigAgente[] = data.agentes ?? []

    setNegocio(negocioData)
    setAgentes(agentesData)
    _negocioCache.set(slug, { negocio: negocioData, agentes: agentesData })

    setAgenteActivoIdState(prev => {
      if (prev && agentesData.some(a => a.id === prev)) return prev
      let preferido: string | null = null
      try { preferido = sessionStorage.getItem(storageKeyAgenteCliente(slug)) } catch {}
      const existe = preferido && agentesData.some(a => a.id === preferido)
      return existe ? preferido! : (agentesData.find(a => a.es_predeterminado)?.id ?? agentesData[0]?.id ?? null)
    })

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
            agente_id: agenteActivoId,
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
    }, [slug, mensajes, agenteActivoId])

  const seleccionarAccion = useCallback((accion: AccionAgente) => {
    enviarMensaje(accion.nombre)
  }, [enviarMensaje])

  const toggleAgente = useCallback(() => {
    setAgenteActivo(prev => !prev)
  }, [])

const seleccionarAgente = useCallback((id: string) => {
    if (id === agenteActivoId) return
    setAgenteActivoIdState(id)
    try { sessionStorage.setItem(storageKeyAgenteCliente(slug), id) } catch {}
    emitirCambioAgenteActivo(slug, id)
  }, [slug, agenteActivoId])

  return {
    negocio,
    agente,
    agentes,
    agenteActivoId,
    seleccionarAgente,
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