'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TickCircle, PauseCircle, Copy, Setting4, Cpu } from 'iconsax-react'
import type { Asistente } from '@/src/features/(business)/assistant/hooks/useAssistant'
import Link from 'next/link'

interface AgentCardProps {
  asistente:      Asistente
  copiado:        boolean
  onCopiarEnlace: () => void
  onPersonalizar: () => void
}

export default function AgentCard({ asistente, copiado, onCopiarEnlace, onPersonalizar }: AgentCardProps) {
  const EstadoIcon = asistente.estado === 'activo' ? TickCircle : PauseCircle

  return (
    <Card className="bg-card border border-border overflow-hidden py-0 gap-0">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
         <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0 overflow-hidden">
            {asistente.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asistente.foto_url} alt={asistente.nombre} className="w-full h-full object-cover" />
            ) : (
              <Cpu size={28} color="currentColor" className="text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground truncate">{asistente.nombre}</p>
              <Badge variant={asistente.estado === 'activo' ? 'secondary' : 'outline'} className="text-[10px] gap-1">
                <EstadoIcon size={11} color="currentColor" />
                {asistente.estado === 'activo' ? 'Activo' : 'Pausado'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{asistente.descripcion}</p>
            <button
              onClick={onCopiarEnlace}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-primary max-w-full mt-0.5"
            >
              {copiado ? <TickCircle size={12} color="currentColor" className="flex-shrink-0" /> : <Copy size={12} color="currentColor" className="flex-shrink-0" />}
              <span className="max-[640px]:truncate max-[640px]:max-w-[200px]">
                {copiado ? 'Enlace copiado' : asistente.enlace}
              </span>
            </button>
          </div>
        </div>

        <Button asChild className="rounded-2xl font-bold gap-1.5 flex-shrink-0">
          <Link href="/settings">
          <Setting4 size={16} color="currentColor" />
          Personalizar
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}