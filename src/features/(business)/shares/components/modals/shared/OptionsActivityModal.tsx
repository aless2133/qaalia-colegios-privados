'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Edit2, Trash, Edit } from 'iconsax-react'
import { useEffect, useState } from 'react'

interface OptionsActivityModalProps {
  mostrar:       boolean
  onCerrar:      () => void
  anchorRect:    DOMRect | null
  onVerDetalles: () => void
  onEditar:      () => void
  onEliminar:    () => void
}

const MENU_WIDTH = 208
const MARGIN     = 8
const EST_HEIGHT = 168

export default function OptionsActivityModal({
  mostrar, onCerrar, anchorRect, onVerDetalles, onEditar, onEliminar,
}: OptionsActivityModalProps) {
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; openUp: boolean } | null>(null)

  useEffect(() => {
    if (!mostrar || !anchorRect) return

    const spaceBelow = window.innerHeight - anchorRect.bottom
    const openUp = spaceBelow < EST_HEIGHT && anchorRect.top > EST_HEIGHT

    let left = anchorRect.right - MENU_WIDTH
    left = Math.min(Math.max(left, MARGIN), window.innerWidth - MENU_WIDTH - MARGIN)

    if (openUp) {
      setPos({ left, bottom: window.innerHeight - anchorRect.top + MARGIN, openUp: true })
    } else {
      setPos({ left, top: anchorRect.bottom + MARGIN, openUp: false })
    }
  }, [mostrar, anchorRect])

  return (
    <AnimatePresence>
      {mostrar && pos && (
        <>
          <div className="fixed inset-0 z-40" onClick={onCerrar} />
          <motion.div
            initial={{ opacity: 0, y: pos.openUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: pos.openUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ top: pos.top, bottom: pos.bottom, left: pos.left, transformOrigin: pos.openUp ? 'bottom right' : 'top right' }}
            className="fixed z-50 w-52 rounded-2xl border border-border bg-popover shadow-lg p-1.5 flex flex-col gap-1"
          >
            <button
              onClick={() => { onVerDetalles(); onCerrar() }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors w-full hover:bg-muted"
            >
              <Eye size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">Ver detalles</span>
            </button>

            <button
              onClick={() => { onEditar(); onCerrar() }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors w-full hover:bg-muted"
            >
              <Edit size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">Editar</span>
            </button>

            <button
              onClick={() => { onEliminar(); onCerrar() }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors w-full hover:bg-destructive/10"
            >
              <Trash size={16} color="currentColor" className="text-destructive flex-shrink-0" />
              <span className="text-sm font-semibold text-destructive">Eliminar</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}