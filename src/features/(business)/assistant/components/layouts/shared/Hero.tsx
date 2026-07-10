'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { EstadoAsistente } from '@/src/features/(business)/assistant/hooks/useAssistant'

interface HeroProps {
  estado:  EstadoAsistente | null
  loading: boolean
}

const LABELS: Record<EstadoAsistente, string> = {
  activo:  'Activo y respondiendo',
  pausado: 'Pausado',
}

export default function Hero({ estado, loading }: HeroProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight">Agente</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={estado ?? 'loading'}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-[13px] font-semibold text-muted-foreground"
          >
            {loading || !estado ? '' : LABELS[estado]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}