'use client'

import { DocumentText, SearchNormal1 } from 'iconsax-react'

interface EmptyActivityProps {
  sinActividades: boolean
  busqueda:       string
}

export default function EmptyActivity({ sinActividades, busqueda }: EmptyActivityProps) {
  const Icon = sinActividades ? DocumentText : SearchNormal1

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
        <Icon size={22} color="currentColor" className="text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">
        {sinActividades ? 'Aún no hay actividades disponibles' : 'Sin resultados'}
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
        {sinActividades
          ? 'Este negocio todavía no ha publicado ninguna actividad para solicitar.'
          : `No encontramos actividades que coincidan con "${busqueda}".`}
      </p>
    </div>
  )
}