'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchNormal1, AddSquare, CloseCircle } from 'iconsax-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeroProps {
  total:      number
  loading:    boolean
  busqueda:   string
  onBuscar:   (valor: string) => void
  onNuevo:    () => void
  isDesktop?: boolean
}

export default function Hero({ total, loading, busqueda, onBuscar, onNuevo, isDesktop = false }: HeroProps) {
  const [buscando, setBuscando] = useState(false)
  const label = total === 1 ? 'activa' : 'activas'

  const cerrarBusqueda = () => {
    setBuscando(false)
    onBuscar('')
  }

  return (
    <div className="flex items-center justify-between gap-3">
      {buscando && !isDesktop ? (
        <div className="relative flex-1">
          <SearchNormal1 size={16} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder="Buscar acción..."
            className="pl-9 pr-9 rounded-2xl bg-card"
          />
          <button
            onClick={cerrarBusqueda}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <CloseCircle size={16} color="currentColor" />
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight">Actividad</h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${total}`}
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
      )}

      <div className="flex items-center gap-2 flex-shrink-0">
        {isDesktop ? (
          <div className="relative w-64">
            <SearchNormal1 size={16} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => onBuscar(e.target.value)}
              placeholder="Buscar acción..."
              className="pl-9 rounded-2xl bg-card"
            />
          </div>
        ) : !buscando ? (
          <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => setBuscando(true)}>
            <SearchNormal1 size={18} color="currentColor" />
          </Button>
        ) : null}

        <Button size="icon" className="rounded-2xl" onClick={onNuevo}>
          <AddSquare size={18} color="currentColor" />
        </Button>
      </div>
    </div>
  )
}