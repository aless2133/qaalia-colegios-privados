'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { EstadoActividad } from '@/src/features/(business)/activity/hooks/useActivity'

const ESTADOS: { value: EstadoActividad; label: string }[] = [
  { value: 'pendiente',  label: 'Pendientes' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'completada', label: 'Completadas' },
  { value: 'rechazada',  label: 'Rechazadas' },
]

interface TabsProps {
  estadoActivo: EstadoActividad
  onSelect:     (estado: EstadoActividad) => void
  contadores:   Record<EstadoActividad, number>
}

export default function ActivityTabs({ estadoActivo, onSelect, contadores }: TabsProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <Tabs value={estadoActivo} onValueChange={(v) => onSelect(v as EstadoActividad)}>
        <TabsList className="bg-accent w-max">
          {ESTADOS.map(e => (
            <TabsTrigger key={e.value} value={e.value} className="gap-1.5">
              {e.label}
              <Badge
                variant={e.value === estadoActivo ? 'default' : 'secondary'}
                className="h-5 min-w-5 px-1.5 text-[10px]"
              >
                {contadores[e.value]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}