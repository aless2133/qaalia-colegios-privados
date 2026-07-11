'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Home2, MessageAdd1, Send2, ProfileCircle, Shop, Send } from 'iconsax-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface NavbarProps {
  nombreNegocio: string
  loading?:      boolean
  onNuevoChat?:  () => void
  onEnviados?:   () => void
  onPerfil?:     () => void
}

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1]

export default function Navbar({ nombreNegocio, loading, onNuevoChat, onEnviados, onPerfil }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  const secciones = [
    { id: 'inicio',   label: 'Inicio',                                       icon: Home2,       activo: true,  onClick: undefined   },
    { id: 'nuevo',    label: 'Nuevo chat',                                   icon: MessageAdd1, activo: false, onClick: onNuevoChat },
    { id: 'enviados', label: 'Enviados',                                     icon: Send,       activo: false, onClick: onEnviados  },
    { id: 'perfil',   label: `Perfil de ${nombreNegocio || 'tu negocio'}`,    icon: Shop, activo: false, onClick: onPerfil  },
  ]

  const handleSeleccionar = (accion?: () => void) => {
    setOpen(false)
    accion?.()
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <motion.div
          animate={scrolled
            ? { marginLeft: 14, marginRight: 14, marginTop: 10, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.09)' }
            : { marginLeft: 0, marginRight: 0, marginTop: 0, borderRadius: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }
          }
          transition={{ duration: 0.35, ease: EASE }}
          className="bg-background/95 backdrop-blur-md border-t border-x border-border px-5 py-4 overflow-hidden"
        >
          <div className="relative flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(prev => !prev)}
              aria-label="Menú"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{    rotate:  90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="!h-5 !w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate:  90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{    rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="!h-5 !w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <div className="absolute inset-x-0 flex justify-center px-12 pointer-events-none">
              <h1 className="text-base font-black text-foreground leading-tight truncate">
                {loading ? '' : nombreNegocio}
              </h1>
            </div>

            {/* Spacer para mantener el nombre centrado respecto al botón izquierdo */}
            <div className="w-9 h-9" />
          </div>
        </motion.div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-4/5 sm:max-w-sm duration-300 flex flex-col p-0 [&>button]:hidden">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="text-lg font-black text-foreground truncate">
              {nombreNegocio || 'Menú'}
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 px-3 py-3">
            {secciones.map(({ id, label, icon: Icono, activo, onClick }) => (
              <button
                key={id}
                onClick={() => handleSeleccionar(onClick)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                  ${activo ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'}`}
              >
                <Icono size={20} color="currentColor" className={activo ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-sm font-semibold truncate">{label}</span>
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}