'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bag2, DocumentText, Calendar, MessageQuestion, TickCircle, CloseCircle, MoreCircle } from 'iconsax-react'
import type { Accion, TipoAccion } from '@/src/features/(business)/shares/hooks/useShares'

interface ActionsCardProps {
  accion:     Accion
  onAbrir:    (accion: Accion) => void
  onAlternar: (id: string, activa: boolean) => void
  onOpciones: (accion: Accion) => void
}

const TIPO_META: Record<TipoAccion, { icon: typeof Bag2 }> = {
  catalogo:      { icon: Bag2 },
  formulario:    { icon: DocumentText },
  agenda:        { icon: Calendar },
  personalizada: { icon: MessageQuestion },
}

export default function ActionsCard({ accion, onAbrir, onAlternar, onOpciones }: ActionsCardProps) {
  const TipoIcon = TIPO_META[accion.tipo].icon
  const EstadoIcon = accion.activa ? TickCircle : CloseCircle

  return (
    <Card
      onClick={() => onAbrir(accion)}
      className="bg-card border border-border overflow-hidden cursor-pointer hover:border-primary/40 transition-colors py-0 gap-0"
    >
      <CardContent className="p-3.5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <TipoIcon size={16} color="currentColor" className="text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{accion.nombre}</p>
              <p className="text-[11px] text-muted-foreground truncate">{accion.usos} usos</p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onOpciones(accion) }}
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent transition-colors"
          >
            <MoreCircle size={16} color="currentColor" className="text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{accion.descripcion}</p>

        <div className="flex items-center justify-between pt-1 border-t border-border/60 mt-0.5">
          <Badge variant={accion.activa ? 'secondary' : 'outline'} className="text-[10px] gap-1">
            <EstadoIcon size={11} color="currentColor" />
            {accion.activa ? 'Activa' : 'Inactiva'}
          </Badge>

          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={accion.activa}
              onCheckedChange={(checked) => onAlternar(accion.id, checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}