import { User } from 'iconsax-react'
import { Card, CardHeader, CardContent } from '@/components/landing/card'
import type { LayoutVariant } from '../layouts/LandingOverview'

interface ReviewsProps {
  variant: LayoutVariant
}

const REVIEWS = [
  {
    name: 'Ozzy',
    handle: '@tomosman',
    text: 'Si sale una herramienta nueva y te ahorra tiempo y cuesta menos que el valor equivalente, normalmente es una compra segura. Qaalia probablemente entra en esa categoría para muchos.',
  },
  {
    name: 'Parker',
    handle: '@parkerthompson_',
    text: 'No solo Qaalia es una herramienta increíble, además recibí una respuesta de soporte súper detallada en menos de 15 minutos. Estoy convencido.',
  },
  {
    name: 'Martin McKeaveney',
    handle: '@martinmck_',
    text: 'La imagen destacada de mi último post se creó automáticamente gracias a Qaalia. Cuando marco un proyecto como listo, el contexto se organiza solo. Simple y consistente :)',
  },
  {
    name: 'Typeform',
    handle: '@typeform',
    text: '¿Qué tienen en común varias herramientas de automatización? Que todas ayudan a automatizar procesos en este tutorial 👋',
  },
  {
    name: 'Nile',
    handle: '@Nile',
    text: 'Llevo 15 minutos usando Qaalia y ya lo amo.',
  },
  {
    name: 'Andy Wingrave',
    handle: '@andywingrave',
    text: 'Honestamente es tan bueno. Creo que es el mejor producto que he visto este año, y pronto será imprescindible para cualquier equipo.',
  },
]

const COL_TILT = ['-rotate-2', '', 'rotate-2'] as const
const COL_OFFSET = ['', 'mt-8', ''] as const

export default function Reviews({ variant }: ReviewsProps) {
  const desktop = variant === 'desktop'

  return (
    <div
      className={
        desktop
          ? 'grid grid-cols-3 gap-6 max-w-5xl mx-auto -mt-12'
          : 'flex flex-col gap-6'
      }
    >
      {REVIEWS.map((review, i) => {
        const col = i % 3
        return (
          <Card
            key={review.handle}
            className={`bg-background border-2 border-border ${
              desktop ? `${COL_TILT[col]} ${COL_OFFSET[col]} hover:rotate-0 transition-transform` : ''
            }`}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center flex-shrink-0">
                <User size={20} color="currentColor" className="text-foreground" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-foreground leading-tight">{review.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">{review.handle}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}