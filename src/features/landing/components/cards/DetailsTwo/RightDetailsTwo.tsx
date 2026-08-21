import Image from 'next/image'
import LottieLanding from '@/src/features/landing/components/animations/LottieAnimation'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'

interface RightDetailsTwoProps {
  variant: LayoutVariant
}

export default function RightDetailsTwo({ variant }: RightDetailsTwoProps) {
  const desktop = variant === 'desktop'

  if (!desktop) {
    return (
      <div className="relative w-full max-w-xs mx-auto mt-6">
        {/* Imagen del código */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src="/assets/landing/details/codez.webp"
            alt="Ejemplo de código"
            fill
            className="object-contain"
          />
        </div>

        {/* Animación sobrepuesta, fuera de la imagen */}
        <div className="absolute -bottom-8 -right-6 w-24 h-24 z-10 pointer-events-none">
          <LottieLanding variant="gestyrocket" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-lg -mt-68 md:-ml-76">
      {/* Imagen del código */}
      <div className="relative w-200 h-200 aspect-[4/3]">
        <Image
          src="/assets/landing/details/codez.webp"
          alt="Ejemplo de código"
          fill
          className="object-contain"
        />
      </div>

      {/* Animación sobrepuesta, fuera de la imagen */}
      <div className="absolute bottom-34 -right-79 w-72 h-72 z-10 pointer-events-none">
        <LottieLanding variant="gestyrocket" />
      </div>
    </div>
  )
}