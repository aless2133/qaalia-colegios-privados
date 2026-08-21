import Image from 'next/image'
import Link  from 'next/link'
import { Button } from '@/components/landing/button'
import type { LayoutVariant } from '../../layouts/LandingOverview'
import WaveDivider from '@/src/features/landing/components/sections/WaveDivider'
import RightStarFree from '@/src/features/landing/components/cards/StarFree/RightStarFree'

interface StarFreeProps {
  variant: LayoutVariant
}

export default function StarFree({ variant }: StarFreeProps) {
  const desktop = variant === 'desktop'
  return (
      <div
        className={
          desktop
            ? 'flex items-center justify-between gap-16 -mt-12'
            : 'flex flex-col items-center text-center gap-2'
        }
      >
        <div className={`flex flex-col gap-4 ${desktop ? 'max-w-md' : ''}`}>
          <h2 className={`font-extrabold text-foreground leading-tight ${desktop ? 'text-[45px]' : 'text-3xl'}`}>
            Empieza gratis
          </h2>
          <p className={`text-foreground leading-relaxed ${desktop ? 'text-[22px]' : 'text-base'}`}> 
            Crea tu primer proyecto hoy mismo, sin tarjeta de crédito
            y sin compromisos.
          </p>
          <Button
            size="lg"
            className={`w-70 h-20 bg-accent text-primary-foreground hover:bg-accent font-normal mt-2 ${desktop ? 'text-2xl' : 'text-xl self-center'}`}
            asChild
          >
            <Link href="/register">Empezar ahora</Link>
          </Button>
        </div>

       <RightStarFree variant={variant} />
      </div>
  )
}