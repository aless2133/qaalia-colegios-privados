import type { LayoutVariant } from '../../layouts/LandingOverview'
import { Button } from '@/components/landing/button'
import RightDetailsTwo from '@/src/features/landing/components/cards/DetailsTwo/RightDetailsTwo'

interface DetailsTwoProps {
  variant: LayoutVariant
}

export default function DetailsTwo({ variant }: DetailsTwoProps) {
  const desktop = variant === 'desktop'

  return (
    <div
      className={
        desktop
          ? 'flex items-center justify-between gap-16 -mt-12'
          : 'flex flex-col items-center text-center gap-8'
      }
    >
      <div className={`flex flex-col gap-4 ${desktop ? 'max-w-md' : ''}`}>
        <h3 className={`font-extrabold text-foreground leading-tight ${desktop ? 'text-[45px]' : 'text-3xl'}`}>
          Qaalia para desarrolladores
        </h3>
        <p className={`text-foreground leading-relaxed ${desktop ? 'text-[22px]' : 'text-base'}`}>
          Conecta todos tus modelos de IA favoritos y trabaja con el contexto completo de tu proyecto desde un solo lugar.
        </p>
        <Button className={`w-60 h-20 bg-accent text-primary-foreground hover:bg-accent font-normal mt-2 ${desktop ? 'text-2xl' : 'text-base'}`}>
          Aprende más
        </Button>
      </div>

      {/* Espacio reservado para tu animación / ilustración */}
      <div className={`relative w-full flex-shrink-0 ${desktop ? 'max-w-md h-64' : 'max-w-xs h-auto'}`}>
        <RightDetailsTwo variant={variant} />
      </div>
    </div>
  )
}