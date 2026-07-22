'use client'

import { use, useState, useEffect } from 'react'
import AgentMobile   from '@/src/features/(agent)/agent/views/mobile'
import AgentDesktop  from '@/src/features/(agent)/agent/views/desktop'
import PageTransition from '@/src/features/components/animations/page_transition'
import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'
import AgentBrandLayout from '@/src/features/(agent)/agent/components/layouts/shared/AgentBrandLayout'

export default function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const agent = useAgent(slug)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [chatKey, setChatKey] = useState(0)
  const handleNuevoChat = () => setChatKey(prev => prev + 1)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isDesktop === null) return null

  return (
    <AgentBrandLayout slug={slug} onNuevoChat={handleNuevoChat}>
      <PageTransition>
        {isDesktop
          ? <AgentDesktop key={chatKey} slug={slug} />
          : <AgentMobile  key={chatKey} slug={slug} />}
      </PageTransition>
    </AgentBrandLayout>
  )
}
