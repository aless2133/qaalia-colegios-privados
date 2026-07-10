'use client'

import { use, useState, useEffect } from 'react'
import AgentMobile   from '@/src/features/agent/views/mobile'
import AgentDesktop  from '@/src/features/agent/views/desktop'
import PageTransition from '@/src/features/components/animations/page_transition'

export default function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
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
    <PageTransition>
      {isDesktop
        ? <AgentDesktop slug={slug} />
        : <AgentMobile  slug={slug} />}
    </PageTransition>
  )
}