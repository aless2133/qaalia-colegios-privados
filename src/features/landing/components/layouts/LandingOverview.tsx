import Navbar   from '@/src/features/landing/components/layouts/Navbar'
import Hero     from '@/src/features/landing/components/sections/Hero'
import Core     from '@/src/features/landing/components/sections/Core'
import Footer   from '@/src/features/landing/components/sections/Footer'
import { useLandingScope } from '@/src/features/landing/hooks/useLandingScope'
import { Button } from '@/components/landing/button'
import { Headphone, MessageText1 } from 'iconsax-react'

export type LayoutVariant = 'desktop' | 'mobile'

interface LandingOverviewProps {
  variant: LayoutVariant
}

export default function LandingOverview({ variant }: LandingOverviewProps) {
  useLandingScope()

  return (
   <div className="landing min-h-screen bg-background flex flex-col">
      <Navbar variant={variant} />

      <main className="flex-1 overflow-x-hidden">
        <Hero     variant={variant} />
        <Core     variant={variant} />
      </main>
      <Footer variant={variant} />
            <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        aria-label="Chatear con soporte"
      >
        <MessageText1 color="currentColor" className="text-primary-foreground !h-7.5 !w-7.5" />
      </Button>
    </div>
  )
}