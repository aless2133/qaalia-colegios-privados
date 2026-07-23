'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ProfileCircle, Link1, Brush2, Notification, ArrowRight2, Setting, Edit, Import, ImportCurve, LinkSquare, PasswordCheck, Lock } from 'iconsax-react'
import type { AjusteAsistente, TipoAjuste } from '@/src/features/(business)/assistant/hooks/useAssistant'

interface SettingsProps {
  ajustes:       AjusteAsistente[]
  onSeleccionar: (tipo: TipoAjuste) => void
}

const TIPO_META: Record<TipoAjuste, { icon: typeof ProfileCircle }> = {
  personalizar_agente:         { icon: Setting },
  personalizar_pagina:         { icon: Edit },
  marca:          { icon: LinkSquare },
  clave: { icon: Lock },
}

export default function Settings({ ajustes, onSeleccionar }: SettingsProps) {
  return (
    <Card className="bg-card border border-border overflow-hidden py-0 gap-0">
      <CardContent className="p-4 flex flex-col gap-1">
        <p className="text-xs font-bold text-foreground pb-2">Configuración</p>

        <div className="flex flex-col divide-y divide-border">
          {ajustes.map(ajuste => {
            const AjusteIcon = TIPO_META[ajuste.tipo].icon
            return (
              <button
                key={ajuste.id}
                onClick={() => onSeleccionar(ajuste.tipo)}
                className="flex items-center justify-between gap-3 py-3 text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <AjusteIcon size={15} color="currentColor" className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{ajuste.nombre}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{ajuste.descripcion}</p>
                  </div>
                </div>

                <ArrowRight2 size={14} color="currentColor" className="text-muted-foreground flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}