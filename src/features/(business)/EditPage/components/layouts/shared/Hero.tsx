'use client'

import { Card, CardContent } from '@/components/ui/card'
import { GalleryAdd } from 'iconsax-react'
import type { EditPagePerfil, TipografiaOption } from '@/src/features/(business)/EditPage/hooks/useEditPageAgent'

interface HeroProps {
  perfil:         EditPagePerfil
  fotoPreview:    string | null
  tipografias:    TipografiaOption[]
  negocioNombre?: string
}

export default function Hero({ perfil, fotoPreview, tipografias, negocioNombre }: HeroProps) {
  const fontFamily = tipografias.find(t => t.slug === perfil.tipografia_slug)?.font_family

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-black text-foreground leading-tight">Personaliza tu página</h1>
        <p className="text-sm text-muted-foreground">
          Así se verá para tus clientes.
        </p>
      </div>

      <Card className="overflow-hidden border border-border py-0 gap-0">
        <div className="h-20 w-full" style={{ background: perfil.color_marca }} />

        <CardContent className="px-5 pb-5 -mt-8 flex flex-col items-center gap-3 text-center">
          <div className="w-18 h-18 rounded-full border-4 border-card bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
            {fotoPreview ? (
              <img src={fotoPreview} alt={negocioNombre ?? 'Negocio'} className="w-full h-full object-cover" />
            ) : (
              <GalleryAdd size={22} color="currentColor" className="text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col gap-1" style={{ fontFamily }}>
            <p className="text-sm font-bold text-foreground">
              {negocioNombre ?? 'Tu negocio'}
            </p>

            {perfil.mensaje_bienvenida && (
              <p className="text-xs font-medium text-foreground">
                {perfil.mensaje_bienvenida}
              </p>
            )}

            {perfil.descripcion && (
              <p className="text-xs text-muted-foreground max-w-sm">
                {perfil.descripcion}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}