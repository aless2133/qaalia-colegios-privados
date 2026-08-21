'use client'

import { useLottie } from 'lottie-react'
import gestyrocketAnimation from '@/public/animations/landing/gestyrocket.json'
import heroAnimation from '@/public/animations/landing/hero.json'
import gestydetailAnimation from '@/public/animations/landing/gestydetail.json'
import gestystarfreeAnimation from '@/public/animations/landing/gestystarfree.json'

const animations: Record<string, object> = {
  gestyrocket: gestyrocketAnimation,
  hero: heroAnimation,
  gestydetail: gestydetailAnimation,
  gestystarfree: gestystarfreeAnimation,
}

export default function LottieLanding({ className = '', variant = 'gesty' }: { className?: string, variant?: string }) {
  const options = {
    animationData: animations[variant] ?? animations.gesty,
    loop: true,
    autoplay: true
  }

  const { View } = useLottie(options)

  return <div className={`w-full h-full ${className}`}>{View}</div>
}