'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Bag2, DocumentText, Calendar, MessageQuestion, TickCircle, CloseCircle } from 'iconsax-react'
import type { Accion, TipoAccion } from '@/src/features/(business)/shares/hooks/useShares'

interface DetailsActionCardProps {
  mostrar:         boolean
  onCerrar:        () => void
  accion:          Accion | null
  onCambiarEstado: (id: string, activa: boolean) => void
  procesando:      boolean
  error:           string | null
}

const TIPO_META: Record<TipoAccion, { label: string; icon: typeof Bag2 }> = {
  catalogo:      { label: 'Catálogo',      icon: Bag2 },
  formulario:    { label: 'Formulario',    icon: DocumentText },
  agenda:        { label: 'Agenda',        icon: Calendar },
  personalizada: { label: 'Personalizada', icon: MessageQuestion },
}

function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(iso)
  )
}

export default function DetailsActionCard({
  mostrar, onCerrar, accion, onCambiarEstado, procesando, error,
}: DetailsActionCardProps) {
  if (!accion) return null

  const tipoMeta = TIPO_META[accion.tipo]
  const TipoIcon = tipoMeta.icon
  const EstadoIcon = accion.activa ? TickCircle : CloseCircle

  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle>{accion.nombre}</DialogTitle>
            <Badge variant={accion.activa ? 'secondary' : 'outline'} className="text-[10px] gap-1">
              <EstadoIcon size={11} color="currentColor" />
              {accion.activa ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit text-[11px] gap-1">
              <TipoIcon size={12} color="currentColor" />
              {tipoMeta.label}
            </Badge>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">{accion.descripcion}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-accent/50 border border-border p-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Usos totales</span>
              <span className="text-sm font-bold text-foreground">{accion.usos}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Creada</span>
              <span className="text-sm font-bold text-foreground">{formatearFecha(accion.fecha_creacion)}</span>
            </div>
          </div>

          {accion.campos_solicitados.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-foreground">Datos que solicita al cliente</span>
              <div className="flex flex-wrap gap-1.5">
                {accion.campos_solicitados.map(campo => (
                  <Badge key={campo} variant="outline" className="text-[10px]">{campo}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-border p-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {accion.activa ? 'Visible en tu enlace único' : 'Oculta en tu enlace único'}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {accion.activa ? 'Los clientes pueden usarla ahora mismo.' : 'Los clientes no la verán hasta activarla.'}
              </span>
            </div>
            <Switch
              checked={accion.activa}
              disabled={procesando}
              onCheckedChange={(checked) => onCambiarEstado(accion.id, checked)}
            />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <Button variant="secondary" className="w-full rounded-2xl font-bold" onClick={onCerrar}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}