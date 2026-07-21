'use client'

import type { useActivity } from '@/src/features/(agent)/activity/hooks/useActivity'
import ProposalCard   from '@/src/features/(agent)/activity/components/cards/ProposalCard'
import EmptyActivity  from '@/src/features/(agent)/activity/components/sections/EmptyActivity'

interface CoreProps {
  ac: ReturnType<typeof useActivity>
}

function ActividadSkeleton() {
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

export default function Core({ ac }: CoreProps) {
  const { loading, actividades, actividadesVisibles, busqueda, abrirDetalle } = ac

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <ActividadSkeleton key={i} />)}
      </div>
    )
  }

  if (actividadesVisibles.length === 0) {
    return (
      <EmptyActivity
        sinActividades={actividades.length === 0}
        busqueda={busqueda}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {actividadesVisibles.map(actividad => (
        <ProposalCard
          key={actividad.id}
          actividad={actividad}
          onAbrir={abrirDetalle}
        />
      ))}
    </div>
  )
}