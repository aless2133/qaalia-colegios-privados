'use client'

import { useRef } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { GalleryAdd } from 'iconsax-react'
import {
  MAX_DESCRIPCION,
  MAX_MENSAJE,
  type EditPagePerfil,
} from '@/src/features/(business)/EditPage/hooks/useEditPageAgent'

interface DetailsProps {
  perfil:         EditPagePerfil
  setPerfil:      (fn: (prev: EditPagePerfil) => EditPagePerfil) => void
  fotoPreview:    string | null
  actualizarFoto: (file: File) => void
}

export default function Details({ perfil, setPerfil, fotoPreview, actualizarFoto }: DetailsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) actualizarFoto(file)
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <h3 className="text-sm font-semibold text-foreground">Detalles</h3>
        <p className="text-xs text-muted-foreground">
          Foto, descripción y mensaje que verán tus clientes.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFotoChange}
          className="hidden"
        />

        <div className="flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-[40px] bg-accent border border-border flex items-center justify-center overflow-hidden relative group cursor-pointer flex-shrink-0"
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Negocio" className="w-full h-full object-cover" />
            ) : (
              <GalleryAdd size={28} color="currentColor" className="text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <GalleryAdd size={20} color="currentColor" className="text-white" />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-0">
            <p className="text-xs font-bold text-foreground">Foto del negocio</p>
            <p className="text-[11px] text-muted-foreground">Se mostrará en tu perfil.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Descripción corta</label>
            <span className="text-[11px] text-muted-foreground">
              {perfil.descripcion.length}/{MAX_DESCRIPCION}
            </span>
          </div>
          <Textarea
            value={perfil.descripcion}
            onChange={(e) => setPerfil(prev => ({
              ...prev,
              descripcion: e.target.value.slice(0, MAX_DESCRIPCION),
            }))}
            placeholder="Cuéntale a tus clientes de qué se trata tu negocio"
            className="rounded-2xl bg-background resize-none"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Mensaje personalizado</label>
            <span className="text-[11px] text-muted-foreground">
              {perfil.mensaje_bienvenida.length}/{MAX_MENSAJE}
            </span>
          </div>
          <Input
            value={perfil.mensaje_bienvenida}
            onChange={(e) => setPerfil(prev => ({
              ...prev,
              mensaje_bienvenida: e.target.value.slice(0, MAX_MENSAJE),
            }))}
            placeholder="Ej. ¡Bienvenido! Pide fácil y rápido"
            className="rounded-xl bg-background"
          />
        </div>
      </CardContent>
    </Card>
  )
}