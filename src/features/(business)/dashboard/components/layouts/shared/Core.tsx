'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Messages2, DocumentText, Eye, TaskSquare, Link1, ExportSquare, Setting2, AddCircle, TickCircle, Setting, Copy } from 'iconsax-react'
import DashboardCard from '@/src/features/(business)/dashboard/components/cards/shared/DashboardCard'
import Suggeres    from '@/src/features/(business)/dashboard/components/cards/shared/Suggeres'
import type { NegocioData } from '@/src/lib/auth/UseLogic'
import PlanCard from '@/src/features/(business)/dashboard/components/cards/shared/PlanCard'
import { useState, useMemo } from 'react'
interface CoreProps {
  negocio: NegocioData | null
}

// TODO: reemplazar por el endpoint real de métricas del agente/negocio.
const STATS = [
  { icon: Messages2,    label: 'Conversaciones activas', value: '12',  helper: 'Últimas registradas' },
  { icon: DocumentText, label: 'Solicitudes pendientes',  value: '5',   helper: 'Esperando tu respuesta' },
  { icon: TickCircle,          label: 'Completados',       value: '340', trend: { value: '+18%', positive: true } },
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
    <div className="flex flex-col gap-6">
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <h3 className="text-sm font-semibold text-foreground">Resumen</h3>
          <p className="text-xs text-muted-foreground">
            Así va tu negocio en este momento.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex flex-col gap-2">
              <div className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <s.icon size={16} color="currentColor" className="text-primary" />
                </div>
               <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  {s.helper && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.helper}</p>
                  )}
                </div>
                <span className="text-sm font-bold text-foreground flex-shrink-0">{s.value}</span>
              </div>
              {i < STATS.length - 1 && <div className="h-px bg-border" />}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <Card className="lg:col-span-2 bg-card border border-border">
          <CardHeader className="pb-0">
            <h3 className="text-sm font-semibold text-foreground">Enlace del negocio</h3>
            <p className="text-xs text-muted-foreground">
             Comparte tu enlace, puedes cambiarlo cuando quieras.
            </p>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-accent min-w-0">
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
        <Suggeres />
        <PlanCard />
      </div>
    </div>
  )
}