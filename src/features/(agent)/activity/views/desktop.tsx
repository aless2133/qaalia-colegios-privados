'use client'

import { useActivity } from '@/src/features/(agent)/activity/hooks/useActivity'
import Hero from '@/src/features/(agent)/activity/components/layouts/shared/Hero'
import Core from '@/src/features/(agent)/activity/components/layouts/shared/Core'
import DetailsProposal from '@/src/features/(agent)/activity/components/modals/shared/DetailsProposal'

interface ActivityDesktopProps {
  slug: string
}

export default function ActivityDesktop({ slug }: ActivityDesktopProps) {
  const ac = useActivity(slug)

  return (
    <main className="px-10 py-4">
     <div className="max-w-8xl mx-auto flex flex-col gap-8">
        <div className="max-w-md">
          <Hero
            total={ac.actividades.length}
            loading={ac.loading}
            busqueda={ac.busqueda}
            onBuscar={ac.setBusqueda}
          />
        </div>
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