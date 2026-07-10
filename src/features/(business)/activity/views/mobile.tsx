'use client'

import { useActivity } from '@/src/features/(business)/activity/hooks/useActivity'
import Hero from '@/src/features/(business)/activity/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/activity/components/layouts/shared/Core'
import DetailsClientMessage from '@/src/features/(business)/activity/components/modals/shared/Detailsclientmessage'

export default function ActivityMobile() {
  const act = useActivity()

  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-5">
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