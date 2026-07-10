'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Send2, ProfileCircle, Danger, Global } from 'iconsax-react'
import type { OpcionAsistente, TipoOpcion } from '@/src/features/(business)/assistant/hooks/useAssistant'

interface OptionsProps {
  opciones:   OpcionAsistente[]
  procesando: boolean
  onAlternar: (id: string, activa: boolean) => void
}

const TIPO_META: Record<TipoOpcion, { icon: typeof Send2 }> = {
  auto_respuesta: { icon: Send2 },
  contacto:        { icon: ProfileCircle },
  urgencia:        { icon: Danger },
  idioma:          { icon: Global },
}

export default function Options({ opciones, procesando, onAlternar }: OptionsProps) {
  return (
    <Card className="bg-card border border-border overflow-hidden py-0 gap-0">
      <CardContent className="p-4 flex flex-col gap-1">
        <p className="text-xs font-bold text-foreground pb-2">Opciones del asistente</p>

        <div className="flex flex-col divide-y divide-border">
          {opciones.map(opcion => {
            const OpcionIcon = TIPO_META[opcion.tipo].icon
            return (
              <div key={opcion.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <OpcionIcon size={15} color="currentColor" className="text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{opcion.nombre}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{opcion.descripcion}</p>
                  </div>
                </div>

                <Switch
                  checked={opcion.activa}
                  disabled={procesando}
                  onCheckedChange={(checked) => onAlternar(opcion.id, checked)}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}