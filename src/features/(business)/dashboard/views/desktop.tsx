'use client'

import { useBusinessSelect } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import Hero from '@/src/features/(business)/dashboard/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/dashboard/components/layouts/shared/Core'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

interface Props { negocio: NegocioData }

export default function DashboardDesktop({ negocio }: Props) {
  const { negocios, activoNegocio, switchNegocio } = useBusinessSelect(negocio)

  return (
    <main className="px-10 py-4">
      <div className="max-w-8xl flex flex-col gap-8">
        <Hero
          negocio={activoNegocio}
          negocios={negocios}
          onSwitch={switchNegocio}
        />
        <Core negocio={activoNegocio} />
      </div>
    </main>
  )
}