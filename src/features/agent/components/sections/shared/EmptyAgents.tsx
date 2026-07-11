'use client'

import { Cpu } from 'iconsax-react'

interface Props {
  nombreAgente: string
}

export default function EmptyAgents({ nombreAgente }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-[40px] bg-accent flex items-center justify-center mb-4">
        <Cpu size={28} color="currentColor" className="text-primary" />
      </div>
      <p className="text-sm font-semibold text-foreground">
        ¡Hola! Soy Alex
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        Escríbeme o elige una acción abajo para empezar.
      </p>
    </div>
  )
}