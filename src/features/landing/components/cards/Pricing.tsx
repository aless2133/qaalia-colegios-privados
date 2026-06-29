import Link from 'next/link'
import { Check } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge  } from '@/components/ui/badge'

const PLANS = [
  {
    name:        'Starter',
    price:       'Gratis',
    period:      '',
    desc:        'Para instituciones que quieren empezar sin riesgo.',
    badge:       null,
    highlighted: false,
    cta:         'Empezar gratis',
    href:        '#demo',
    features: [
      'Hasta 50 estudiantes',
      'QR básico por estudiante',
      'Portal del estudiante',
      'Gesty — 100 consultas / mes',
    ],
  },
  {
    name:        'Estándar',
    price:       '$99',
    period:      '/ mes',
    desc:        'La mayoría de colegios e institutos elige este plan.',
    badge:       'Más popular',
    highlighted: true,
    cta:         'Solicitar demo',
    href:        '#demo',
    features: [
      'Hasta 500 estudiantes',
      'QR dinámico + control por zona',
      'Gesty sin límite de consultas',
      'Agendamiento interno',
      'Analytics básico',
      'Soporte por correo',
    ],
  },
  {
    name:        'Premium',
    price:       '$299',
    period:      '/ mes',
    desc:        'Para instituciones con múltiples sedes o alto volumen.',
    badge:       null,
    highlighted: false,
    cta:         'Contactar ventas',
    href:        '#demo',
    features: [
      'Estudiantes ilimitados',
      'Múltiples sedes',
      'Analytics avanzado + exportación',
      'Integración con sistemas externos (API)',
      'Gesty con documentos avanzados',
      'Onboarding personalizado',
      'Soporte prioritario',
    ],
  },
]

export default function Pricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
      {PLANS.map(p => (
        <Card
          key={p.name}
          className={`relative flex flex-col border transition-all ${
            p.highlighted
              ? 'border-primary shadow-xl shadow-primary/10'
              : 'border-border'
          } bg-card`}
        >
          {p.badge && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-0.5">
                {p.badge}
              </Badge>
            </div>
          )}

          <CardHeader className="pb-4 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {p.name}
            </p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-bold text-foreground">{p.price}</span>
              {p.period && (
                <span className="text-sm text-muted-foreground mb-1">{p.period}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
          </CardHeader>

          <CardContent className="flex-1">
            <ul className="space-y-2.5">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              className="w-full font-semibold"
              variant={p.highlighted ? 'default' : 'outline'}
              style={p.highlighted ? {} : undefined}
              asChild
            >
              <Link href={p.href}>{p.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}