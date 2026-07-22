'use client'

import type { useAssistant } from '@/src/features/(business)/assistant/hooks/useAssistant'
import AgentCard from '@/src/features/(business)/assistant/components/cards/shared/AgentCard'
import Options   from '@/src/features/(business)/assistant/components/cards/shared/Options'
import Settings  from '@/src/features/(business)/assistant/components/cards/shared/Settings'
import EditPageAgent from '@/src/features/(business)/EditPage/EditPageAgent'

interface CoreProps {
  asis: ReturnType<typeof useAssistant>
}

function AgentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-accent animate-pulse flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-1/3 rounded bg-accent animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-accent animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-accent animate-pulse" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4 flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 rounded-xl bg-accent animate-pulse" />
      ))}
    </div>
  )
}

export default function Core({ asis }: CoreProps) {
  const {
    loading, asistente, opciones, ajustes,
    procesando, copiado,
    alternarOpcion, personalizar, abrirAjuste, copiarEnlace, editandoPagina, cerrarEditorPagina,
  } = asis

  if (loading || !asistente) {
    return (
      <div className="flex flex-col gap-4">
        <AgentCardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ListSkeleton />
          <ListSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <AgentCard
        asistente={asistente}
        copiado={copiado}
        onCopiarEnlace={copiarEnlace}
        onPersonalizar={personalizar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Options opciones={opciones} procesando={procesando} onAlternar={alternarOpcion} />
        <Settings ajustes={ajustes} onSeleccionar={abrirAjuste} />
      </div>
      {editandoPagina && <EditPageAgent onClose={cerrarEditorPagina} />}
    </div>
  )
}