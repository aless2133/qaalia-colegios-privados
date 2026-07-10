'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Edit2 } from 'iconsax-react'
import type { Producto } from '@/src/features/(business)/inventory/hooks/useInventory'

interface ProductCardProps {
  producto:   Producto
  onToggle:   (id: string, activo: boolean) => void
  onEditar:   (producto: Producto) => void
}

export default function ProductCard({ producto, onToggle, onEditar }: ProductCardProps) {
  return (
    <Card className="bg-card border border-border overflow-hidden group py-0 gap-0">
      <div className="relative aspect-square bg-accent">
        <img
          src={producto.foto_url}
          alt={producto.nombre}
          className="w-full h-full object-cover"
        />

        {!producto.activo && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge variant="outline" className="text-[11px] bg-background">Inactivo</Badge>
          </div>
        )}

        <button
          onClick={() => onEditar(producto)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 size={14} color="currentColor" className="text-foreground" />
        </button>
      </div>

      <CardContent className="p-3 flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-foreground truncate">{producto.nombre}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary">${producto.precio.toFixed(2)}</span>
          <Badge variant={producto.stock > 0 ? 'secondary' : 'outline'} className="text-[10px]">
            {producto.stock > 0 ? `${producto.stock} disp.` : 'Agotado'}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground truncate">{producto.categoria_nombre}</span>
          <Switch
            checked={producto.activo}
            onCheckedChange={(v) => onToggle(producto.id, v)}
            className="scale-75"
          />
        </div>
      </CardContent>
    </Card>
  )
}