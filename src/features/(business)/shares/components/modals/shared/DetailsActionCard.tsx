'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DocumentText, TickCircle, CloseCircle, Trash } from 'iconsax-react'
import { etiquetaMetodo } from '@/src/features/(business)/shares/hooks/useShares'
import type { PropuestaCompleta } from '@/src/features/(business)/shares/hooks/useShares'

interface DetailsActionCardProps {
  mostrar:         boolean
  onCerrar:        () => void
  propuesta:       PropuestaCompleta | null
  cargando:        boolean
  onCambiarEstado: (id: string, activa: boolean) => void
  onEliminar:      (id: string) => void
  procesando:      boolean
  error:           string | null
}

function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(iso)
  )
}

export default function DetailsActionCard({
  mostrar, onCerrar, propuesta, cargando, onCambiarEstado, onEliminar, procesando, error,
}: DetailsActionCardProps) {
  if (!propuesta) return null

  const EstadoIcon = propuesta.activo ? TickCircle : CloseCircle

  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle>{propuesta.titulo}</DialogTitle>
            <Badge variant={propuesta.activo ? 'secondary' : 'outline'} className="text-[10px] gap-1">
              <EstadoIcon size={11} color="currentColor" />
              {propuesta.activo ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit text-[11px] gap-1">
              <DocumentText size={12} color="currentColor" />
              Propuesta
            </Badge>
            {propuesta.descripcion && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">{propuesta.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-accent/50 border border-border p-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Preguntas</span>
              <span className="text-sm font-bold text-foreground">{propuesta.total_preguntas}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Creada</span>
              <span className="text-sm font-bold text-foreground">{formatearFecha(propuesta.fecha_creacion)}</span>
            </div>
          </div>

          {propuesta.metodos_contacto.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-foreground">Cómo contactan al cliente</span>
              <div className="flex flex-wrap gap-1.5">
                {propuesta.metodos_contacto.map(m => (
                  <Badge key={m.id} variant={m.activo ? 'outline' : 'secondary'} className="text-[10px]">
                    {etiquetaMetodo(m)}{!m.activo && ' (inactivo)'}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {cargando ? (
            <div className="flex flex-col gap-2">
              <div className="h-10 w-full rounded-xl bg-accent animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-accent animate-pulse" />
            </div>
          ) : propuesta.preguntas.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-foreground">Preguntas al cliente</span>
              <div className="flex flex-col gap-2">
                {propuesta.preguntas.map(p => (
                  <div key={p.id} className="rounded-xl border border-border p-2.5">
                    <p className="text-xs font-semibold text-foreground">{p.titulo}</p>
                    {p.descripcion && <p className="text-[11px] text-muted-foreground mt-0.5">{p.descripcion}</p>}
                    {p.tipo === 'cerrada' && p.opciones.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.opciones.map(o => (
                          <Badge key={o.id} variant="outline" className="text-[10px]">{o.texto}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-border p-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {propuesta.activo ? 'Visible en tu enlace único' : 'Oculta en tu enlace único'}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {propuesta.activo ? 'Los clientes pueden usarla ahora mismo.' : 'Los clientes no la verán hasta activarla.'}
              </span>
            </div>
            <Switch
              checked={propuesta.activo}
              disabled={procesando}
              onCheckedChange={(checked) => onCambiarEstado(propuesta.id, checked)}
            />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-2xl font-bold text-destructive hover:text-destructive"
              onClick={() => onEliminar(propuesta.id)}
              disabled={procesando}
            >
              <Trash size={16} color="currentColor" />
            </Button>
            <Button variant="secondary" className="flex-1 rounded-2xl font-bold" onClick={onCerrar}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}