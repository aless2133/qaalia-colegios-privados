'use client'

import { useBusinessSelect } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import Hero from '@/src/features/(business)/dashboard/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/dashboard/components/layouts/shared/Core'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

interface Props { negocio: NegocioData }

export default function DashboardMobile({ negocio }: Props) {
  const { negocios, activoNegocio, switchNegocio } = useBusinessSelect(negocio)

  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-6">
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