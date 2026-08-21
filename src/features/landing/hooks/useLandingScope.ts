'use client'

import { useEffect } from 'react'
export function useLandingScope() {
  useEffect(() => {
    document.body.classList.add('landing')
    return () => document.body.classList.remove('landing')
  }, [])
}