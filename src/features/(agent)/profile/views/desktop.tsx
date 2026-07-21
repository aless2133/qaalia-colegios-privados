'use client'

import { useProfile } from '@/src/features/(agent)/profile/hooks/useProfile'
import Hero from '@/src/features/(agent)/profile/components/layouts/shared/Hero'
import Core from '@/src/features/(agent)/profile/components/layouts/shared/Core'

interface ProfileDesktopProps {
  slug: string
}

export default function ProfileDesktop({ slug }: ProfileDesktopProps) {
  const pr = useProfile(slug)

  return (
    <main className="px-10 py-4">
      <div className="max-w-8xl mx-auto flex flex-col gap-8">
        <div className="max-w-md">
          <Hero
            tipoNegocio={pr.negocio?.tipo_negocio ?? ''}
            ciudad={pr.negocio?.ciudad ?? ''}
            loading={pr.loading}
          />
        </div>
        <Core pr={pr} />
      </div>
    </main>
  )
}