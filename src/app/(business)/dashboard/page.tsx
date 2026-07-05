'use client'

import { useState, useEffect } from 'react'
import { useAuthLogic }    from '@/src/lib/auth/UseLogic'
import DashboardDesktop    from '@/src/features/(business)/dashboard/views/desktop'
import DashboardMobile     from '@/src/features/(business)/dashboard/views/mobile'
import { setActiveNegocio, useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import Sidebar from '@/src/features/(business)/dashboard/components/layouts/desktop/sidebar'
import Navbar  from '@/src/features/(business)/dashboard/components/layouts/mobile/navbar'

export default function DashboardPage() {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1024px)').matches
    }
    return false
  })

  const { status, negocio: authNegocio } = useAuthLogic({
    redirectOnUnauth:    '/',
    redirectOnNoBusiness: '/register',
  })

  const negocioCached = useBusiness()
  const negocio = negocioCached ?? authNegocio

  useEffect(() => {
    if (!authNegocio) return
    try {
      if (sessionStorage.getItem('negocio_activo_id')) return
    } catch {}
    setActiveNegocio(authNegocio)
  }, [authNegocio?.id])

  useEffect(() => {
    const mq      = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (status === 'unauthenticated' || status === 'no_business') return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar negocio={negocio} />

      <div className="lg:ml-64">
        {negocio && (isDesktop
          ? <DashboardDesktop negocio={negocio} />
          : <DashboardMobile  negocio={negocio} />
        )}
      </div>

      <Navbar />
    </div>
  )
}