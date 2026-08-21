import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'
import { Button } from '@/components/landing/button'
import RightDemos from '@/src/features/landing/components/cards/Demos/RightDemos'

interface DemosProps {
  variant: LayoutVariant
}

export default function Demos({ variant }: DemosProps) {
  const desktop = variant === 'desktop'

  return (
    <div
      className={
        desktop
          ? 'flex items-center justify-between gap-16 -mt-12'
          : 'flex flex-col items-center text-center gap-3'
      }
    >
      <div className={`flex flex-col gap-4 ${desktop ? 'max-w-md' : ''}`}>
        <h3 className={`font-extrabold text-foreground leading-tight ${desktop ? 'text-[45px]' : 'text-3xl'}`}>
          Mira Qaalia en acción
        </h3>
        <p className={`text-foreground leading-relaxed ${desktop ? 'text-[22px]' : 'text-base'}`}> 
          Descubre cómo Qaalia centraliza tus proyectos y modelos de IA en minutos.
        </p>
       <Button className={`w-70 h-20 bg-accent text-primary-foreground hover:bg-accent font-normal mt-2 ${desktop ? 'text-2xl' : 'text-lg self-center'}`}>
          Más información
        </Button>
      </div>

    {/* Espacio reservado para tu animación / ilustración */}
      <div className={`relative flex-shrink-0 ${desktop ? 'w-full max-w-md h-64' : 'w-full h-auto'}`}>
        <RightDemos variant={variant} />
      </div>
    </div>
  )
}