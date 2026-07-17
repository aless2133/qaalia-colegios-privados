'use client'

import { useEffect } from 'react'

export function useViewportHeight() {
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    let raf = 0
    const setAltura = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--app-vh', `${vv.height}px`)
      })
    }

    setAltura()
    vv.addEventListener('resize', setAltura)
    vv.addEventListener('scroll', setAltura)
    return () => {
      vv.removeEventListener('resize', setAltura)
      vv.removeEventListener('scroll', setAltura)
      cancelAnimationFrame(raf)
    }
  }, [])
}