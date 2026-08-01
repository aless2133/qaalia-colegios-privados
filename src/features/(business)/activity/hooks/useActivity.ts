'use client'

import { useEffect, useState } from 'react'

export type EstadoActividad = 'pendiente' |'confirmada' | 'en_proceso' | 'completada' | 'rechazada'

export interface MensajeChat {
  id:    string
  rol:   'cliente' | 'agente'
  texto: string
  fecha: string
}

export interface Solicitud {
  id:                string
  cliente_nombre:    string
  cliente_whatsapp?: string | null
  cliente_correo?:   string | null
  accion:            string
  resumen:           string
  estado:            EstadoActividad
  fecha:             string
  conversacion:      MensajeChat[]
}

// TODO: reemplazar por datos reales (Supabase, API, etc). Esto es solo para maquetar el diseño.
const MOCK_SOLICITUDES: Solicitud[] = [
  {
    id: 'sol-1',
    cliente_nombre: 'Andrea Salazar',
    cliente_whatsapp: '+593 99 123 4567',
    cliente_correo: null,
    accion: 'Cotizar producto',
    resumen: 'Quiere cotización de 50 unidades de café orgánico 250g para su cafetería.',
    estado: 'pendiente',
    fecha: '2026-07-09T09:12:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'Hola, buenas! Vi su catálogo y me interesa el café orgánico', fecha: '2026-07-09T09:10:00' },
      { id: 'm2', rol: 'agente', texto: '¡Hola Andrea! Con gusto. ¿Cuántas unidades necesitas y para cuándo?', fecha: '2026-07-09T09:11:00' },
      { id: 'm3', rol: 'cliente', texto: 'Serían 50 unidades de 250g, lo antes posible', fecha: '2026-07-09T09:12:00' },
    ],
  },
  {
    id: 'sol-2',
    cliente_nombre: 'Michael Torres',
    cliente_whatsapp: null,
    cliente_correo: 'michael.torres@gmail.com',
    accion: 'Solicitar proyecto a medida',
    resumen: 'Necesita una app de reservas para su clínica dental, incluye pagos en línea.',
    estado: 'pendiente',
    fecha: '2026-07-08T18:40:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'Buenas, necesito un sistema de citas para mi clínica dental', fecha: '2026-07-08T18:35:00' },
      { id: 'm2', rol: 'agente', texto: 'Perfecto Michael. ¿Necesitas que incluya cobro en línea también?', fecha: '2026-07-08T18:37:00' },
      { id: 'm3', rol: 'cliente', texto: 'Sí, sería ideal poder cobrar el abono al agendar', fecha: '2026-07-08T18:40:00' },
    ],
  },
  {
    id: 'sol-3',
    cliente_nombre: 'Coop. Ahorro Provida',
    cliente_whatsapp: '+593 98 765 4321',
    cliente_correo: null,
    accion: 'Reportar problema',
    resumen: 'El bot de WhatsApp dejó de responder desde ayer en la tarde.',
    estado: 'pendiente',
    fecha: '2026-07-08T16:02:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'El bot no está respondiendo a los socios desde ayer', fecha: '2026-07-08T16:00:00' },
      { id: 'm2', rol: 'agente', texto: 'Gracias por avisar, ya quedó registrado para revisión técnica', fecha: '2026-07-08T16:02:00' },
    ],
  },
  {
    id: 'sol-4',
    cliente_nombre: 'Diana Ruiz',
    cliente_whatsapp: '+593 96 555 1212',
    cliente_correo: 'diana.ruiz@outlook.com',
    accion: 'Agendar reunión',
    resumen: 'Quiere agendar una llamada para revisar el alcance de su tienda en línea.',
    estado: 'en_proceso',
    fecha: '2026-07-07T11:20:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'Quisiera agendar una reunión para hablar del proyecto', fecha: '2026-07-07T11:15:00' },
      { id: 'm2', rol: 'agente', texto: 'Claro, te comparto opciones de horario por Meet esta semana', fecha: '2026-07-07T11:18:00' },
      { id: 'm3', rol: 'cliente', texto: 'Perfecto, el jueves a las 10am me viene bien', fecha: '2026-07-07T11:20:00' },
    ],
  },
  {
    id: 'sol-5',
    cliente_nombre: 'Grupo Ferretero Andes',
    cliente_whatsapp: '+593 95 222 3344',
    cliente_correo: null,
    accion: 'Cotizar producto',
    resumen: 'Solicita cotización de 200 candados de seguridad para reventa.',
    estado: 'en_proceso',
    fecha: '2026-07-06T15:45:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'Necesito precio por mayor de candados de seguridad', fecha: '2026-07-06T15:40:00' },
      { id: 'm2', rol: 'agente', texto: 'Con gusto, ¿qué cantidad manejas mensualmente?', fecha: '2026-07-06T15:42:00' },
      { id: 'm3', rol: 'cliente', texto: 'Unas 200 unidades para empezar', fecha: '2026-07-06T15:45:00' },
    ],
  },
  {
    id: 'sol-6',
    cliente_nombre: 'Fernanda León',
    cliente_whatsapp: null,
    cliente_correo: 'fernanda.leon@hotmail.com',
    accion: 'Reportar problema',
    resumen: 'No le llegaba el correo de confirmación de pago, ya se solucionó.',
    estado: 'completada',
    fecha: '2026-07-04T10:05:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'No me llegó el correo de confirmación de mi pago', fecha: '2026-07-04T10:00:00' },
      { id: 'm2', rol: 'agente', texto: 'Ya lo revisamos, el correo se reenvió correctamente', fecha: '2026-07-04T10:05:00' },
    ],
  },
  {
    id: 'sol-7',
    cliente_nombre: 'Restaurante El Fogón',
    cliente_whatsapp: '+593 99 888 7766',
    cliente_correo: null,
    accion: 'Solicitar proyecto a medida',
    resumen: 'Pidió un sistema de pedidos para su restaurante, proyecto entregado y aprobado.',
    estado: 'completada',
    fecha: '2026-07-02T13:30:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'Necesitamos un sistema de pedidos para las mesas', fecha: '2026-07-02T13:20:00' },
      { id: 'm2', rol: 'agente', texto: 'Perfecto, quedó entregado y funcionando', fecha: '2026-07-02T13:30:00' },
    ],
  },
  {
    id: 'sol-8',
    cliente_nombre: 'Carlos Núñez',
    cliente_whatsapp: '+593 91 444 5566',
    cliente_correo: null,
    accion: 'Cotizar producto',
    resumen: 'Pidió 1000 unidades con pago contra entrega, no cumplía la política de pagos.',
    estado: 'rechazada',
    fecha: '2026-07-01T09:00:00',
    conversacion: [
      { id: 'm1', rol: 'cliente', texto: 'Quiero 1000 unidades pero pago contra entrega', fecha: '2026-07-01T08:55:00' },
      { id: 'm2', rol: 'agente', texto: 'Por el momento no manejamos pago contra entrega para ese volumen', fecha: '2026-07-01T09:00:00' },
    ],
  },
]

export function useActivity() {
  const [loading, setLoading] = useState(true)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [estadoActivo, setEstadoActivo] = useState<EstadoActividad>('pendiente')
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null)
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: reemplazar por el fetch real
    const timer = setTimeout(() => {
      setSolicitudes(MOCK_SOLICITUDES)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [])

  const solicitudesVisibles = solicitudes.filter(s => s.estado === estadoActivo)

  const contadores: Record<EstadoActividad, number> = {
    pendiente:  solicitudes.filter(s => s.estado === 'pendiente').length,
    confirmada:  solicitudes.filter(s => s.estado === 'confirmada').length,
    en_proceso: solicitudes.filter(s => s.estado === 'en_proceso').length,
    completada: solicitudes.filter(s => s.estado === 'completada').length,
    rechazada:  solicitudes.filter(s => s.estado === 'rechazada').length,
  }

  const abrirDetalle = (solicitud: Solicitud) => {
    setSolicitudSeleccionada(solicitud)
    setModalDetalleOpen(true)
  }

  const cerrarDetalle = () => setModalDetalleOpen(false)

  const cambiarEstado = async (id: string, estado: EstadoActividad) => {
    setProcesando(true)
    setError(null)
    try {
      // TODO: reemplazar por la llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 300))
      setSolicitudes(prev => prev.map(s => (s.id === id ? { ...s, estado } : s)))
      setSolicitudSeleccionada(prev => (prev && prev.id === id ? { ...prev, estado } : prev))
    } catch {
      setError('No se pudo actualizar el estado. Intenta de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  return {
    loading,
    solicitudes,
    solicitudesVisibles,
    estadoActivo,
    setEstadoActivo,
    contadores,
    solicitudSeleccionada,
    modalDetalleOpen,
    abrirDetalle,
    cerrarDetalle,
    cambiarEstado,
    procesando,
    error,
  }
}