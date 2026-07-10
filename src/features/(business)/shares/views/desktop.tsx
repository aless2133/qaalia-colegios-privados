'use client'

import { useShares } from '@/src/features/(business)/shares/hooks/useShares'
import Hero from '@/src/features/(business)/shares/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/shares/components/layouts/shared/Core'
import DetailsActionCard from '@/src/features/(business)/shares/components/modals/shared/DetailsActionCard'

export default function SharesDesktop() {
  const sh = useShares()

  return (
    <main className="px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <Hero
          total={sh.totalActivas}
          loading={sh.loading}
          busqueda={sh.busqueda}
          onBuscar={sh.setBusqueda}
          onNuevo={sh.abrirNuevo}
          isDesktop
        />
        <Core sh={sh} />
      </div>

      <DetailsActionCard
        mostrar={sh.modalDetalleOpen}
        onCerrar={sh.cerrarDetalle}
        accion={sh.accionSeleccionada}
        onCambiarEstado={sh.cambiarEstado}
        procesando={sh.procesando}
        error={sh.error}
      />
    </main>
  )
}