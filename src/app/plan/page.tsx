'use client'

import { useState, useEffect, Suspense } from 'react'
import PlanMobile  from '@/src/features/plan/views/mobile'
import PlanDesktop from '@/src/features/plan/views/desktop'

export default function PlanPage() {
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
      <Suspense fallback={null}>
        {isDesktop ? <PlanDesktop /> : <PlanMobile />}
      </Suspense>
    </div>
  )
}