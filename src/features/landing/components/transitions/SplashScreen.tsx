'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [sliding, setSliding] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (!isStandalone) return

    setVisible(true)
    const t1 = setTimeout(() => setSliding(true), 1400)
    const t2 = setTimeout(() => setVisible(false), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #121214 0%, #0A0A0B 35%, #050505 65%, #121214 100%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: sliding ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      <img
        src="/assets/logo/qaalia_splash.webp"
        alt="Qaalia"
        style={{
          width: 'clamp(140px, 40vw, 280px)',
          height: 'auto',
        }}
      />
    </div>
  )
}