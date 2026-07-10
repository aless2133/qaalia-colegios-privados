'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useBusiness } from '@/src/features/(business)/dashboard/hooks/useBusiness'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export interface Categoria {
  id:              string
  nombre:          string
  icono:           string
  total_productos?: number
}

export interface CategoriaDisponible {
  id:     number
  nombre: string
  icono:  string
}

export interface Producto {
  id:               string
  nombre:           string
  descripcion:      string | null
  precio:           number
  stock:            number
  foto_url:         string
  codigo_barras:    string | null
  activo:           boolean
  categoria_id:     string
  categoria_nombre: string
  categoria_icono:  string
}

export interface ProductoForm {
  id?:           string
  categoria_id:  string
  nombre:        string
  precio:        number
  stock:         number
  foto_url:      string
  descripcion:   string
  codigo_barras: string
}

const FORM_VACIO: ProductoForm = {
  categoria_id:  '',
  nombre:        '',
  precio:        0,
  stock:         0,
  foto_url:      '',
  descripcion:   '',
  codigo_barras: '',
}

export function useInventory() {
  const supabase = createClient()

  const negocioActivo = useBusiness()
  const negocioId     = negocioActivo?.id ?? null
  const loadingNeg    = !negocioActivo
  const queryClient   = useQueryClient()

  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)

  const { data: menuData, isLoading: loadingMenu } = useQuery({
    queryKey: ['inventario', negocioId],
    queryFn:  async () => {
      if (!negocioId) return { categorias: [] as Categoria[], productos: [] as Producto[] }
const { data } = await supabase.rpc('obtener_inventario_negocio', { p_negocio_id: negocioId })
      return {
        categorias: (data?.categorias ?? []) as Categoria[],
        productos:  (data?.productos  ?? []) as Producto[],
      }
    },
    enabled:   !!negocioId,
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 10,
  })

  const categorias = menuData?.categorias ?? []
  const productos  = menuData?.productos  ?? []

  const productosVisibles = categoriaActiva
    ? productos.filter(p => p.categoria_id === categoriaActiva)
    : productos

  const fetchInventario = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['inventario', negocioId] })
  }, [negocioId, queryClient])

  useEffect(() => {
    if (!negocioId) return
    const channel = supabase
      .channel(`inventario-${negocioId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'productos_inventario',
        filter: `negocio_id=eq.${negocioId}`,
      }, () => fetchInventario())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'categorias_inventario',
        filter: `negocio_id=eq.${negocioId}`,
      }, () => fetchInventario())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'stock_ubicacion',
      }, () => fetchInventario())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [negocioId, fetchInventario])

  // ── Categorías ───────────────────────────────────────
  const [modalCategoriaOpen,     setModalCategoriaOpen]     = useState(false)
  const [categoriasDisponibles,  setCategoriasDisponibles]  = useState<CategoriaDisponible[]>([])
  const [nombreCategoria,        setNombreCategoria]        = useState('')
  const [iconoCategoria,         setIconoCategoria]         = useState('Category')
  const [guardandoCategoria,     setGuardandoCategoria]     = useState(false)
  const [errorCategoria,         setErrorCategoria]         = useState<string | null>(null)

 const abrirModalCategoria = () => {
    setErrorCategoria(null)
    setNombreCategoria('')
    setIconoCategoria('Category')
    setModalCategoriaOpen(true)
    // Servys no tiene catálogo de sugerencias (eso era solo del menú de
    // restaurante). categoriasDisponibles queda vacío; NewCategory.tsx ya
    // oculta esa sección cuando length === 0, no rompe nada.
  }
  const cerrarModalCategoria = () => {
    if (guardandoCategoria) return
    setModalCategoriaOpen(false)
  }

  const crearCategoria = async () => {
    if (!negocioId) return false
    if (!nombreCategoria.trim()) { setErrorCategoria('El nombre es obligatorio'); return false }

    setGuardandoCategoria(true)
  const { data } = await supabase.rpc('crear_categoria_inventario', {
      p_negocio_id: negocioId,
      p_nombre:     nombreCategoria.trim(),
      p_icono:      iconoCategoria,
    })
    setGuardandoCategoria(false)

    if (!data?.exito) { setErrorCategoria(data?.error || 'Error al guardar'); return false }
    cerrarModalCategoria()
    fetchInventario()
    return true
  }

  const eliminarCategoria = async (categoriaId: string) => {
    if (!negocioId) return { exito: false, error: 'Sin negocio' }
 const { data, error } = await supabase.rpc('eliminar_categoria_inventario', {
      p_negocio_id:   negocioId,
      p_categoria_id: categoriaId,
    })
    if (error) return { exito: false, error: error.message }
    if (!data?.exito) return { exito: false, error: data?.error || 'Error al eliminar' }

    if (categoriaActiva === categoriaId) setCategoriaActiva(null)
    fetchInventario()
    return { exito: true }
  }

  // ── Productos ────────────────────────────────────────
  const [modalProductoOpen,  setModalProductoOpen]  = useState(false)
  const [productoEditar,     setProductoEditar]     = useState<Producto | null>(null)
  const [form,               setForm]               = useState<ProductoForm>(FORM_VACIO)
  const [fotoFile,           setFotoFile]           = useState<File | null>(null)
  const [fotoPreview,        setFotoPreview]        = useState<string | null>(null)
  const [guardandoProducto,  setGuardandoProducto]  = useState(false)
  const [errorProducto,      setErrorProducto]      = useState<string | null>(null)

  const abrirModalProducto = (producto?: Producto) => {
    setErrorProducto(null)
    setFotoFile(null)
    if (producto) {
      setProductoEditar(producto)
      setFotoPreview(producto.foto_url)
      setForm({
        id:            producto.id,
        categoria_id:  producto.categoria_id,
        nombre:        producto.nombre,
        precio:        producto.precio,
        stock:         producto.stock,
        foto_url:      producto.foto_url,
        descripcion:   producto.descripcion || '',
        codigo_barras: producto.codigo_barras || '',
      })
    } else {
      setProductoEditar(null)
      setFotoPreview(null)
      setForm({ ...FORM_VACIO, categoria_id: categoriaActiva ?? categorias[0]?.id ?? '' })
    }
    setModalProductoOpen(true)
  }

  const cerrarModalProducto = () => {
    if (guardandoProducto) return
    setModalProductoOpen(false)
    setProductoEditar(null)
    setFotoFile(null)
    setFotoPreview(null)
    setErrorProducto(null)
  }

  const handleFotoChange = (file: File) => {
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  const guardarProducto = async () => {
    if (!negocioId) return false
    setErrorProducto(null)
    if (!form.nombre.trim())          { setErrorProducto('El nombre es obligatorio'); return false }
    if (!form.categoria_id)           { setErrorProducto('Selecciona una categoría'); return false }
    if (form.precio < 0)              { setErrorProducto('El precio no puede ser negativo'); return false }
    if (form.stock < 0)               { setErrorProducto('El stock no puede ser negativo'); return false }
    if (!fotoFile && !form.foto_url)  { setErrorProducto('La foto del producto es obligatoria'); return false }

    setGuardandoProducto(true)

    let fotoUrl = form.foto_url
    if (fotoFile) {
      const ext  = fotoFile.name.split('.').pop() || 'jpg'
      const path = `${negocioId}/${Date.now()}.${ext}`
      const { data: up, error: upErr } = await supabase.storage
        .from('foto-producto').upload(path, fotoFile, { upsert: true })
      if (!upErr && up) {
        const { data: { publicUrl } } = supabase.storage.from('foto-producto').getPublicUrl(up.path)
        fotoUrl = publicUrl
      }
    }

const { data } = await supabase.rpc('crear_producto_inventario', {
      p_negocio_id:   negocioId,
      p_categoria_id: form.categoria_id,
      p_nombre:       form.nombre.trim(),
      p_precio:       form.precio,
      p_stock:        form.stock,
      p_foto_url:     fotoUrl,
      p_descripcion:  form.descripcion || null,
      p_sku:          form.codigo_barras || null,
      p_producto_id:  form.id || null,
    })
    setGuardandoProducto(false)
    if (!data?.exito) { setErrorProducto(data?.error || 'Error al guardar'); return false }
    cerrarModalProducto()
    fetchInventario()
    return true
  }

  const toggleProducto = async (productoId: string, activo: boolean) => {
    if (!negocioId) return
    queryClient.setQueryData(['inventario', negocioId], (old: typeof menuData) =>
      old ? { ...old, productos: old.productos.map(p => p.id === productoId ? { ...p, activo } : p) } : old
    )
await supabase.rpc('toggle_producto_inventario_activo', { p_negocio_id: negocioId, p_producto_id: productoId })
  }

  const loading = loadingNeg || loadingMenu

  return {
    loading, negocioId,
    categorias, productos, productosVisibles,
    categoriaActiva, setCategoriaActiva,

    modalCategoriaOpen, abrirModalCategoria, cerrarModalCategoria,
    categoriasDisponibles, nombreCategoria, setNombreCategoria,
    iconoCategoria, setIconoCategoria,
    crearCategoria, guardandoCategoria, errorCategoria,
    eliminarCategoria,

    modalProductoOpen, abrirModalProducto, cerrarModalProducto,
    productoEditar, form, setForm,
    fotoPreview, handleFotoChange,
    guardarProducto, guardandoProducto, errorProducto, setErrorProducto,
    toggleProducto,

    refetch: fetchInventario,
  }
}