'use client'

import { useShares } from '@/src/features/(business)/shares/hooks/useShares'
import Hero from '@/src/features/(business)/shares/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/shares/components/layouts/shared/Core'
import DetailsActionCard from '@/src/features/(business)/shares/components/modals/shared/DetailsActionCard'
import NewProposal from '@/src/features/(business)/shares/views/shared/NewProposal'

export default function SharesDesktop() {
  const sh = useShares()

  if (sh.vista === 'nueva') {
    return <NewProposal sh={sh} />
  }

  return (
    <main className="px-10 py-4">
      <div className="max-w-8xl flex flex-col gap-8">
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
        propuesta={sh.propuestaSeleccionada}
        cargando={sh.cargandoDetalle}
        onCambiarEstado={sh.cambiarEstado}
        onEliminar={sh.eliminarPropuesta}
        procesando={sh.procesando}
        error={sh.error}
      />
    </main>
  )
}