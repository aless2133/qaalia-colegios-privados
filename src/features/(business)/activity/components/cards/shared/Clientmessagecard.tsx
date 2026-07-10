'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Refresh, TickCircle, CloseCircle, MoreCircle, Call, Sms } from 'iconsax-react'
import type { Solicitud, EstadoActividad } from '@/src/features/(business)/activity/hooks/useActivity'

interface ClientMessageCardProps {
  solicitud: Solicitud
  onAbrir:   (solicitud: Solicitud) => void
  onOptions: (solicitud: Solicitud) => void
}

const ESTADO_META: Record<
  EstadoActividad,
  { label: string; icon: typeof Clock; variant: 'outline' | 'default' | 'secondary' | 'destructive' }
> = {
  pendiente:  { label: 'Pendiente',  icon: Clock,       variant: 'outline' },
  en_proceso: { label: 'En proceso', icon: Refresh,     variant: 'default' },
  completada: { label: 'Completada', icon: TickCircle,  variant: 'secondary' },
  rechazada:  { label: 'Rechazada',  icon: CloseCircle, variant: 'destructive' },
}

function iniciales(nombre: string) {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}

function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso)
  )
}

export default function ClientMessageCard({ solicitud, onAbrir, onOptions }: ClientMessageCardProps) {
  const meta = ESTADO_META[solicitud.estado]
  const EstadoIcon = meta.icon

  return (
    <Card
      onClick={() => onAbrir(solicitud)}
      className="bg-card border border-border overflow-hidden cursor-pointer hover:border-primary/40 transition-colors py-0 gap-0"
    >
      <CardContent className="p-3.5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-foreground">{iniciales(solicitud.cliente_nombre)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{solicitud.cliente_nombre}</p>
              <p className="text-[11px] text-muted-foreground truncate">{solicitud.accion}</p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onOptions(solicitud) }}
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent transition-colors"
          >
            <MoreCircle size={16} color="currentColor" className="text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{solicitud.resumen}</p>

        <div className="flex items-center justify-between pt-1">
          <Badge variant={meta.variant} className="text-[10px] gap-1">
            <EstadoIcon size={11} color="currentColor" />
            {meta.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{formatearFecha(solicitud.fecha)}</span>
        </div>

        {(solicitud.cliente_whatsapp || solicitud.cliente_correo) && (
          <div className="flex items-center gap-3 pt-1 border-t border-border/60 mt-0.5">
            {solicitud.cliente_whatsapp && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                <Call size={12} color="currentColor" /> {solicitud.cliente_whatsapp}
              </span>
            )}
            {solicitud.cliente_correo && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                <Sms size={12} color="currentColor" /> {solicitud.cliente_correo}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}