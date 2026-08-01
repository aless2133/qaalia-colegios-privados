'use client'

import type { Propuesta, useShares } from '@/src/features/(business)/shares/hooks/useShares'
import ActionsCard from '@/src/features/(business)/shares/components/cards/shared/ActionsCard'
import EmptyShares  from '@/src/features/(business)/shares/components/sections/shared/EmptyShares'
import { useState } from 'react'
import OptionsActivityModal from '@/src/features/(business)/shares/components/modals/shared/OptionsActivityModal'

interface CoreProps {
  sh: ReturnType<typeof useShares>
}

function PropuestaSkeleton() {
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
    loading, propuestas, propuestasVisibles, busqueda,
    abrirDetalle, cambiarEstado, abrirNuevo, eliminarPropuesta,
  } = sh

  const [menuAbierto, setMenuAbierto] = useState<{ propuesta: Propuesta; rect: DOMRect } | null>(null)

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <PropuestaSkeleton key={i} />)}
      </div>
    )
  }

  if (propuestasVisibles.length === 0) {
    return (
      <EmptyShares
        sinPropuestas={propuestas.length === 0}
        busqueda={busqueda}
        onCrear={abrirNuevo}
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {propuestasVisibles.map(propuesta => (
          <ActionsCard
            key={propuesta.id}
            propuesta={propuesta}
            onAbrir={abrirDetalle}
            onAlternar={cambiarEstado}
            onOpciones={(p, rect) => setMenuAbierto({ propuesta: p, rect })}
          />
        ))}
      </div>

      <OptionsActivityModal
        mostrar={!!menuAbierto}
        onCerrar={() => setMenuAbierto(null)}
        anchorRect={menuAbierto?.rect ?? null}
        onVerDetalles={() => menuAbierto && abrirDetalle(menuAbierto.propuesta)}
        onEditar={() => { /* pendiente: ver pregunta abajo */ }}
        onEliminar={() => menuAbierto && eliminarPropuesta(menuAbierto.propuesta.id)}
      />
    </>
  )
}