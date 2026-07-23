'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'iconsax-react'

export default function Hero() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} color="currentColor" />
          </button>
          <h1 className="text-base font-bold text-foreground">Personalizar agente</h1>
          <div className="w-9 h-9 flex-shrink-0" />
        </div>
        <div className="border-b border-border" />
      </div>

      <div>
        <h1 className="text-2xl font-black text-foreground leading-tight">Configura tu agente</h1>
        <p className="text-sm text-muted-foreground">Así se verá para tus clientes.</p>
      </div>
    </div>
  )
}