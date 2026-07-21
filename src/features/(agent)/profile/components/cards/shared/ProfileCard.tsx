'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Call, Sms, Location } from 'iconsax-react'
import type { NegocioAgente } from '@/src/features/(agent)/agent/hooks/useAgent'

interface ProfileCardProps {
  negocio: NegocioAgente
}

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase()
}

export default function ProfileCard({ negocio }: ProfileCardProps) {
  return (
    <Card className="bg-card border border-border overflow-hidden py-0 gap-0">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-16 h-16 flex-shrink-0 border border-border">
            <AvatarImage src={negocio.foto_dueno ?? undefined} alt={negocio.nombre} />
            <AvatarFallback className="bg-accent text-foreground font-bold">
              {iniciales(negocio.nombre)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex flex-col gap-1.5">
            <p className="text-base font-black text-foreground truncate">{negocio.nombre}</p>
            <Badge variant="outline" className="w-fit text-[11px]">
              {negocio.tipo_negocio}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-3 border-t border-border/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <Location size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
            <p className="text-[13px] text-muted-foreground truncate">{negocio.ciudad}</p>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <Call size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
            <p className="text-[13px] text-muted-foreground truncate">{negocio.telefono}</p>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <Sms size={16} color="currentColor" className="text-muted-foreground flex-shrink-0" />
            <p className="text-[13px] text-muted-foreground truncate">{negocio.correo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}