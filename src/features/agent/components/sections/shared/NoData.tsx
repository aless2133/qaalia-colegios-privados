'use client'

import { Warning2 } from 'iconsax-react'

export default function NoData() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-[40px] bg-accent flex items-center justify-center mb-4">
        <Warning2 size={28} color="currentColor" className="text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">
        Este negocio no existe o el enlace es inválido
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        Verifica que el enlace esté escrito correctamente.
      </p>
    </div>
  )
}