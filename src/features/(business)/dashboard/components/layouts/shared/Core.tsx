'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TaskSquare, Profile2User, Wallet2, CalendarTick, Clock } from 'iconsax-react'
import ServiceCard from '@/src/features/(business)/dashboard/components/cards/shared/ServiceCard'
import Suggeres    from '@/src/features/(business)/dashboard/components/cards/shared/Suggeres'
import type { NegocioData } from '@/src/lib/auth/UseLogic'

interface CoreProps {
  negocio: NegocioData | null
}

// cuando exista el endpoint de métricas del negocio.
const STATS = [
  { icon: TaskSquare,    label: 'Trabajos hoy',        value: '8',      helper: '3 en progreso · 5 agendados', trend: { value: '+12%', positive: true  } },
  { icon: Profile2User,  label: 'Técnicos activos',    value: '4',      helper: 'De un total de 6 registrados' },
  { icon: Wallet2,       label: 'Ingresos del mes',    value: '$2,340', trend: { value: '+8%',  positive: true  } },
  { icon: CalendarTick,  label: 'Citas pendientes',    value: '11',     helper: 'Próximas 7 días' },
]

type EstadoTrabajo = 'pendiente' | 'en_progreso' | 'completado'

const ESTADO_LABEL: Record<EstadoTrabajo, string> = {
  pendiente:    'Pendiente',
  en_progreso:  'En progreso',
  completado:   'Completado',
}

const ESTADO_VARIANT: Record<EstadoTrabajo, 'secondary' | 'default' | 'outline'> = {
  pendiente:   'outline',
  en_progreso: 'secondary',
  completado:  'default',
}

const TRABAJOS_RECIENTES: Array<{
  id: string; cliente: string; servicio: string; tecnico: string; estado: EstadoTrabajo; hora: string
}> = [
  { id: 'T-1042', cliente: 'Comercial Andrade',  servicio: 'Mantenimiento A/C',   tecnico: 'Luis Cabrera',  estado: 'en_progreso', hora: '09:30' },
  { id: 'T-1041', cliente: 'Farmacia San Juan',  servicio: 'Revisión eléctrica',  tecnico: 'Ana Guamán',    estado: 'pendiente',   hora: '11:00' },
  { id: 'T-1040', cliente: 'Residencial Los Pinos', servicio: 'Fumigación',       tecnico: 'Jorge Vélez',   estado: 'completado',  hora: '08:15' },
  { id: 'T-1039', cliente: 'Hotel Real',         servicio: 'Mantenimiento A/C',   tecnico: 'Luis Cabrera',  estado: 'completado',  hora: 'Ayer' },
]

export default function Core({ negocio }: CoreProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => <ServiceCard key={s.label} {...s} />)}
      </div>

      {/* Trabajos recientes + sugerencias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <Card className="lg:col-span-2 bg-card border border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Trabajos recientes</h3>
              <p className="text-xs text-muted-foreground">
                {negocio?.nombre ?? 'Tu negocio'} · últimas órdenes de trabajo
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {TRABAJOS_RECIENTES.map((t, i) => (
              <div key={t.id} className="flex flex-col gap-0">
                <div className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Clock size={16} color="currentColor" className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{t.cliente}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.servicio} · {t.tecnico}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant={ESTADO_VARIANT[t.estado]} className="text-[11px] font-medium">
                      {ESTADO_LABEL[t.estado]}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{t.hora}</span>
                  </div>
                </div>
                {i < TRABAJOS_RECIENTES.length - 1 && <div className="h-px bg-border" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Suggeres />
      </div>
    </div>
  )
}