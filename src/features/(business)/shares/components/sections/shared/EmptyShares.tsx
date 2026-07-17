'use client'

import MensajeAnimado from '@/src/features/components/cards/MessageAnimate'
import LottieNodata    from '@/src/features/components/animations/LottieAnimation'
import { Button } from '@/components/ui/button'
import { DocumentText, AddSquare } from 'iconsax-react'

interface Props {
  sinPropuestas: boolean
  busqueda:      string
  onCrear:       () => void
}

export default function EmptyShares({ sinPropuestas, busqueda, onCrear }: Props) {
  if (!sinPropuestas && busqueda) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="lg:-mt-28 -mt-23">
          <MensajeAnimado
            titulo="Sin resultados"
            descripcion={`No encontramos propuestas que coincidan con "${busqueda}".`}
            animacion={<LottieNodata variant="search" />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center gap-4 py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
        <DocumentText size={24} color="currentColor" className="text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <h2 className="text-base font-bold text-foreground">Aún no tienes propuestas</h2>
        <p className="text-[13px] text-muted-foreground max-w-sm">
          Las propuestas son formularios que tus clientes llenan desde tu enlace único para pedirte un proyecto o servicio.
        </p>
      </div>

      <Button className="rounded-2xl font-bold gap-2" onClick={onCrear}>
        <AddSquare size={18} color="currentColor" />
        Crear tu primera propuesta
      </Button>
    </div>
  )
}