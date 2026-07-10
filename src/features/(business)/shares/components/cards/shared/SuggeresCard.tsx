'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Bag2, DocumentText, Calendar, MessageQuestion, AddCircle } from 'iconsax-react'
import type { TipoAccion } from '@/src/features/(business)/shares/hooks/useShares'

interface SuggeresCardProps {
  nombre:  string
  tipo:    TipoAccion
  onCrear: (nombre: string) => void
}

const TIPO_META: Record<TipoAccion, { icon: typeof Bag2 }> = {
  catalogo:      { icon: Bag2 },
  formulario:    { icon: DocumentText },
  agenda:        { icon: Calendar },
  personalizada: { icon: MessageQuestion },
}

export default function SuggeresCard({ nombre, tipo, onCrear }: SuggeresCardProps) {
  const TipoIcon = TIPO_META[tipo].icon

  return (
    <Card
      onClick={() => onCrear(nombre)}
      className="bg-card border border-dashed border-border overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors py-0 gap-0"
    >
      <CardContent className="p-3.5 flex flex-col items-center text-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
          <TipoIcon size={16} color="currentColor" className="text-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">{nombre}</p>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
          <AddCircle size={13} color="currentColor" />
          Agregar
        </div>
      </CardContent>
    </Card>
  )
}