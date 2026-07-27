'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { TickCircle, TaskSquare } from 'iconsax-react'
import { createClient } from '@/src/lib/supabase/client'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import { useAgentSettings } from '@/src/features/(business)/AgentSettings/hooks/useAgentSettings'

interface SelectActionsProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  asignadas:    any[]
}

export default function SelectActions({ open, onOpenChange, asignadas }: SelectActionsProps) {
  const supabase = createClient()
  const negocio = useBusiness()
  const { asignarAccion, quitarAccion } = useAgentSettings()

  const [acciones, setAcciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState<string | null>(null)

  const asignadasIds = useMemo(() => new Set(asignadas.map(a => a.accion_id)), [asignadas])

  useEffect(() => {
    if (!open || !negocio?.id) return
    setLoading(true)
    supabase
      .from('acciones')
      .select('id, tipo, nombre, texto_boton, activo')
      .eq('negocio_id', negocio.id)
      .order('orden')
      .then(({ data }) => {
        setAcciones(data ?? [])
        setLoading(false)
      })
  }, [open, negocio?.id])

  const handleToggle = async (accionId: string, estaAsignada: boolean) => {
    setProcesando(accionId)
    try {
      if (estaAsignada) {
        await quitarAccion(accionId)
      } else {
        await asignarAccion(accionId)
      }
    } finally {
      setProcesando(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Asignar acciones</DialogTitle>
          <DialogDescription>Elige qué acciones puede mostrarle este agente al cliente.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-accent animate-pulse" />
              ))}
            </div>
          )}

          {!loading && acciones.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Aún no has creado ninguna acción para este negocio.
            </p>
          )}

          {!loading && acciones.map(a => {
            const estaAsignada = asignadasIds.has(a.id)
            return (
              <button
                key={a.id}
                onClick={() => handleToggle(a.id, estaAsignada)}
                disabled={procesando === a.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors text-left disabled:opacity-50"
              >
                <TaskSquare size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{a.nombre}</p>
                  {!a.activo && <Badge variant="outline" className="text-[10px] mt-0.5">Inactiva</Badge>}
                </div>
                {estaAsignada && (
                  <TickCircle size={16} color="currentColor" className="text-primary flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}