'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DocumentText, Whatsapp, Sms, MessageQuestion } from 'iconsax-react'
import { etiquetaMetodo } from '@/src/features/(agent)/activity/hooks/useActivity'
import type { ActividadCompleta, MetodoContacto, TipoMetodoContacto } from '@/src/features/(agent)/activity/hooks/useActivity'
import type { NegocioAgente } from '@/src/features/(agent)/agent/hooks/useAgent'

interface DetailsProposalProps {
  mostrar:   boolean
  onCerrar:  () => void
  actividad: ActividadCompleta | null
  cargando:  boolean
  error:     string | null
  negocio:   NegocioAgente | null
}

const METODO_ICON: Record<TipoMetodoContacto, typeof Whatsapp> = {
  whatsapp_telefono: Whatsapp,
  correo:             Sms,
  otro:               MessageQuestion,
}

// El canal (whatsapp/correo) es genérico; el dato real (teléfono/correo)
// vive en el negocio, ya resuelto por useAgent — no se vuelve a pedir aquí.
function construirEnlace(tipo: TipoMetodoContacto, negocio: NegocioAgente | null, titulo: string) {
  if (!negocio) return null
  const mensaje = encodeURIComponent(`Hola ${negocio.nombre_dueno}, quiero solicitar: ${titulo}`)

  if (tipo === 'whatsapp_telefono' && negocio.telefono) {
    const telefono = negocio.telefono.replace(/\D/g, '')
    return `https://wa.me/${telefono}?text=${mensaje}`
  }
  if (tipo === 'correo' && negocio.correo) {
    return `mailto:${negocio.correo}?subject=${encodeURIComponent(titulo)}&body=${mensaje}`
  }
  return null
}

function MetodoAccion({ metodo, negocio, titulo }: { metodo: MetodoContacto; negocio: NegocioAgente | null; titulo: string }) {
  const Icon   = METODO_ICON[metodo.tipo]
  const enlace = construirEnlace(metodo.tipo, negocio, titulo)

  if (!enlace) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border p-3">
        <Icon size={16} color="currentColor" className="text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{etiquetaMetodo(metodo)}</span>
      </div>
    )
  }

  return (
    <Button asChild variant="outline" className="justify-start rounded-2xl font-bold gap-2">
      <a href={enlace} target="_blank" rel="noopener noreferrer">
        <Icon size={16} color="currentColor" />
        {etiquetaMetodo(metodo)}
      </a>
    </Button>
  )
}

export default function DetailsProposal({
  mostrar, onCerrar, actividad, cargando, error, negocio,
}: DetailsProposalProps) {
  if (!actividad) return null

  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{actividad.titulo}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit text-[11px] gap-1">
              <DocumentText size={12} color="currentColor" />
              Actividad
            </Badge>
            {actividad.descripcion && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">{actividad.descripcion}</p>
            )}
          </div>

          {cargando ? (
            <div className="flex flex-col gap-2">
              <div className="h-10 w-full rounded-xl bg-accent animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-accent animate-pulse" />
            </div>
          ) : actividad.preguntas.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-foreground">Datos que te pedirán</span>
              <div className="flex flex-col gap-2">
                {actividad.preguntas.map(p => (
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

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          {!cargando && actividad.metodos_contacto.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-foreground">Solicitar por</span>
              <div className="flex flex-col gap-2">
                {actividad.metodos_contacto.map(m => (
                  <MetodoAccion key={m.id} metodo={m} negocio={negocio} titulo={actividad.titulo} />
                ))}
              </div>
            </div>
          )}

          <Button variant="secondary" className="rounded-2xl font-bold" onClick={onCerrar}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}