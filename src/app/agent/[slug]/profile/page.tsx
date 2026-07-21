'use client'

import { use, useState, useEffect } from 'react'
import ProfileMobile  from '@/src/features/(agent)/profile/views/mobile'
import ProfileDesktop from '@/src/features/(agent)/profile/views/desktop'
import PageTransition  from '@/src/features/components/animations/page_transition'
import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import Navbar from '@/src/features/(agent)/agent/components/layouts/shared/Navbar'

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const agent = useAgent(slug)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isDesktop === null) return null

  return (
   <>
    <Navbar nombreNegocio={agent.negocio?.nombre ?? ''} loading={agent.loading} />
    <PageTransition>
      {isDesktop
        ? <ProfileDesktop slug={slug} />
        : <ProfileMobile  slug={slug} />}
    </PageTransition>
     </>
  )
}