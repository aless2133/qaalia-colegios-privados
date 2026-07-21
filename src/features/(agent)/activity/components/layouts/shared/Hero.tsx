'use client'

import { SearchNormal1 } from 'iconsax-react'
import { Input } from '@/components/ui/input'

interface HeroProps {
  total:    number
  loading:  boolean
  busqueda: string
  onBuscar: (valor: string) => void
}

export default function Hero({ total, loading, busqueda, onBuscar }: HeroProps) {
  const label = total === 1 ? 'activa' : 'activas'

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight">Actividades</h1>
        <p className="text-[13px] font-semibold text-muted-foreground">
          {loading ? '' : `${total} ${label}`}
        </p>
      </div>

      <div className="relative">
        <SearchNormal1
          size={16}
          color="currentColor"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
          placeholder="Buscar actividad..."
          className="pl-9 rounded-2xl bg-card"
        />
      </div>
    </div>
  )
}