import Image from 'next/image'
import LottieLanding from '@/src/features/landing/components/animations/LottieAnimation'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'

interface RightDetailsRow {
  icon: string
  label: string
}

interface RightDetailsProps {
  variant: LayoutVariant
}

const rows: RightDetailsRow[] = [
  { icon: '/assets/landing/details/det_one.webp', label: 'Nuevo proyecto' },
  { icon: '/assets/landing/details/dett_two.webp',   label: 'Nueva sección' },
  { icon: '/assets/landing/details/det_tree.webp',   label: 'Comenzar' },
]

export default function RightDetails({ variant }: RightDetailsProps) {
  const desktop = variant === 'desktop'

  return (
    <div className={`relative w-full mx-auto ${desktop ? 'max-w-lg -mt-12 md:-ml-6' : 'max-w-xs mt-4'}`}>
      {/* Encuadre */}
      <div className="border-2 border-black bg-white divide-y-2 divide-black">
        {rows.map((row) => (
          <div key={row.label} className={`flex items-center gap-4 pl-3 pr-6 ${desktop ? 'py-4' : 'py-3'}`}>
            <div className={`relative flex-shrink-0 ${desktop ? 'w-20 h-20' : 'w-12 h-12'}`}>
              <Image src={row.icon} alt={row.label} fill className="object-contain" />
            </div>
            <span className={`font-extrabold text-black ${desktop ? 'text-lg md:text-[22px]' : 'text-sm'}`}>{row.label}</span>
          </div>
        ))}
      </div>

      {/* Animación sobrepuesta, fuera del encuadre */}
      <div
        className={
          desktop
            ? 'absolute -bottom-23 -right-15 w-68 h-68 z-10 pointer-events-none'
           : 'absolute -bottom-14 -right-3 w-38 h-38 z-10 pointer-events-none'
        }
      >
        <LottieLanding variant="gestydetail" />
      </div>
    </div>
  )
}