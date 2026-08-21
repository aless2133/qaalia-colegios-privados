'use client'

import { Card } from '@/components/landing/card'
import { Flash } from 'iconsax-react'

export default function Details() {
  return (
    <Card className="relative overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-card to-card px-6 py-8 flex flex-col items-center text-center gap-2">
      <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center mb-1">
        <Flash size={22} color="currentColor" variant="Bold" className="text-primary" />
      </div>

      <h2 className="text-xl font-black text-foreground">Empieza a automatizar hoy</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Prueba cualquier plan gratis por 7 días. No se te cobra nada hasta que termine tu periodo de prueba.
      </p>
    </Card>
  )
}