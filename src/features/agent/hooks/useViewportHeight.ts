'use client'

import { useEffect } from 'react'

// Sincroniza la variable CSS --app-vh con la altura REAL y actual del
// visualViewport (la porción de pantalla visible de verdad, descontando
// teclado y barras del navegador). A diferencia de dvh, se actualiza en
// vivo con cada evento de resize/scroll del visualViewport, evitando el
// espacio en blanco que queda en Safari cuando la barra del navegador se
// oculta o el teclado se abre/cierra.
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