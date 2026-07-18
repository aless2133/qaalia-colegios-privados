'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { DocumentText, TickCircle, CloseCircle, MoreCircle } from 'iconsax-react'
import { etiquetaMetodo } from '@/src/features/(business)/shares/hooks/useShares'
import type { Propuesta } from '@/src/features/(business)/shares/hooks/useShares'

interface ActionsCardProps {
  propuesta:  Propuesta
  onAbrir:    (propuesta: Propuesta) => void
  onAlternar: (id: string, activa: boolean) => void
  onOpciones: (propuesta: Propuesta) => void
}

export default function ActionsCard({ propuesta, onAbrir, onAlternar, onOpciones }: ActionsCardProps) {
  const EstadoIcon = propuesta.activo ? TickCircle : CloseCircle
  const metodosActivos = propuesta.metodos_contacto.filter(m => m.activo)

  return (
    <Card
      onClick={() => onAbrir(propuesta)}
      className="bg-card border border-border overflow-hidden cursor-pointer hover:border-primary/40 transition-colors py-0 gap-0"
    >
      <CardContent className="p-3.5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <DocumentText size={16} color="currentColor" className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{propuesta.titulo}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {propuesta.total_preguntas} {propuesta.total_preguntas === 1 ? 'pregunta' : 'preguntas'}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onOpciones(propuesta) }}
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent transition-colors"
          >
            <MoreCircle size={16} color="currentColor" className="text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {propuesta.descripcion || 'Sin descripción'}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-border/60 mt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={propuesta.activo ? 'secondary' : 'outline'} className="text-[10px] gap-1">
              <EstadoIcon size={11} color="currentColor" />
              {propuesta.activo ? 'Activa' : 'Inactiva'}
            </Badge>
            {metodosActivos.slice(0, 2).map(m => (
              <Badge key={m.id} variant="outline" className="text-[10px]">
                {etiquetaMetodo(m)}
              </Badge>
            ))}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={propuesta.activo}
              onCheckedChange={(checked) => onAlternar(propuesta.id, checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}