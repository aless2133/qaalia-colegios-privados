'use client'

import LottieLanding from '@/src/features/landing/components/animations/LottieAnimation'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'

interface RightStarFreeProps {
  variant: LayoutVariant
}

export default function RightStarFree({ variant }: RightStarFreeProps) {
  const desktop = variant === 'desktop'

 if (!desktop) {
    return (
      <div className="relative w-72 h-72 flex-shrink-0 mx-auto -mt-6">
        <LottieLanding variant="gestystarfree" />

        {/* Encuadre blanquecino sobrepuesto */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/4 w-36 h-24 bg-white z-10 pointer-events-none" />

        {/* Línea negra sobrepuesta — más pegada al encuadre */}
        <div className="absolute bottom-16 left-1/2 -translate-x-20 w-44 h-[2px] bg-black z-20 pointer-events-none" />
      </div>
    )
  }

  return (
    <div className="relative w-110 h-110 flex-shrink-0 -mt-12 -translate-x-40">
      <LottieLanding variant="gestystarfree" />

      {/* Encuadre blanquecino sobrepuesto — mueve/ajusta bottom, left, w y h a tu gusto para tapar las piernas */}
      <div className="absolute -bottom-15 left-1/2 -translate-x-1/4 w-50 h-40 bg-white z-10 pointer-events-none" />

      {/* Línea negra sobrepuesta — mueve bottom y left/translate a tu gusto */}
      <div className="absolute bottom-25 left-1/2 -translate-x-30 w-68 h-[2px] bg-black z-20 pointer-events-none" />
    </div>
  )
}