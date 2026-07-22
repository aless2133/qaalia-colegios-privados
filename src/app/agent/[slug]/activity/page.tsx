'use client'

import { use, useState, useEffect } from 'react'
import ActivityMobile  from '@/src/features/(agent)/activity/views/mobile'
import ActivityDesktop from '@/src/features/(agent)/activity/views/desktop'
import PageTransition  from '@/src/features/components/animations/page_transition'
import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import AgentBrandLayout from '@/src/features/(agent)/agent/components/layouts/shared/AgentBrandLayout'

export default function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
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
    <AgentBrandLayout slug={slug}>
      <PageTransition>
        {isDesktop
          ? <ActivityDesktop slug={slug} />
          : <ActivityMobile  slug={slug} />}
      </PageTransition>
    </AgentBrandLayout>
  )
}