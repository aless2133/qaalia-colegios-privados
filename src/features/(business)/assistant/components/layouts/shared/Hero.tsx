'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown2 } from 'iconsax-react'
import { useAgentBusiness } from '@/src/features/(business)/assistant/hooks/useAgentBusiness'
import SelectAgent from '@/src/features/(business)/assistant/components/modals/shared/SelectAgent'

export default function Hero() {
  const { agenteActivo, isLoading } = useAgentBusiness()
  const [open, setOpen] = useState(false)

  const estado = agenteActivo ? (agenteActivo.activo ? 'activo' : 'pausado') : null
  const label  = estado === 'activo' ? 'Activo y respondiendo' : estado === 'pausado' ? 'Pausado' : ''

  return (
    <div className="flex items-center justify-between">
      <div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 active:opacity-70 transition-opacity"
        >
          <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight truncate max-w-[220px] sm:max-w-xs">
            {isLoading || !agenteActivo ? 'Agente' : agenteActivo.nombre}
          </h1>
          <ArrowDown2 size={18} color="currentColor" className="text-primary flex-shrink-0" />
        </button>

        <AnimatePresence mode="wait">
          <motion.p
            key={estado ?? 'loading'}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-[13px] font-semibold text-muted-foreground"
          >
            {isLoading || !estado ? '' : label}
          </motion.p>
        </AnimatePresence>
      </div>

      <SelectAgent open={open} onOpenChange={setOpen} />
    </div>
  )
}