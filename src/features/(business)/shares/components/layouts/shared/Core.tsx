'use client'

import type { useShares } from '@/src/features/(business)/shares/hooks/useShares'
import ActionsCard from '@/src/features/(business)/shares/components/cards/shared/ActionsCard'
import EmptyShares  from '@/src/features/(business)/shares/components/sections/shared/EmptyShares'

interface CoreProps {
  sh: ReturnType<typeof useShares>
}

function ActionSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border p-3.5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-accent animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 w-2/3 rounded bg-accent animate-pulse" />
          <div className="h-2.5 w-1/3 rounded bg-accent animate-pulse" />
        </div>
      </div>
      <div className="h-2.5 w-full rounded bg-accent animate-pulse" />
      <div className="h-2.5 w-3/4 rounded bg-accent animate-pulse" />
    </div>
  )
}

export default function Core({ sh }: CoreProps) {
  const {
    loading, acciones, accionesVisibles, busqueda,
    abrirDetalle, cambiarEstado, crearDesdeSugerencia,
  } = sh

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <ActionSkeleton key={i} />)}
      </div>
    )
  }

  if (accionesVisibles.length === 0) {
    return (
      <EmptyShares
        sinAcciones={acciones.length === 0}
        busqueda={busqueda}
        onCrear={crearDesdeSugerencia}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {accionesVisibles.map(accion => (
        <ActionsCard
          key={accion.id}
          accion={accion}
          onAbrir={abrirDetalle}
          onAlternar={cambiarEstado}
          onOpciones={() => {}}
        />
      ))}
    </div>
  )
}