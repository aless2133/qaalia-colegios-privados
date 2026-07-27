'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TickCircle, AddCircle, Trash, Cpu } from 'iconsax-react'
import { useAgentBusiness } from '@/src/features/(business)/assistant/hooks/useAgentBusiness'

interface SelectAgentProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
}

export default function SelectAgent({ open, onOpenChange }: SelectAgentProps) {
  const { agentes, agenteId, isLoading, seleccionar, crearAgente, eliminarAgente } = useAgentBusiness()
  const [creando, setCreando] = useState(false)
  const [porEliminar, setPorEliminar] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const handleSeleccionar = (id: string) => {
    seleccionar(id)
    onOpenChange(false)
  }

  const handleCrear = async () => {
    setCreando(true)
    try {
      await crearAgente('Nuevo agente')
      onOpenChange(false)
    } finally {
      setCreando(false)
    }
  }

  const confirmarEliminar = async () => {
    if (!porEliminar) return
    setEliminando(true)
    try {
      await eliminarAgente(porEliminar)
    } finally {
      setEliminando(false)
      setPorEliminar(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Tus agentes</DialogTitle>
            <DialogDescription>Selecciona el agente que quieres gestionar.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col gap-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-accent animate-pulse" />
                ))}
              </div>
            )}

            {!isLoading && agentes.map(a => (
              <div
                key={a.id}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors"
              >
                <button
                  onClick={() => handleSeleccionar(a.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left py-1"
                >
                  <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {a.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.foto_url} alt={a.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <Cpu size={16} color="currentColor" className="text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{a.nombre}</p>
                    {!a.activo && (
                      <Badge variant="outline" className="text-[10px] mt-0.5">Desactivado</Badge>
                    )}
                  </div>
                  {a.id === agenteId && (
                    <TickCircle size={16} color="currentColor" className="text-primary flex-shrink-0" />
                  )}
                </button>

                {!a.es_predeterminado && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPorEliminar(a.id)}
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={15} color="currentColor" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleCrear} disabled={creando} variant="outline" className="w-full gap-2 font-semibold">
            <AddCircle size={18} color="currentColor" />
            {creando ? 'Creando...' : 'Crear agente'}
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!porEliminar} onOpenChange={(o) => !o && setPorEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar a este agente?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará toda su configuración: personalidad, reglas, información y acciones asignadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEliminar}
              disabled={eliminando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {eliminando ? 'Eliminando...' : 'Aceptar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}