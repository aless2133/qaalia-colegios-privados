'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DocumentText, ArrowRight2 } from 'iconsax-react'
import { etiquetaMetodo } from '@/src/features/(agent)/activity/hooks/useActivity'
import type { Actividad } from '@/src/features/(agent)/activity/hooks/useActivity'

interface ProposalCardProps {
  actividad: Actividad
  onAbrir:   (actividad: Actividad) => void
}

export default function ProposalCard({ actividad, onAbrir }: ProposalCardProps) {
  const metodos = actividad.metodos_contacto

  return (
    <Card
      onClick={() => onAbrir(actividad)}
      className="bg-card border border-border overflow-hidden cursor-pointer hover:border-primary/40 transition-colors py-0 gap-0"
    >
      <CardContent className="p-3.5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DocumentText size={16} color="currentColor" className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{actividad.titulo}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {actividad.total_preguntas} {actividad.total_preguntas === 1 ? 'pregunta' : 'preguntas'}
              </p>
            </div>
          </div>

          <ArrowRight2 size={16} color="currentColor" className="text-muted-foreground flex-shrink-0 mt-1.5" />
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {actividad.descripcion || 'Sin descripción'}
        </p>

        {metodos.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/60 mt-0.5">
            {metodos.slice(0, 2).map(m => (
              <Badge key={m.id} variant="outline" className="text-[10px]">
                {etiquetaMetodo(m)}
              </Badge>
            ))}
            {metodos.length > 2 && (
              <Badge variant="outline" className="text-[10px]">
                +{metodos.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}