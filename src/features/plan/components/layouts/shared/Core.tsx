'use client'

import Details from '@/src/features/plan/components/cards/shared/Details'
import PlanCard from '@/src/features/plan/components/cards/shared/PlanCard'
import Footer from '@/src/features/plan/components/cards/shared/Footer'
import type { Plan, EstadoSuscripcion } from '@/src/features/plan/hooks/usePlan'

interface CoreProps {
  planes:            Plan[]
  loading:           boolean
  planActualSlug:    string
  estadoActual:      EstadoSuscripcion | null
  procesandoSlug:    string | null
  errorCheckout:     string | null
  paddleListo:       boolean
  onSeleccionarPlan: (plan: Plan) => void
}

export default function Core({
  planes, loading,
  planActualSlug, estadoActual,
  procesandoSlug, errorCheckout, paddleListo,
  onSeleccionarPlan,
}: CoreProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="animate-pulse h-24 bg-accent rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="animate-pulse h-96 bg-accent rounded-3xl" />
          <div className="animate-pulse h-96 bg-accent rounded-3xl" />
          <div className="animate-pulse h-96 bg-accent rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <Details />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {planes.map((plan) => (
            <PlanCard
              key={plan.slug}
              plan={plan}
              esPlanActual={plan.slug === planActualSlug}
              estadoActual={plan.slug === planActualSlug ? estadoActual : null}
              procesando={procesandoSlug === plan.slug}
              deshabilitado={!paddleListo || (procesandoSlug !== null && procesandoSlug !== plan.slug)}
              onSeleccionar={() => onSeleccionarPlan(plan)}
            />
          ))}
        </div>

        {errorCheckout && (
          <p className="text-xs font-medium text-destructive text-center">{errorCheckout}</p>
        )}
      </div>

      <Footer />
    </div>
  )
}