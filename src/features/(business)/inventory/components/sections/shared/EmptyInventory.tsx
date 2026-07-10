'use client'

import MensajeAnimado from '@/src/features/components/cards/MessageAnimate'
import LottieNodata    from '@/src/features/components/animations/LottieAnimation'

interface Props {
  onCrear: () => void
}

export default function EmptyInventory({ onCrear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="lg:-mt-28 -mt-23">
        <MensajeAnimado
          titulo="Crea tu primera categoría..."
          descripcion="Para empezar a organizar los productos de tu inventario"
          animacion={<LottieNodata variant="search" />}
        />
      </div>
    </div>
  )
}