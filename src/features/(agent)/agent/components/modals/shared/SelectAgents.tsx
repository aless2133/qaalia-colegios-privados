'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, TickCircle } from 'iconsax-react'
import type { ConfigAgente } from '@/src/features/(agent)/agent/hooks/useAgent'

interface Props {
  mostrar:  boolean
  onCerrar: () => void
  agentes:  ConfigAgente[]
  activoId: string | null
  onSwitch: (agente: ConfigAgente) => void
  loading?: boolean
}

function SkeletonRow() {
  return <div className="h-[62px] rounded-2xl bg-accent animate-pulse" />
}

export default function SelectAgents({ mostrar, onCerrar, agentes, activoId, onSwitch, loading }: Props) {
  return (
    <AnimatePresence>
      {mostrar && (
        <>
          <div className="fixed inset-0 z-40" onClick={onCerrar} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative z-50 w-72 max-w-[90vw] rounded-2xl border border-border bg-popover shadow-lg p-1.5 flex flex-col gap-2"
          >
            {loading
              ? [...Array(2)].map((_, i) => <SkeletonRow key={i} />)
              : agentes.map(ag => {
                  const isActive = ag.id === activoId
                  return (
                    <button
                      key={ag.id}
                      onClick={() => { if (!isActive) { onSwitch(ag); onCerrar() } }}
                      disabled={isActive}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors w-full ${
                        isActive ? 'bg-primary/10 cursor-default' : 'hover:bg-primary/10 cursor-pointer'
                      }`}
                    >
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-primary/10">
                        {ag.foto_url ? (
                          <img src={ag.foto_url} alt={ag.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <Cpu size={16} color="currentColor" className="text-primary" variant="Linear" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{ag.nombre}</p>
                        {ag.descripcion && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{ag.descripcion}</p>
                        )}
                      </div>
                      {isActive && (
                        <TickCircle size={16} color="currentColor" className="text-primary flex-shrink-0" />
                      )}
                    </button>
                  )
                })
            }
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}