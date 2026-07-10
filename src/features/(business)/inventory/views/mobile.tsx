'use client'

import { useInventory } from '@/src/features/(business)/inventory/hooks/useInventory'
import Hero        from '@/src/features/(business)/inventory/components/layouts/shared/Hero'
import Core        from '@/src/features/(business)/inventory/components/layouts/shared/Core'
import NewCategory from '@/src/features/(business)/inventory/components/modals/shared/NewCategory'
import NewProduct  from '@/src/features/(business)/inventory/components/modals/shared/NewProduct'

export default function InventoryMobile() {
  const inv = useInventory()

  const handleNuevoProducto = () => {
    if (inv.categorias.length === 0) inv.abrirModalCategoria()
    else inv.abrirModalProducto()
  }

  return (
    <main className="px-4 pt-5 pb-24">
      <div className="flex flex-col gap-5">
        <Hero total={inv.productos.length} loading={inv.loading} onNuevoProducto={handleNuevoProducto} />
        <Core inv={inv} />
      </div>

      <NewCategory
        mostrar={inv.modalCategoriaOpen}
        onCerrar={inv.cerrarModalCategoria}
        nombre={inv.nombreCategoria}
        setNombre={inv.setNombreCategoria}
        icono={inv.iconoCategoria}
        setIcono={inv.setIconoCategoria}
        categoriasDisponibles={inv.categoriasDisponibles}
        onGuardar={inv.crearCategoria}
        guardando={inv.guardandoCategoria}
        error={inv.errorCategoria}
      />

      <NewProduct
        mostrar={inv.modalProductoOpen}
        onCerrar={inv.cerrarModalProducto}
        editando={!!inv.productoEditar}
        form={inv.form}
        setForm={inv.setForm}
        categorias={inv.categorias}
        fotoPreview={inv.fotoPreview}
        onFotoChange={inv.handleFotoChange}
        onGuardar={inv.guardarProducto}
        guardando={inv.guardandoProducto}
        error={inv.errorProducto}
      />
    </main>
  )
}