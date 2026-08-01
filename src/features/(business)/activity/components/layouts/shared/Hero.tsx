'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { EstadoActividad } from '@/src/features/(business)/activity/hooks/useActivity'

interface HeroProps {
  estado:  EstadoActividad
  total:   number
  loading: boolean
}

const LABELS: Record<EstadoActividad, { singular: string; plural: string }> = {
  pendiente:  { singular: 'pendiente',  plural: 'pendientes' },
  confirmada:  { singular: 'confirmada',  plural: 'confirmadas' },
  en_proceso: { singular: 'en proceso', plural: 'en proceso' },
  completada: { singular: 'completada', plural: 'completadas' },
  rechazada:  { singular: 'rechazada',  plural: 'rechazadas' },
}

export default function Hero({ estado, total, loading }: HeroProps) {
  const label = total === 1 ? LABELS[estado].singular : LABELS[estado].plural

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight">Actividad</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={`${estado}-${total}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-[13px] font-semibold text-muted-foreground"
          >
            {loading ? '' : `${total} ${label}`}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}