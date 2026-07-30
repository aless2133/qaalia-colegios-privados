'use client'

import { Crown, TickCircle } from 'iconsax-react'
import type { EstadoSuscripcion } from '@/src/features/plan/hooks/usePlan'

interface HeroProps {
  estadoActual:    EstadoSuscripcion | null
  fechaFinPeriodo: string | null
}

const ESTADO_LABEL: Record<EstadoSuscripcion, string> = {
  trialing: 'En periodo de prueba',
  active:   'Suscripción activa',
  past_due: 'Pago pendiente',
  paused:   'Suscripción pausada',
  canceled: 'Suscripción cancelada',
}

export default function Hero({ estadoActual, fechaFinPeriodo }: HeroProps) {
  const fecha = fechaFinPeriodo
    ? new Date(fechaFinPeriodo).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Crown size={24} color="currentColor" variant="Bold" className="text-primary" />
      </div>

      <h1 className="text-3xl font-black text-foreground leading-tight">Elige el plan que quieras</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Cambia o mejora tu plan cuando quieras. Sin permanencia, cancela cuando quieras.
      </p>

      {estadoActual && (
        <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mt-1">
          <TickCircle size={14} color="currentColor" variant="Bold" className="text-primary" />
          <span className="text-xs font-semibold text-foreground">{ESTADO_LABEL[estadoActual]}</span>
          {fecha && (
            <span className="text-xs text-muted-foreground">
              · {estadoActual === 'canceled' ? 'finalizó' : 'próximo cobro'} el {fecha}
            </span>
          )}
        </div>
      )}
    </div>
  )
}