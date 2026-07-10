'use client'

import { useLottie } from 'lottie-react'
import walletAnimation from '@/public/animations/wallet.json'
import nodataAnimation from '@/public/animations/nodata.json'
import confirmAnimation from '@/public/animations/crab.json'
import searchAnimation from '@/public/animations/search.json'

const animations: Record<string, object> = {
  default: walletAnimation,
  nodata: nodataAnimation,
  confirm: confirmAnimation,
  search: searchAnimation,
}

export default function LottieNodata({ className = '', variant = 'default' }: { className?: string, variant?: string }) {
  const options = {
    animationData: animations[variant] ?? animations.default,
    loop: true,
    autoplay: true
  }

  const { View } = useLottie(options)

  return <div className={`w-full h-full ${className}`}>{View}</div>
}