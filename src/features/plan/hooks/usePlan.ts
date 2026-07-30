'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { useGoogleAuth } from '@/src/lib/auth/UseLogic'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'

export type EstadoSuscripcion = 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled'

export interface Plan {
  slug:                     string
  nombre:                   string
  descripcion:              string | null
  precio_mensual:           number
  trial_dias:               number
  paddle_price_id:          string | null
  paddle_price_id_sandbox:  string | null
  max_negocios:             number
  max_agentes:              number
  max_mensajes_mes:         number
  max_actividades:          number
  branding_personalizado:   boolean
  dominio_personalizado:    boolean
  soporte_prioritario:      boolean
}

export interface SuscripcionActual {
  id:                string
  plan_slug:         string
  estado:            EstadoSuscripcion
  fecha_inicio:      string | null
  fecha_fin_periodo: string | null
  precio_pagado:     number
  cancelado_en:      string | null
}

const ES_PRODUCCION = process.env.NEXT_PUBLIC_PADDLE_ENV === 'production'

// ── LÓGICA DE PLANES Y CHECKOUT — CENTRALIZADA ──
// Igual que useEditPageAgent: react-query para datos + un solo hook
// que expone todo lo que la UI necesita, sin lógica de negocio en los componentes.

export function usePlan() {
  const supabase     = createClient()
  const queryClient  = useQueryClient()
  const router        = useRouter()
  const searchParams   = useSearchParams()
  const { loginWithGoogle } = useGoogleAuth()

  const [ownerId, setOwnerId]           = useState<string | null>(null)
  const [ownerEmail, setOwnerEmail]     = useState<string | undefined>(undefined)
  const [paddle, setPaddle]             = useState<Paddle | null>(null)
  const [procesandoSlug, setProcesandoSlug] = useState<string | null>(null)
  const [errorCheckout, setErrorCheckout]   = useState<string | null>(null)
  const [autoAbierto, setAutoAbierto]       = useState(false)
  const esPrimeraSuscripcionRef = useRef(false)

  // Owner autenticado — su id viaja como customData en el checkout
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setOwnerId(data.user?.id ?? null)
      setOwnerEmail(data.user?.email ?? undefined)
    })
  }, [supabase])

  // Paddle.js — una sola instancia para toda la página
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return

    initializePaddle({
      environment: ES_PRODUCCION ? 'production' : 'sandbox',
      token:       process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      eventCallback: (evento) => {
        if (evento.name === 'checkout.completed') {
          setProcesandoSlug(null)
          // El webhook tarda unos segundos en sincronizar Supabase
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['suscripcion_owner', ownerId] })
          }, 4000)
          // Solo si NO tenía suscripción previa: es alta nueva, va a crear su negocio.
          // Si ya era cliente (upgrade/downgrade de plan), se queda donde está.
          if (esPrimeraSuscripcionRef.current) router.push('/register')
        }
        if (evento.name === 'checkout.closed') setProcesandoSlug(null)
      },
    }).then((instancia) => instancia && setPaddle(instancia))
  }, [queryClient, ownerId])

  const { data: planes, isLoading: cargandoPlanes } = useQuery({
    queryKey: ['planes_catalogo'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('obtener_planes')
      if (error || !data?.exito) throw new Error('Error al cargar los planes')
      return data.planes as Plan[]
    },
    staleTime: 1000 * 60 * 30,
    gcTime:    1000 * 60 * 60,
  })

  const { data: suscripcionData, isLoading: cargandoSuscripcion } = useQuery({
    queryKey: ['suscripcion_owner', ownerId],
    queryFn: async () => {
      if (!ownerId) return null
      const { data, error } = await supabase.rpc('obtener_suscripcion_owner', { p_owner_id: ownerId })
      if (error || !data?.exito) throw new Error('Error al cargar tu suscripción')
      return data as { tiene_suscripcion: boolean; plan: Plan; suscripcion: SuscripcionActual | null }
    },
    enabled:   !!ownerId,
    staleTime: 1000 * 30,
    gcTime:    1000 * 60 * 5,
  })

  const suscripcionActual = suscripcionData?.suscripcion ?? null
  const planActualSlug    = suscripcionActual?.plan_slug ?? 'free'

  const abrirCheckout = useCallback((plan: Plan, paddleInstancia: Paddle, owner: string) => {
    const priceId = ES_PRODUCCION ? plan.paddle_price_id : plan.paddle_price_id_sandbox
    if (!priceId) {
      setErrorCheckout('Este plan todavía no tiene un precio configurado en Paddle')
      return
    }

    // Marca si esta es su primera suscripción (para saber si mandarlo a /register al terminar)
    esPrimeraSuscripcionRef.current = !suscripcionActual

    setProcesandoSlug(plan.slug)
    paddleInstancia.Checkout.open({
      items:      [{ priceId, quantity: 1 }],
      customData: { owner_id: owner, plan_slug: plan.slug },
      customer:   ownerEmail ? { email: ownerEmail } : undefined,
    })
  }, [ownerEmail, suscripcionActual])

  const iniciarCheckout = useCallback((plan: Plan) => {
    setErrorCheckout(null)

    // Sin sesión: abrimos Google exactamente como en /register, pero le decimos
    // que al volver aquí mismo debe traer ?checkout=<slug> para terminar el pago solo.
    if (!ownerId) {
      loginWithGoogle(`${window.location.pathname}?checkout=${plan.slug}`)
      return
    }

    if (!paddle) {
      setErrorCheckout('El checkout aún se está cargando, intenta de nuevo en un momento')
      return
    }

    abrirCheckout(plan, paddle, ownerId)
  }, [paddle, ownerId, loginWithGoogle, abrirCheckout])

  // Al volver de Google con ?checkout=<slug> en la URL, termina el pago automáticamente.
  // Espera también a que 'suscripcionData' haya resuelto (no solo ownerId/paddle/planes):
  // sin esto, un usuario que YA tiene cuenta podía disparar el checkout automático antes
  // de saber si ya tenía suscripción, dejando esPrimeraSuscripcionRef en true por error
  // y mandándolo a /register en vez de quedarse en su cuenta.
  useEffect(() => {
    const slug = searchParams.get('checkout')
    if (!slug || autoAbierto || !ownerId || !paddle || !planes || planes.length === 0) return
    if (typeof suscripcionData === 'undefined') return // aún no sabemos si ya tiene suscripción

    const plan = planes.find(p => p.slug === slug)
    if (plan) {
      setAutoAbierto(true)
      abrirCheckout(plan, paddle, ownerId)
    }

    const url = new URL(window.location.href)
    url.searchParams.delete('checkout')
    router.replace(url.pathname + url.search)
  }, [searchParams, ownerId, paddle, planes, suscripcionData, autoAbierto, abrirCheckout, router])

  return {
    planes:          planes ?? [],
    loading:         cargandoPlanes || cargandoSuscripcion,
    planActualSlug,
    estadoActual:    suscripcionActual?.estado ?? null,
    fechaFinPeriodo: suscripcionActual?.fecha_fin_periodo ?? null,
    procesandoSlug,
    errorCheckout,
    iniciarCheckout,
    paddleListo:     !!paddle,
  }
}