'use client'

import type { useInventory } from '@/src/features/(business)/inventory/hooks/useInventory'
import InventoryTabs  from '@/src/features/(business)/inventory/components/sections/shared/Tabs'
import ProductCard    from '@/src/features/(business)/inventory/components/cards/shared/ProductCard'
import EmptyInventory from '@/src/features/(business)/inventory/components/sections/shared/EmptyInventory'

interface CoreProps {
  inv: ReturnType<typeof useInventory>
}

function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <div className="aspect-square bg-accent animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3.5 w-3/4 rounded bg-accent animate-pulse" />
        <div className="h-3.5 w-1/2 rounded bg-accent animate-pulse" />
      </div>
    </div>
  )
}

export default function Core({ inv }: CoreProps) {
  const {
    loading, categorias, productos, productosVisibles,
    categoriaActiva, setCategoriaActiva,
    abrirModalCategoria, abrirModalProducto, toggleProducto,
  } = inv

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    )
  }

  if (categorias.length === 0 && productos.length === 0) {
    return <EmptyInventory onCrear={abrirModalCategoria} />
  }

  return (
    <div className="flex flex-col gap-5">
      <InventoryTabs
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelect={setCategoriaActiva}
        onNuevaCategoria={abrirModalCategoria}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {productosVisibles.map(producto => (
          <ProductCard
            key={producto.id}
            producto={producto}
            onToggle={toggleProducto}
            onEditar={abrirModalProducto}
          />
        ))}
      </div>
    </div>
  )
}