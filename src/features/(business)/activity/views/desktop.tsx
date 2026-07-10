'use client'

import { useActivity } from '@/src/features/(business)/activity/hooks/useActivity'
import Hero from '@/src/features/(business)/activity/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/activity/components/layouts/shared/Core'
import DetailsClientMessage from '@/src/features/(business)/activity/components/modals/shared/Detailsclientmessage'

export default function ActivityDesktop() {
  const act = useActivity()

  return (
    <main className="px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Hero estado={act.estadoActivo} total={act.contadores[act.estadoActivo]} loading={act.loading} />
        <Core act={act} />
      </div>

      <DetailsClientMessage
        mostrar={act.modalDetalleOpen}
        onCerrar={act.cerrarDetalle}
        solicitud={act.solicitudSeleccionada}
        onCambiarEstado={act.cambiarEstado}
        procesando={act.procesando}
        error={act.error}
      />
    </main>
  )
}