'use client'

import { useActivity } from '@/src/features/(agent)/activity/hooks/useActivity'
import Hero from '@/src/features/(agent)/activity/components/layouts/shared/Hero'
import Core from '@/src/features/(agent)/activity/components/layouts/shared/Core'
import DetailsProposal from '@/src/features/(agent)/activity/components/modals/shared/DetailsProposal'

interface ActivityMobileProps {
  slug: string
}

export default function ActivityMobile({ slug }: ActivityMobileProps) {
  const ac = useActivity(slug)

  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-5">
        <Hero
          total={ac.actividades.length}
          loading={ac.loading}
          busqueda={ac.busqueda}
          onBuscar={ac.setBusqueda}
        />
        <Core ac={ac} />
      </div>

      <DetailsProposal
        mostrar={ac.modalOpen}
        onCerrar={ac.cerrarDetalle}
        actividad={ac.actividadSeleccionada}
        cargando={ac.cargandoDetalle}
        error={ac.error}
        negocio={ac.negocio}
      />
    </main>
  )
}