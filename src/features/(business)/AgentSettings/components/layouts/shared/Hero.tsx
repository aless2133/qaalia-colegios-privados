'use client'

import Link from 'next/link'
import { ArrowLeft2 } from 'iconsax-react'

export default function Hero() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Link 
          href=".." 
          className="w-9 h-9 shrink-0 rounded-4xl py-0 bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft2 size={20} color="currentColor" className="text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground leading-tight">Agente</h1>
          <p className="text-sm text-muted-foreground">Configura la información y comportamiento de tu agente.</p>
        </div>
      </div>
    </div>
  )
}