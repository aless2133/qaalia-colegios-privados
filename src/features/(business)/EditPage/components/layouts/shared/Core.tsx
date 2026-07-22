'use client'

import Details from '@/src/features/(business)/EditPage/components/cards/shared/Details'
import Marca from '@/src/features/(business)/EditPage/components/cards/shared/Marca'
import type { EditPagePerfil, TipografiaOption } from '@/src/features/(business)/EditPage/hooks/useEditPageAgent'

interface CoreProps {
  perfil:         EditPagePerfil
  setPerfil:      (fn: (prev: EditPagePerfil) => EditPagePerfil) => void
  fotoPreview:    string | null
  actualizarFoto: (file: File) => void
  tipografias:    TipografiaOption[]
  loading:        boolean
}

export default function Core({
  perfil, setPerfil,
  fotoPreview, actualizarFoto,
  tipografias, loading,
}: CoreProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-pulse h-72 bg-accent rounded-3xl" />
        <div className="animate-pulse h-72 bg-accent rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Details
        perfil={perfil}
        setPerfil={setPerfil}
        fotoPreview={fotoPreview}
        actualizarFoto={actualizarFoto}
      />

      <Marca
        perfil={perfil}
        setPerfil={setPerfil}
        tipografias={tipografias}
      />
    </div>
  )
}