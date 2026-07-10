'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CategoriaDisponible } from '@/src/features/(business)/inventory/hooks/useInventory'

interface NewCategoryProps {
  mostrar:               boolean
  onCerrar:              () => void
  nombre:                string
  setNombre:             (v: string) => void
  icono:                 string
  setIcono:              (v: string) => void
  categoriasDisponibles: CategoriaDisponible[]
  onGuardar:             () => Promise<boolean>
  guardando:             boolean
  error:                 string | null
}

export default function NewCategory({
  mostrar, onCerrar, nombre, setNombre, icono, setIcono,
  categoriasDisponibles, onGuardar, guardando, error,
}: NewCategoryProps) {
  return (
    <Dialog open={mostrar} onOpenChange={(open) => { if (!open) onCerrar() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nueva categoría</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-nombre" className="text-sm">Nombre</Label>
            <Input
              id="cat-nombre"
              placeholder="Ej. Bebidas, Postres, Ferretería..."
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          {categoriasDisponibles.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Sugerencias</Label>
              <div className="flex flex-wrap gap-1.5">
                {categoriasDisponibles.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setNombre(c.nombre); setIcono(c.icono) }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      nombre === c.nombre
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-accent text-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button variant="secondary" className="flex-1 rounded-2xl font-bold" onClick={onCerrar} disabled={guardando}>
              Cancelar
            </Button>
            <Button className="flex-1 rounded-2xl font-bold" onClick={onGuardar} disabled={guardando}>
              {guardando ? 'Creando...' : 'Crear categoría'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}