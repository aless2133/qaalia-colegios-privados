'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'iconsax-react'
import Hero from '@/src/features/(business)/EditPage/components/layouts/shared/Hero'
import Core from '@/src/features/(business)/EditPage/components/layouts/shared/Core'
import { useEditPageAgent } from '@/src/features/(business)/EditPage/hooks/useEditPageAgent'

interface EditPageAgentProps {
  onClose?: () => void
}

export default function EditPageAgent({ onClose }: EditPageAgentProps) {
  const router = useRouter()
  const {
    negocio,
    perfil, setPerfil,
    fotoPreview, actualizarFoto,
    tipografias,
    loading, guardando, guardado, error,
    guardarCambios,
  } = useEditPageAgent()

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Header fijo */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 lg:px-0 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => (onClose ? onClose() : router.back())}
            disabled={guardando}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0 disabled:opacity-40"
          >
            <ArrowLeft size={20} color="currentColor" />
          </button>
          <h1 className="text-base font-bold text-foreground">Editar página</h1>
          <Button
            size="sm"
            className="rounded-2xl font-bold"
            onClick={() => guardarCambios()}
            disabled={guardando || loading}
          >
            {guardando ? 'Guardando...' : guardado ? 'Guardado' : 'Guardar'}
          </Button>
        </div>
        <div className="max-w-4xl mx-auto px-8">
          <div className="border-b border-border" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-6 flex flex-col gap-8 pb-24">
        <Hero
          perfil={perfil}
          fotoPreview={fotoPreview}
          tipografias={tipografias}
          negocioNombre={negocio?.nombre}
        />

        <Core
          perfil={perfil}
          setPerfil={setPerfil}
          fotoPreview={fotoPreview}
          actualizarFoto={actualizarFoto}
          tipografias={tipografias}
          loading={loading}
        />

        {error && (
          <p className="text-xs font-medium text-destructive text-center">{error}</p>
        )}
      </div>
    </div>
  )
}