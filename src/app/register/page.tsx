'use client'

import { useState, useEffect } from 'react'
import RegisterDesktop from '@/src/features/register/views/desktop'
import RegisterMobile  from '@/src/features/register/views/mobile'

export default function RegisterPage() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq      = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isDesktop === null) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050B12' }}>
      <span className="w-7 h-7 border-2 rounded-full animate-spin"
        style={{ borderColor: '#1D9BF0', borderTopColor: 'transparent' }} />
    </div>
  )

  return isDesktop ? <RegisterDesktop /> : <RegisterMobile />
}