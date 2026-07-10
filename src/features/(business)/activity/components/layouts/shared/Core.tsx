'use client'

import type { useActivity } from '@/src/features/(business)/activity/hooks/useActivity'
import ActivityTabs      from '@/src/features/(business)/activity/components/sections/shared/Tabs'
import ClientMessageCard from '@/src/features/(business)/activity/components/cards/shared/Clientmessagecard'
import EmptyActivity     from '@/src/features/(business)/activity/components/sections/shared/EmptyActivity'

interface CoreProps {
  act: ReturnType<typeof useActivity>
}

function MessageSkeleton() {
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

export default function Core({ act }: CoreProps) {
  const {
    loading, estadoActivo, setEstadoActivo, contadores,
    solicitudesVisibles, abrirDetalle,
  } = act

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <MessageSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <ActivityTabs estadoActivo={estadoActivo} onSelect={setEstadoActivo} contadores={contadores} />

      {solicitudesVisibles.length === 0 ? (
        <EmptyActivity estado={estadoActivo} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {solicitudesVisibles.map(solicitud => (
            <ClientMessageCard
              key={solicitud.id}
              solicitud={solicitud}
              onAbrir={abrirDetalle}
              onOptions={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}