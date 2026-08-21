'use client'

import { usePlan } from '@/src/features/plan/hooks/usePlan'
import Hero from '@/src/features/plan/components/layouts/shared/Hero'
import Core from '@/src/features/plan/components/layouts/shared/Core'
import { useLandingScope } from '@/src/features/landing/hooks/useLandingScope'

export default function PlanMobile() {
  const {
    planes, loading,
    planActualSlug, estadoActual, fechaFinPeriodo,
    procesandoSlug, errorCheckout,
    iniciarCheckout, paddleListo,
  } = usePlan()

  useLandingScope()
  return (
    <main className="px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        <Hero estadoActual={estadoActual} fechaFinPeriodo={fechaFinPeriodo} />

        <Core
          planes={planes}
          loading={loading}
          planActualSlug={planActualSlug}
          estadoActual={estadoActual}
          procesandoSlug={procesandoSlug}
          errorCheckout={errorCheckout}
          paddleListo={paddleListo}
          onSeleccionarPlan={iniciarCheckout}
        />
      </div>
    </main>
  )
}