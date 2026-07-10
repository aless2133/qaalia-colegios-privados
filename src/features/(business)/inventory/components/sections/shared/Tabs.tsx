'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AddCircle } from 'iconsax-react'
import type { Categoria } from '@/src/features/(business)/inventory/hooks/useInventory'

interface TabsProps {
  categorias:       Categoria[]
  categoriaActiva:  string | null
  onSelect:         (id: string | null) => void
  onNuevaCategoria: () => void
}

export default function InventoryTabs({ categorias, categoriaActiva, onSelect, onNuevaCategoria }: TabsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0 overflow-x-auto hide-scrollbar">
        <Tabs
          value={categoriaActiva ?? 'todos'}
          onValueChange={(v) => onSelect(v === 'todos' ? null : v)}
        >
          <TabsList className="bg-accent w-max">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            {categorias.map(c => (
              <TabsTrigger key={c.id} value={c.id}>{c.nombre}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Button
        size="icon"
        variant="outline"
        onClick={onNuevaCategoria}
        className="rounded-full h-9 w-9 flex-shrink-0"
      >
        <AddCircle size={16} color="currentColor" />
      </Button>
    </div>
  )
}