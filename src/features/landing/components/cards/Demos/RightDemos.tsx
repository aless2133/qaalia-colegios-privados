import Image from 'next/image'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'

interface RightDemosProps {
  variant: LayoutVariant
}

export default function RightDemos({ variant }: RightDemosProps) {
  const desktop = variant === 'desktop'

  if (!desktop) {
    return (
      <div className="flex justify-center w-full -mt-12 -mb-18">
        <div className="relative w-92 h-92 aspect-square">
          <Image
            src="/assets/landing/demos/demosim.webp"
            alt="Demo de Qaalia"
            fill
            className="object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-lg -mt-50 md:-ml-58">
      {/* Imagen de demos */}
      <div className="relative w-169 h-169 aspect-[4/3]">
        <Image
          src="/assets/landing/demos/demosim.webp"
          alt="Demo de Qaalia"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}