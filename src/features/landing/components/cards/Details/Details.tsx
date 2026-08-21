import type { ReactNode } from 'react'
import { Button } from '@/components/landing/button'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'
import RightDetails from '@/src/features/landing/components/cards/Details/RightDetails'

interface DetailsProps {
  variant: LayoutVariant
}

interface BlockProps {
  title: string
  desc: string
  cta: string
  desktop: boolean
  children: ReactNode
}

function Block({ title, desc, cta, desktop, children }: BlockProps) {
  return (
        <div
      className={
        desktop
          ? 'flex items-center justify-between gap-8 -mt-12'
          : 'flex flex-col items-center text-center gap-8'
      }
    >
      <div className={`flex flex-col gap-4 ${desktop ? 'max-w-md' : ''}`}>
        <h3 className={`font-extrabold text-foreground leading-tight ${desktop ? 'text-[45px]' : 'text-3xl'}`}>
          {title}
        </h3>
        <p className={`text-foreground leading-relaxed ${desktop ? 'text-[22px]' : 'text-base'}`}>{desc}</p>
      <Button className={`w-60 h-20 bg-accent text-primary-foreground hover:bg-accent font-normal mt-2 ${desktop ? 'text-2xl' : 'text-xl self-center'}`}>
          {cta}
        </Button>
      </div>

      {/* Espacio reservado para tu animación / ilustración */}
      <div className="relative w-full max-w-xl h-64 flex-shrink-0">
        {children}
      </div>
    </div>
  )
}

export default function Details({ variant }: DetailsProps) {
  const desktop = variant === 'desktop'

  return (
    <div className="flex flex-col divide-y-2 divide-border">
      <Block
        desktop={desktop}
        title="¿Sin contexto? Sin problema"
        desc="Crea proyectos y secciones para que cada modelo de IA sepa exactamente en qué estás trabajando, sin repetir contexto cada vez que cambias de herramienta."
        cta="Aprende más"
      >
       <RightDetails variant={variant} />
      </Block>
    </div>
  )
}