'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AddSquare } from 'iconsax-react'

interface HeroProps {
  total:           number
  loading:         boolean
  onNuevoProducto: () => void
}

export default function Hero({ total, loading, onNuevoProducto }: HeroProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight">Inventario</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={total}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-[13px] font-semibold text-muted-foreground"
          >
            {loading ? '' : `${total} ${total !== 1 ? 'productos' : 'producto'}`}
          </motion.p>
        </AnimatePresence>
      </div>

      <Button
        size="icon"
        onClick={onNuevoProducto}
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10 lg:w-auto lg:h-auto lg:px-5 lg:py-2.5 lg:gap-2"
      >
        <AddSquare size={18} color="currentColor" />
        <span className="hidden lg:inline font-semibold">Nuevo producto</span>
      </Button>
    </div>
  )
}