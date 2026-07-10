'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { ProductoAgente } from '@/src/features/agent/hooks/useAgent'

interface Props {
  producto: ProductoAgente
}

export default function AgentCard({ producto }: Props) {
  return (
    <Card className="bg-card border border-border overflow-hidden py-0 gap-0 w-32 flex-shrink-0">
      <div className="aspect-square bg-accent">
        <img src={producto.foto_url} alt={producto.nombre} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-2 flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold text-foreground truncate">{producto.nombre}</p>
        <span className="text-xs font-bold text-primary">${producto.precio.toFixed(2)}</span>
      </CardContent>
    </Card>
  )
}