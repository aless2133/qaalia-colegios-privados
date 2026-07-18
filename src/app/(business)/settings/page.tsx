'use client'

import { useState, useEffect } from 'react'
import AgentSettingsMobile from '@/src/features/(business)/AgentSettings/views/mobile'
import AgentSettingsDesktop from '@/src/features/(business)/AgentSettings/views/desktop'
import Sidebar from '@/src/features/(business)/dashboard/components/layouts/desktop/sidebar'
import Navbar from '@/src/features/(business)/dashboard/components/layouts/mobile/navbar'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'

export default function AgentSettingsPage() {
  const negocio = useBusiness()

  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar negocio={negocio} />
      <div className="lg:ml-64">
        {isDesktop ? <AgentSettingsDesktop /> : <AgentSettingsMobile />}
      </div>
    </div>
  )
}