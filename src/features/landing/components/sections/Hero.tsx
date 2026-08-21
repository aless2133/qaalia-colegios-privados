import Link from 'next/link'
import { ArrowRight, ArrowRightIcon, Zap } from 'lucide-react'
import { Button } from '@/components/landing/button'
import { Badge }  from '@/components/landing/badge'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'
import { Flash, ScanBarcode, ShieldTick, Star, Star1, TickCircle } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import RightHero from '@/src/features/landing/components/cards/RightHero/RightHero'
interface HeroProps {
  variant: LayoutVariant
}

export default function Hero({ variant }: HeroProps) {
  const desktop = variant === 'desktop'
  const router = useRouter()

  return (
   <section className={`bg-primary ${desktop ? 'py-28 px-8' : 'py-16 px-5'}`}>
      <div className={desktop ? 'max-w-6xl mx-auto flex items-center gap-20' : 'flex flex-col gap-12'}>

        {/* Bloque de texto */}
       <div className={`flex flex-col gap-6 ${desktop ? 'flex-1' : 'items-center text-center'}`}>
          <h1 className={`font-extrabold text-foreground leading-[1.1] ${desktop ? 'text-[4.1rem]' : 'text-4xl'}`}>
            Organiza el<br />
            <span>contexto de</span> <br />
            <span>tus proyectos</span>
          </h1>

         <p className={`text-foreground leading-relaxed max-w-md ${desktop ? 'text-xl' : 'text-base'}`}>
            Centraliza el contexto de tus proyectos y cambia entre 
            IAs sin copiar, pegar ni explicar de nuevo tu trabajo hoy.
          </p>

          <div className={`flex flex-wrap gap-3 ${desktop ? '' : 'justify-center'}`}>
            <Button
              size="lg"
              className={`w-70 h-20 bg-accent text-primary-foreground hover:bg-accent font-normal mt-2 ${desktop ? 'text-2xl' : 'text-xl'}`}
              onClick={() => router.push('/register')}
            >
                Empezar ahora 
            </Button>
          </div>

          {/* Señal de confianza estilo Bannerbear */}
          <div className={`flex items-center gap-2 pt-1 ${desktop ? '' : 'justify-center'}`}>
            <TickCircle size={20} variant="Bold" color="currentColor" className="text-success shrink-0" />
            <span className="text-sm text-foreground">
              Prueba gratis — sin tarjeta de crédito
            </span>
          </div>
        </div>

        {/* Imagen + animación */}
        <div className={`${desktop ? 'flex-1 flex justify-center' : 'flex justify-center'}`}>
          <RightHero variant={variant} />
        </div>
      </div>
    </section>
  )
}