'use client'

import { useEffect, type RefObject } from 'react'

export function useStickyFooter(ref: RefObject<HTMLElement | null>, activo: boolean = true) {
  useEffect(() => {
    const vv = window.visualViewport
    const el = ref.current
    if (!vv || !el || !activo) return

    let raf = 0
    const posicionar = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.position = 'fixed'
        el.style.left = '0'
        el.style.right = '0'
        el.style.top = `${vv.height + vv.offsetTop}px`
        el.style.transform = 'translateY(-100%)'
      })
    }

    posicionar()
    vv.addEventListener('resize', posicionar)
    vv.addEventListener('scroll', posicionar)
    return () => {
      vv.removeEventListener('resize', posicionar)
      vv.removeEventListener('scroll', posicionar)
      cancelAnimationFrame(raf)
    }
  }, [ref, activo])
}