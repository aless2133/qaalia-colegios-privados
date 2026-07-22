'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Profile2User, DocumentText, Cpu } from 'iconsax-react'
import type { ConfigAgente } from '@/src/features/(agent)/agent/hooks/useAgent'
import type { Actividad } from '@/src/features/(agent)/activity/hooks/useActivity'

interface DetailsCardProps {
  agente:             ConfigAgente | null
  actividades:        Actividad[]
  loadingActividades: boolean
}

function ActividadRow({ actividad }: { actividad: Actividad }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <DocumentText size={14} color="currentColor" className="text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-foreground truncate">{actividad.titulo}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          {actividad.total_preguntas} {actividad.total_preguntas === 1 ? 'pregunta' : 'preguntas'}
        </p>
      </div>
    </div>
  )
}

function ActividadesSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-full bg-accent animate-pulse flex-shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-2.5 w-2/3 rounded bg-accent animate-pulse" />
            <div className="h-2 w-1/3 rounded bg-accent animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DetailsCard({ agente, actividades, loadingActividades }: DetailsCardProps) {
  return (
    <Card className="bg-card border border-border overflow-hidden py-0 gap-0">
      <CardContent className="p-4 flex flex-col lg:flex-row gap-4 lg:gap-4">
        <div className="flex flex-col gap-3 lg:w-1/2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cpu size={16} color="currentColor" className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {agente?.nombre || 'Agente'}
              </p>
              <Badge variant="outline" className="text-[10px] mt-0.5">Asistente virtual</Badge>
            </div>
          </div>

          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {agente?.personalidad || 'Sin descripción configurada.'}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden lg:block h-auto" />
        <Separator className="lg:hidden" />

        <div className="flex flex-col lg:w-1/2">
          <p className="text-sm font-bold text-muted-foreground tracking-wide mb-1">
            Actividades
          </p>

          {loadingActividades ? (
            <ActividadesSkeleton />
          ) : actividades.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-2">Sin actividades.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border/60">
              {actividades.map(a => <ActividadRow key={a.id} actividad={a} />)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}