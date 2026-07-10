'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { GalleryAdd } from 'iconsax-react'
import type { Categoria, ProductoForm } from '@/src/features/(business)/inventory/hooks/useInventory'

interface NewProductProps {
  mostrar:      boolean
  onCerrar:     () => void
  editando:     boolean
  form:         ProductoForm
  setForm:      Dispatch<SetStateAction<ProductoForm>>
  categorias:   Categoria[]
  fotoPreview:  string | null
  onFotoChange: (file: File) => void
  onGuardar:    () => Promise<boolean>
  guardando:    boolean
  error:        string | null
}

export default function NewProduct({
  mostrar, onCerrar, editando, form, setForm, categorias,
  fotoPreview, onFotoChange, onGuardar, guardando, error,
}: NewProductProps) {
  const set = (k: keyof ProductoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value
      const value = (k === 'precio' || k === 'stock') ? Number(raw) : raw
      setForm(prev => ({ ...prev, [k]: value }))
    }

  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editando ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Foto */}
          <label className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-accent border border-dashed border-border cursor-pointer overflow-hidden mx-auto">
            {fotoPreview ? (
              <img src={fotoPreview} alt="Foto producto" className="w-full h-full object-cover" />
            ) : (
              <GalleryAdd size={22} color="currentColor" className="text-muted-foreground" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onFotoChange(f) }}
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-nombre" className="text-sm">Nombre</Label>
            <Input id="p-nombre" placeholder="Ej. Coca-Cola 500ml" value={form.nombre} onChange={set('nombre')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Categoría</Label>
            <Select
              value={form.categoria_id}
              onValueChange={(v) => setForm(prev => ({ ...prev, categoria_id: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
              <SelectContent>
                {categorias.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-precio" className="text-sm">Precio</Label>
              <Input id="p-precio" type="number" min={0} step="0.01" value={form.precio} onChange={set('precio')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-stock" className="text-sm">Stock</Label>
              <Input id="p-stock" type="number" min={0} value={form.stock} onChange={set('stock')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-desc" className="text-sm">
              Descripción <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea id="p-desc" rows={2} className="resize-none" value={form.descripcion} onChange={set('descripcion')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-codigo" className="text-sm">
              Código de barras <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input id="p-codigo" value={form.codigo_barras} onChange={set('codigo_barras')} />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button variant="secondary" className="flex-1 rounded-2xl font-bold" onClick={onCerrar} disabled={guardando}>
              Cancelar
            </Button>
            <Button className="flex-1 rounded-2xl font-bold" onClick={onGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}