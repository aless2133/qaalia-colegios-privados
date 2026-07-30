'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TickCircle, Flash, Crown, Star } from 'iconsax-react'
import type { Plan, EstadoSuscripcion } from '@/src/features/plan/hooks/usePlan'

interface PlanCardProps {
  plan:          Plan
  esPlanActual:  boolean
  estadoActual:  EstadoSuscripcion | null
  procesando:    boolean
  deshabilitado: boolean
  onSeleccionar: () => void
}

const ICONOS: Record<string, typeof Star> = {
  started:    Star,
  pro:        Flash,
  enterprise: Crown,
}

function featuresDe(plan: Plan): string[] {
  const items: string[] = []
  items.push(plan.max_negocios === 1 ? '1 negocio' : `Hasta ${plan.max_negocios} negocios`)
  items.push(plan.max_agentes === -1 ? 'Agentes ilimitados' : `${plan.max_agentes} agentes`)
  items.push(plan.max_mensajes_mes === -1 ? 'Mensajes ilimitados' : `${plan.max_mensajes_mes.toLocaleString('es')} mensajes al mes`)
  items.push(plan.max_actividades === -1 ? 'Actividades ilimitadas' : `${plan.max_actividades} actividades`)
  if (plan.branding_personalizado) items.push('Branding personalizado')
  if (plan.dominio_personalizado)  items.push('Dominio propio')
  if (plan.soporte_prioritario)    items.push('Soporte prioritario')
  return items
}

export default function PlanCard({
  plan, esPlanActual, estadoActual,
  procesando, deshabilitado, onSeleccionar,
}: PlanCardProps) {
  const Icono     = ICONOS[plan.slug] ?? Star
  const destacado = plan.slug === 'pro'

  const textoBoton = esPlanActual
    ? (estadoActual === 'trialing' ? 'En periodo de prueba' : 'Tu plan actual')
    : procesando
      ? 'Abriendo pago...'
      : `Probar ${plan.trial_dias} días gratis`

  return (
    <Card className={`relative flex flex-col h-full border ${destacado ? 'border-primary shadow-lg' : 'border-border'}`}>
      {destacado && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3">
          Más popular
        </Badge>
      )}

      <CardHeader className="flex flex-col items-center text-center gap-2 pt-8">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${destacado ? 'bg-primary/15' : 'bg-accent'}`}>
          <Icono size={22} color="currentColor" variant="Bold" className={destacado ? 'text-primary' : 'text-foreground'} />
        </div>
        <h3 className="text-lg font-black text-foreground">{plan.nombre}</h3>
        <p className="text-xs text-muted-foreground px-2">{plan.descripcion}</p>
        <div className="flex items-end gap-1 mt-1">
          <span className="text-3xl font-black text-foreground">${plan.precio_mensual.toFixed(0)}</span>
          <span className="text-sm font-medium text-muted-foreground mb-1">/mes</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-5">
        <ul className="flex flex-col gap-2.5">
          {featuresDe(plan).map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs font-medium text-foreground">
              <TickCircle size={16} color="currentColor" variant="Linear" className="text-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <Button
          className="w-full rounded-2xl font-bold mt-auto"
          variant={destacado ? 'default' : 'outline'}
          disabled={esPlanActual || procesando || deshabilitado}
          onClick={onSeleccionar}
        >
          {textoBoton}
        </Button>
      </CardContent>
    </Card>
  )
}