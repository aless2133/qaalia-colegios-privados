'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Text, TextBlock } from 'iconsax-react'
import ColorsBranding from '@/src/features/(business)/EditPage/components/cards/shared/BrandingColors'
import type { EditPagePerfil, TipografiaOption } from '@/src/features/(business)/EditPage/hooks/useEditPageAgent'

interface MarcaProps {
  perfil:      EditPagePerfil
  setPerfil:   (fn: (prev: EditPagePerfil) => EditPagePerfil) => void
  tipografias: TipografiaOption[]
}

export default function Marca({ perfil, setPerfil, tipografias }: MarcaProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Color de marca */}
      <Card className="bg-card border border-border py-0 gap-0 overflow-hidden">
        <ColorsBranding perfil={perfil} setPerfil={setPerfil} />
      </Card>

      {/* Tipografía */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TextBlock size={16} color="currentColor" className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Tipografía</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Elige el estilo de letra de tu página. Verás cómo se ve antes de elegir.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {tipografias.length === 0 && (
            <p className="text-xs text-muted-foreground">No hay tipografías disponibles.</p>
          )}

          {tipografias.map((tipo) => {
            const active = perfil.tipografia_slug === tipo.slug
            return (
              <button
                key={tipo.slug}
                onClick={() => setPerfil(prev => ({ ...prev, tipografia_slug: tipo.slug }))}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:bg-accent'
                }`}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-semibold text-foreground">{tipo.nombre}</span>
                  <span
                    className="text-base text-foreground truncate"
                    style={{ fontFamily: tipo.font_family }}
                  >
                    Vista previa del estilo
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    active ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}
                />
              </button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}