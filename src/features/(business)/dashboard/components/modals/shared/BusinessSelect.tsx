'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Shop, TickCircle, Crown1, Star1, AddCircle } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/badge'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

interface Props {
  mostrar:           boolean
  onCerrar:          () => void
  negocios:          NegocioData[]
  activoId:          string
  onSwitch:          (negocio: NegocioData) => void
  puedeCrearMas:     boolean
  negociosRestantes: number
  loading:           boolean
}

function PlanPill({ plan, isActive }: { plan: string; isActive?: boolean }) {
  return (
    <Badge
      variant={isActive ? 'default' : plan !== 'free' ? 'secondary' : 'outline'}
      className="gap-1 text-[10px] font-bold px-2 py-0.5"
    >
      {plan === 'multi' && <Crown1 size={9} color="currentColor" variant="Bold" />}
      {plan === 'pro'   && <Star1  size={9} color="currentColor" variant="Bold" />}
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </Badge>
  )
}

function SkeletonRow() {
  return <div className="h-[62px] rounded-2xl bg-accent animate-pulse" />
}

export default function BusinessSelect({
  mostrar, onCerrar, negocios, activoId, onSwitch,
  puedeCrearMas, negociosRestantes, loading,
}: Props) {
  const router = useRouter()

  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mis negocios</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {/* Slot progress bar */}
          {!loading && (
            <div className="flex gap-1.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className={`h-1 flex-1 rounded-full origin-left ${
                    i < negocios.length ? 'bg-primary' : 'bg-accent'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Lista de negocios */}
          <div className="flex flex-col gap-2">
            {loading
              ? [...Array(2)].map((_, i) => <SkeletonRow key={i} />)
              : (
                <AnimatePresence>
                  {negocios.map((neg, i) => {
                    const isActive = neg.id === activoId
                    return (
                      <motion.button
                        key={neg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={!isActive ? { scale: 0.98 } : undefined}
                        onClick={() => { if (!isActive) { onSwitch(neg); onCerrar() } }}
                        disabled={isActive}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all w-full border ${
                          isActive
                            ? 'bg-accent border-primary/40 cursor-default'
                            : 'bg-card border-border hover:border-primary/30 cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ${
                            isActive ? 'bg-primary/15' : 'bg-accent'
                          }`}
                        >
                          {neg.foto_url ? (
                            <img src={neg.foto_url} alt={neg.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <Shop size={16} color="currentColor" className="text-primary" variant="Linear" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{neg.nombre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <PlanPill plan={neg.plan} isActive={isActive} />
                          </div>
                        </div>
                        {isActive && (
                          <TickCircle size={16} color="currentColor" className="text-primary flex-shrink-0" />
                        )}
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
              )
            }
          </div>

          {/* Footer */}
          {!loading && (
            <>
              {puedeCrearMas && (
                <Button
                  variant="outline"
                  onClick={() => { onCerrar(); router.push('/register?nuevo=true') }}
                  className="w-full rounded-2xl font-bold gap-1.5"
                >
                  <AddCircle size={18} color="currentColor" variant="Linear" />
                  Nuevo negocio
                </Button>
              )}
              <p className="text-xs font-semibold text-center text-muted-foreground pt-1">
                {puedeCrearMas
                  ? `Puedes añadir ${negociosRestantes} negocio${negociosRestantes !== 1 ? 's' : ''} más`
                  : 'Has alcanzado el límite de 5 negocios'}
              </p>
            </>
          )}

          <Button variant="secondary" onClick={onCerrar} className="w-full rounded-2xl font-bold mt-1">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}