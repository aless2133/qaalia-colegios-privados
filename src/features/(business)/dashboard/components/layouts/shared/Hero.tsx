'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowDown2, Add, TickCircle, AddCircle } from 'iconsax-react'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

interface HeroProps {
  negocio:      NegocioData | null
  negocios:     NegocioData[]
  onSwitch:     (negocio: NegocioData) => void
  onNuevoTrabajo?: () => void
}

export default function Hero({ negocio, negocios, onSwitch, onNuevoTrabajo }: HeroProps) {
  const [open, setOpen] = useState(false)

  const primerNombre = negocio?.nombre_dueno?.split(' ')[0] ?? null

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <div className="flex flex-col gap-3 min-w-0">
        {/* Selector de negocio */}
        <div className="relative w-fit">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 active:opacity-70 transition-opacity"
          >
            <span className="text-xl sm:text-2xl font-black text-foreground leading-tight truncate max-w-[220px] sm:max-w-xs">
              {negocio?.nombre ?? '—'}
            </span>
            <ArrowDown2
              size={18}
              color="currentColor"
              className={`text-primary flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">
            {negocio?.tipo_negocio ?? ''}
          </p>

          <AnimatePresence>
            {open && negocios.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl border border-border bg-popover shadow-lg p-1.5"
                >
                  {negocios.map(n => (
                    <button
                      key={n.id}
                      onClick={() => { onSwitch(n); setOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left hover:bg-accent transition-colors"
                    >
                      <span className="flex-1 min-w-0 truncate text-sm font-medium text-foreground">
                        {n.nombre}
                      </span>
                      {n.id === negocio?.id && (
                        <TickCircle size={16} color="currentColor" className="text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Saludo */}
        <p className="text-sm text-muted-foreground">
          {primerNombre ? `Hola, ${primerNombre}. ` : ''}
          Así va tu operación hoy.
        </p>
      </div>

      <Button
        size="lg"
        onClick={onNuevoTrabajo}
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 gap-2 w-fit"
      >
        <AddCircle size={18} color="currentColor" />
        Nuevo trabajo
      </Button>
    </div>
  )
}