'use client'

import { useProfile } from '@/src/features/(agent)/profile/hooks/useProfile'
import Hero from '@/src/features/(agent)/profile/components/layouts/shared/Hero'
import Core from '@/src/features/(agent)/profile/components/layouts/shared/Core'

interface ProfileMobileProps {
  slug: string
}

export default function ProfileMobile({ slug }: ProfileMobileProps) {
  const pr = useProfile(slug)

  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-5">
        <Hero
          tipoNegocio={pr.negocio?.tipo_negocio ?? ''}
          ciudad={pr.negocio?.ciudad ?? ''}
          loading={pr.loading}
        />
        <Core pr={pr} />
      </div>
    </main>
  )
}