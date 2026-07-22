'use client'

import { use, useState, useEffect } from 'react'
import AgentMobile   from '@/src/features/(agent)/agent/views/mobile'
import AgentDesktop  from '@/src/features/(agent)/agent/views/desktop'
import PageTransition from '@/src/features/components/animations/page_transition'
import Navbar from '@/src/features/(agent)/agent/components/layouts/shared/Navbar'
import { useAgent } from '@/src/features/(agent)/agent/hooks/useAgent'

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

  const colorMarca = agent.negocio?.branding?.color_marca || '#5865F2'
  const fontFamily = agent.negocio?.branding?.font_family || 'var(--font-sans)'

  return (
    <div
      style={{
        '--brand-color': colorMarca,
        '--primary': 'oklch(from var(--brand-color) l c h)',
        fontFamily,
      } as React.CSSProperties}
      className="min-h-screen flex flex-col"
    >
      <Navbar nombreNegocio={agent.negocio?.nombre ?? ''} loading={agent.loading} onNuevoChat={handleNuevoChat}/>
      <PageTransition>
        {isDesktop
          ? <AgentDesktop key={chatKey} slug={slug} />
          : <AgentMobile  key={chatKey} slug={slug} />}
      </PageTransition>
    </div>
  )
}