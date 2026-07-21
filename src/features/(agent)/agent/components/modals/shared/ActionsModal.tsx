'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Bag2, Warning2, Calendar, DocumentText, MessageQuestion } from 'iconsax-react'
import { Button } from '@/components/ui/button'
import type { AccionAgente } from '@/src/features/(agent)/agent/hooks/useAgent'

interface Props {
  mostrar:       boolean
  onCerrar:      () => void
  acciones:      AccionAgente[]
  onSeleccionar: (accion: AccionAgente) => void
}

const ICONOS: Record<string, typeof Bag2> = {
  Bag2, Warning2, Calendar, DocumentText,
}

export default function ActionsModal({ mostrar, onCerrar, acciones, onSeleccionar }: Props) {
  const handleSeleccionar = (accion: AccionAgente) => {
    onSeleccionar(accion)
    onCerrar()
  }

  return (
    <AnimatePresence>
      {mostrar && (
        <>
          <div className="fixed inset-0 z-40" onClick={onCerrar} />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-2xl border border-border bg-card p-3 shadow-lg"
          >
            <p className="text-sm font-bold text-foreground px-1 pb-2">Acciones</p>

            <div className="flex flex-col gap-1">
              {acciones.map((accion, i) => {
                const Icono = ICONOS[accion.icono] ?? MessageQuestion
                return (
                  <motion.button
                    key={accion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSeleccionar(accion)}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-colors w-full hover:bg-accent"
                  >
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 bg-accent">
                      <Icono size={16} color="currentColor" className="text-primary" variant="Linear" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{accion.nombre}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <Button variant="secondary" onClick={onCerrar} className="w-full rounded-2xl font-bold mt-2">
              Cerrar
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}