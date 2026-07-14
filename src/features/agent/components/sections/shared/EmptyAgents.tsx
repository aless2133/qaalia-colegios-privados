'use client'

import { Cpu } from 'iconsax-react'

interface Props {
  nombreAgente: string
  fotoAgente?: string | null
}

export default function EmptyAgents({ nombreAgente, fotoAgente }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-[40px] bg-accent flex items-center justify-center mb-4 overflow-hidden">
        {fotoAgente ? (
          <img src={fotoAgente} alt={nombreAgente} className="w-full h-full object-cover" />
        ) : (
          <Cpu size={28} color="currentColor" className="text-primary" />
        )}
      </div>
      <p className="text-sm font-semibold text-foreground">
        ¡Hola! Soy {nombreAgente}
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        Escríbeme o elige una acción abajo para empezar.
      </p>
    </div>
  )
}