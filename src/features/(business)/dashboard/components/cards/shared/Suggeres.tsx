'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddCircle, Messages2, ProfileCircle, ArrowRight2, Icon, BrushBig } from 'iconsax-react'

interface Suggestion {
  icon:  Icon
  title: string
  desc:  string
  cta:   string
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon:  Messages2,
    title: 'Personaliza tu agente IA',
    desc:  'Define nombre, reglas y contexto para que responda como tú lo harías.',
    cta:   'Personalizar agente',
  },
  {
    icon:  AddCircle,
    title: 'Crea tu primera acción',
    desc:  "Ej: 'Cotizar producto' o 'Reportar problema' para guiar a tus clientes.",
    cta:   'Crear acción',
  },
  {
    icon:  BrushBig,
    title: 'Completa el branding de tu enlace',
    desc:  'Logo, colores y datos de tu negocio en tu enlace único.',
    cta:   'Editar branding',
  },
]

export default function Suggeres() {
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 w-fit text-xs font-semibold text-primary hover:bg-transparent gap-1"
                >
                  {s.cta}
                  <ArrowRight2 size={12} color="currentColor" />
                </Button>
              </div>
            </div>
            {i < SUGGESTIONS.length - 1 && <div className="h-px bg-border" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}