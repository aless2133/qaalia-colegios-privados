'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAgentSettings } from '@/src/features/(business)/AgentSettings/hooks/useAgentSettings'
import { GalleryAdd } from 'iconsax-react'

export default function Marca({ marca }: { marca: any }) {
  const { actualizarMarca } = useAgentSettings()
  const [nombre, setNombre] = useState(marca?.nombre || 'Sofia')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState(marca?.foto_url || '')
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar estados si la marca cargada cambia desde la base de datos
  useEffect(() => {
    if (marca?.nombre) setNombre(marca.nombre)
    if (marca?.foto_url) setFotoPreview(marca.foto_url)
  }, [marca])

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoFile(file)
      setFotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await actualizarMarca(nombre, fotoFile)
      setFotoFile(null) // Resetear archivo temporal tras guardar exitosamente
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <h3 className="text-sm font-semibold text-foreground">Marca del Agente</h3>
        <p className="text-xs text-muted-foreground">Dale un nombre y una cara a tu asistente.</p>
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
            className="w-16 h-16 rounded-[40px] bg-accent border border-border flex items-center justify-center overflow-hidden relative group cursor-pointer"
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Agente" className="w-full h-full object-cover" />
            ) : (
              <GalleryAdd size={28} className="text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <GalleryAdd size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-medium text-foreground">Nombre</label>
            <Input 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Sofia"
              className="h-10 bg-background"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full text-xs font-semibold">
          {isSaving ? 'Guardando...' : 'Guardar Marca'}
        </Button>
      </CardContent>
    </Card>
  )
}