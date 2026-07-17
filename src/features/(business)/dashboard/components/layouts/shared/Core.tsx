'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Messages2, DocumentText, TickCircle, TaskSquare, Link1, Copy, Icon } from 'iconsax-react'
import DashboardCard, { type DashboardCardTrend } from '@/src/features/(business)/dashboard/components/cards/shared/DashboardCard'
import Suggeres    from '@/src/features/(business)/dashboard/components/cards/shared/Suggeres'
import type { NegocioData } from '@/src/lib/auth/UseLogic'
import PlanCard from '@/src/features/(business)/dashboard/components/cards/shared/PlanCard'
import { useState, useMemo } from 'react'
interface CoreProps {
  negocio: NegocioData | null
}

interface Stat {
  icon:    Icon
  label:   string
  value:   string
  helper?: string
  trend?:  DashboardCardTrend
}

// TODO: reemplazar por el endpoint real de métricas del agente/negocio.
const STATS: Stat[] = [
  { icon: Messages2,    label: 'Conversaciones activas', value: '12',  helper: 'Últimas registradas' },
  { icon: DocumentText, label: 'Solicitudes pendientes',  value: '5',   helper: 'Esperando tu respuesta' },
  { icon: TickCircle,   label: 'Completados',             value: '340', trend: { value: '+18%', positive: true } },
  { icon: TaskSquare,   label: 'Acciones configuradas',   value: '4',   helper: 'Disponibles para tus clientes' },
]

export default function Core({ negocio }: CoreProps) {
  const [copiado, setCopiado] = useState(false)
  const enlace = useMemo(() => {
    if (!negocio?.slug) return null
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${negocio.slug}`
  }, [negocio?.slug])

  const enlaceCorto = useMemo(() =>
    enlace ? enlace.replace(/^https?:\/\//, '') : 'Sin enlace configurado'
  , [enlace])

  const copiarEnlace = async () => {
    if (!enlace) return
    await navigator.clipboard.writeText(enlace)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2200)
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <DashboardCard
            key={s.label}
            icon={s.icon}
            label={s.label}
            value={s.value}
            helper={'helper' in s ? s.helper : undefined}
            trend={'trend' in s ? s.trend : undefined}
          />
        ))}
      </div>

      <Separator />

      {/* Enlace + sugerencias + plan */}
     <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
       <div className="lg:col-start-4 lg:col-span-2 lg:row-start-1">
          <Card className="bg-card border border-border">
            <CardHeader className="pb-0">
              <h3 className="text-sm font-semibold text-foreground">Enlace del negocio</h3>
              <p className="text-xs text-muted-foreground">
                Comparte tu enlace, puedes cambiarlo cuando quieras.
              </p>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-muted min-w-0">
                <Link1 size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
                <p className="text-xs font-semibold text-foreground truncate">
                  {enlaceCorto}
                </p>
              </div>
              <Button
                size="icon"
                variant={copiado ? 'default' : 'outline'}
                onClick={copiarEnlace}
                disabled={!enlace}
                className="rounded-full flex-shrink-0 h-9 w-9"
              >
                {copiado
                  ? <TickCircle size={18} color="currentColor" variant="Bold" />
                  : <Copy size={18} color="currentColor" />
                }
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:row-span-2">
          <Suggeres />
        </div>

        <div className="lg:col-start-4 lg:col-span-2 lg:row-start-2">
          <PlanCard />
        </div>
      </div>
    </div>
  )
}