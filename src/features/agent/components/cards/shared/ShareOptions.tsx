'use client'

import { Bag2, Warning2, Calendar, DocumentText, MessageQuestion } from 'iconsax-react'
import type { AccionAgente } from '@/src/features/agent/hooks/useAgent'

interface Props {
  acciones:      AccionAgente[]
  onSeleccionar: (accion: AccionAgente) => void
  /** 'wrap' = varias filas centradas (estado sin mensajes). 'row' = una sola fila con scroll horizontal. */
  variant?:      'wrap' | 'row'
}

const ICONOS: Record<string, typeof Bag2> = {
  Bag2, Warning2, Calendar, DocumentText,
}

export default function SharesOption({ acciones, onSeleccionar, variant = 'wrap' }: Props) {
  if (acciones.length === 0) return null

  const contenedorClass = variant === 'wrap'
    ? 'flex flex-wrap justify-center gap-2'
    : 'flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1'

  return (
    <div className={contenedorClass}>
      {acciones.map(accion => {
        const Icono = ICONOS[accion.icono] ?? MessageQuestion
        return (
          <button
            key={accion.id}
            onClick={() => onSeleccionar(accion)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-accent/60 hover:bg-accent
                       px-3.5 py-2 text-left transition-colors flex-shrink-0"
          >
            <Icono size={14} color="currentColor" className="text-muted-foreground flex-shrink-0" />
            <span className="text-[11px] font-medium text-foreground truncate">{accion.nombre}</span>
          </button>
        )
      })}
    </div>
  )
}