'use client'

import { ProfileCircle, InfoCircle, Messages2 } from 'iconsax-react'

interface HeroProps {
  nombre:   string
  activo:   boolean
  loading:  boolean
  onInfo:   () => void
  onPerfil: () => void
}

export default function Hero({ nombre, activo, loading, onInfo, onPerfil }: HeroProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl lg:text-2xl font-black text-foreground leading-tight truncate">
          {loading ? '' : nombre}
        </h1>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-primary' : 'bg-muted-foreground'}`} />
          <p className="text-[13px] font-semibold text-muted-foreground">
            {loading ? '' : activo ? 'Activo' : 'Inactivo'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onInfo}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
        >
          <Messages2 size={24} color="currentColor" className="text-foreground" />
        </button>
        <button
          onClick={onPerfil}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
        >
          <ProfileCircle size={24} color="currentColor" className="text-foreground" />
        </button>
      </div>
    </div>
  )
}