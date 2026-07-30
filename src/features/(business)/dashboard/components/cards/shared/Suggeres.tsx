'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddCircle, Messages2, ProfileCircle, ArrowRight2, Icon, BrushBig, Edit, TaskSquare } from 'iconsax-react'
import Link from 'next/link'

interface Suggestion {
  id:    'personalizar_agente' | 'crear_accion' | 'personalizar_pagina'
  icon:  Icon
  title: string
  desc:  string
  cta:   string
}

const SUGGESTIONS: Suggestion[] = [
  {
    id:    'personalizar_agente',
    icon:  Edit,
    title: 'Personalizar agente',
    desc:  'Nombre, foto, personalidad, reglas de respuesta y contexto de tu negocio.',
    cta:   'Personalizar agente',
  },
  {
    id:    'crear_accion',
    icon:  TaskSquare,
    title: 'Crea tu primera actividad',
    desc:  "Ej: 'Solicitud de proyecto' o 'Reportar problema' para tus clientes.",
    cta:   'Crear acción',
  },
  {
    id:    'personalizar_pagina',
    icon:  BrushBig,
    title: 'Personalizar página del negocio',
    desc:  'Foto, descripción, tipografía, color, mensaje personalizado.',
    cta:   'Editar branding',
  },
]

interface SuggeresProps {
  onPersonalizarPagina: () => void
}

export default function Suggeres({ onPersonalizarPagina }: SuggeresProps) {
  return (
    <Card className="bg-card border border-border h-fit">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold text-foreground">Sugerencias</h3>
        <p className="text-xs text-muted-foreground">
          Necesario para sacarle todo el provecho a tu agente.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {SUGGESTIONS.map((s, i) => (
          <div key={s.title} className="flex flex-col gap-2">
            <div className="flex items-start gap-3 py-3">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <s.icon size={16} color="currentColor" className="text-primary" />
              </div>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {s.id === 'personalizar_pagina' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPersonalizarPagina}
                    className="h-auto p-0 w-fit text-xs font-semibold text-primary hover:bg-transparent gap-1"
                  >
                    {s.cta}
                    <ArrowRight2 size={12} color="currentColor" />
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 w-fit text-xs font-semibold text-primary hover:bg-transparent gap-1"
                  >
                    <Link href={s.id === 'personalizar_agente' ? '/settings' : '/shares'}>
                      {s.cta}
                      <ArrowRight2 size={12} color="currentColor" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {i < SUGGESTIONS.length - 1 && <div className="h-px bg-border" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}