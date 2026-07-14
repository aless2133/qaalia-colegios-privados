'use client'

import Link from 'next/link'
import { ArrowLeft2 } from 'iconsax-react'

export default function Hero() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Link 
          href=".." 
          className="w-12 h-12 rounded-2xl py-0 bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft2 size={24} color="currentColor" className="text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground leading-tight">Agente IA</h1>
          <p className="text-sm text-muted-foreground">Configura el cerebro y comportamiento de tu asistente.</p>
        </div>
      </div>
    </div>
  )
}