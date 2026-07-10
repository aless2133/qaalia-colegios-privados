'use client'

import MensajeAnimado from '@/src/features/components/cards/MessageAnimate'
import LottieNodata    from '@/src/features/components/animations/LottieAnimation'
import SuggeresCard    from '@/src/features/(business)/shares/components/cards/shared/SuggeresCard'
import type { TipoAccion } from '@/src/features/(business)/shares/hooks/useShares'

interface Props {
  sinAcciones: boolean
  busqueda:    string
  onCrear:     (nombre: string) => void
}

const SUGERENCIAS: { nombre: string; tipo: TipoAccion }[] = [
  { nombre: 'Cotizar producto',            tipo: 'catalogo' },
  { nombre: 'Solicitar proyecto a medida', tipo: 'formulario' },
  { nombre: 'Reportar problema',           tipo: 'formulario' },
  { nombre: 'Agendar reunión',             tipo: 'agenda' },
]

export default function EmptyShares({ sinAcciones, busqueda, onCrear }: Props) {
  if (!sinAcciones && busqueda) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="lg:-mt-28 -mt-23">
          <MensajeAnimado
            titulo="Sin resultados"
            descripcion={`No encontramos acciones que coincidan con "${busqueda}".`}
            animacion={<LottieNodata variant="search" />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col items-center text-center gap-1.5 px-6">
        <h2 className="text-base font-bold text-foreground">Aún no tienes acciones</h2>
        <p className="text-[13px] text-muted-foreground max-w-sm">
          Las acciones son lo que tus clientes pueden hacer dentro de tu enlace único. Empieza con una de estas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {SUGERENCIAS.map(s => (
          <SuggeresCard key={s.nombre} nombre={s.nombre} tipo={s.tipo} onCrear={onCrear} />
        ))}
      </div>
    </div>
  )
}