'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Refresh, TickCircle, CloseCircle, Call, Sms } from 'iconsax-react'
import type { Solicitud, EstadoActividad } from '@/src/features/(business)/activity/hooks/useActivity'

interface DetailsClientMessageProps {
  mostrar:         boolean
  onCerrar:        () => void
  solicitud:       Solicitud | null
  onCambiarEstado: (id: string, estado: EstadoActividad) => void
  procesando:      boolean
  error:           string | null
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

function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso)
  )
}

export default function DetailsClientMessage({
  mostrar, onCerrar, solicitud, onCambiarEstado, procesando, error,
}: DetailsClientMessageProps) {
  if (!solicitud) return null

  const meta = ESTADO_META[solicitud.estado]
  const EstadoIcon = meta.icon

  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle>{solicitud.cliente_nombre}</DialogTitle>
            <Badge variant={meta.variant} className="text-[10px] gap-1">
              <EstadoIcon size={11} color="currentColor" />
              {meta.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit text-[11px]">{solicitud.accion}</Badge>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {solicitud.cliente_whatsapp && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Call size={13} color="currentColor" /> {solicitud.cliente_whatsapp}
                </span>
              )}
              {solicitud.cliente_correo && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sms size={13} color="currentColor" /> {solicitud.cliente_correo}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{formatearFecha(solicitud.fecha)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-accent/50 border border-border p-3 max-h-72 overflow-y-auto">
            {solicitud.conversacion.map(m => (
              <div key={m.id} className={`flex ${m.rol === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.rol === 'cliente'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                  }`}
                >
                  {m.texto}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex gap-2 pt-1">
            {solicitud.estado === 'pendiente' && (
              <>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-2xl font-bold"
                  disabled={procesando}
                  onClick={() => onCambiarEstado(solicitud.id, 'rechazada')}
                >
                  Rechazar
                </Button>
                <Button
                  className="flex-1 rounded-2xl font-bold"
                  disabled={procesando}
                  onClick={() => onCambiarEstado(solicitud.id, 'en_proceso')}
                >
                  {procesando ? 'Actualizando...' : 'Poner en proceso'}
                </Button>
              </>
            )}

            {solicitud.estado === 'en_proceso' && (
              <>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-2xl font-bold"
                  disabled={procesando}
                  onClick={() => onCambiarEstado(solicitud.id, 'rechazada')}
                >
                  Rechazar
                </Button>
                <Button
                  className="flex-1 rounded-2xl font-bold"
                  disabled={procesando}
                  onClick={() => onCambiarEstado(solicitud.id, 'completada')}
                >
                  {procesando ? 'Actualizando...' : 'Marcar completada'}
                </Button>
              </>
            )}

            {(solicitud.estado === 'completada' || solicitud.estado === 'rechazada') && (
              <Button variant="secondary" className="flex-1 rounded-2xl font-bold" onClick={onCerrar}>
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}