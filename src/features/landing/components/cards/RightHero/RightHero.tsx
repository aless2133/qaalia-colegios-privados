import LottieLanding from '@/src/features/landing/components/animations/LottieAnimation'
import type { LayoutVariant } from '@/src/features/landing/components/layouts/LandingOverview'

interface RightHeroProps {
  variant: LayoutVariant
}

export default function RightHero({ variant }: RightHeroProps) {
  const desktop = variant === 'desktop'

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className={
          desktop
            ? 'w-132 h-132'
            : 'w-78 h-78'
        }
      >
        <LottieLanding variant="hero" />
      </div>
    </div>
  )
}