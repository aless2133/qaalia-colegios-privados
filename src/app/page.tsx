'use client'

import { useState, useEffect } from 'react'
import MobileLanding  from '@/src/features/landing/views/mobile'
import DesktopLanding from '@/src/features/landing/views/desktop'

export default function HomePage() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isDesktop === null) return null
  return isDesktop ? <DesktopLanding /> : <MobileLanding />
}