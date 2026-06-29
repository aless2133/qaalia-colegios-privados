import Navbar  from './Navbar'
import Hero    from '../sections/Hero'
import Core    from '../sections/Core'
import Footer  from '../sections/Footer'

export type LayoutVariant = 'desktop' | 'mobile'

interface LandingOverviewProps {
  variant: LayoutVariant
}

/**
 * Ensambla la landing page completa.
 * Cada sección recibe `variant` para adaptar su layout interno.
 */
export default function LandingOverview({ variant }: LandingOverviewProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant={variant} />

      <main className="flex-1">
        <Hero   variant={variant} />
        <Core   variant={variant} />
      </main>

      <Footer variant={variant} />
    </div>
  )
}