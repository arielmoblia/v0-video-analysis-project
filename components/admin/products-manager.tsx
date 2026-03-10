"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Package, Copy, FileSpreadsheet } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MultiImageUpload } from "./multi-image-upload"
import { CsvImporter } from "./csv-importer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_at_price?: number
  image_url?: string
  images?: string[]
  sizes?: { size: string; stock: number }[]
  category_id?: string
  active: boolean
  display_order?: number
}

interface Category {
  id: string
  name: string
}

interface ProductsManagerProps {
  storeId: string
  template?: string
  customVariants?: { name: string; options: string[] }[]
  hasCustomVariantsFeature?: boolean
  hasMultiImagesFeature?: boolean
  hasCsvImportFeature?: boolean
}

// Variantes segun el template
const TEMPLATE_VARIANTS: Record<string, { label: string; options: string[]; type: "sizes" | "specs" | "volumes" | "custom" }> = {
  zapatos: {
    label: "Talles disponibles",
    options: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
    type: "sizes"
  },
  footwear: {
    label: "Talles disponibles",
    options: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
    type: "sizes"
  },
  ropa: {
    label: "Talles disponibles", 
    options: ["S", "M", "L", "XL", "XXL", "UNICO"],
    type: "sizes"
  },
  clothing: {
    label: "Talles disponibles", 
    options: ["S", "M", "L", "XL", "XXL", "UNICO"],
    type: "sizes"
  },
  perfumes: {
    label: "Presentaciones",
    options: ["1oz", "2oz", "4oz", "30ml", "50ml", "100ml", "200ml", "500ml", "1L"],
    type: "volumes"
  },
  cosmeticos: {
    label: "Presentaciones (liquidos)",
    options: ["1oz", "2oz", "4oz", "50ml", "100ml", "200ml", "500ml", "1L", "50cm³", "100cm³"],
    type: "volumes"
  },
  cosmetics: {
    label: "Presentaciones (liquidos)",
    options: ["1oz", "2oz", "4oz", "50ml", "100ml", "200ml", "500ml", "1L", "50cm³", "100cm³"],
    type: "volumes"
  },
  electronicos: {
    label: "Especificaciones",
    options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
    type: "specs"
  },
  electronics: {
    label: "Especificaciones",
    options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
    type: "specs"
  },
  variants: {
    label: "Variantes personalizadas",
    options: [],
    type: "custom"
  },
  default: {
    label: "Variantes",
    options: ["S", "M", "L", "XL"],
    type: "sizes"
  }
}

interface SizeStock {
  size: string
  stock: number
  price?: number // Para electronicos y cosmeticos que pueden tener precios diferentes
}

export function ProductsManager({ storeId, template = "default", customVariants, hasCustomVariantsFeature, hasMultiImagesFeature, hasCsvImportFeature }: ProductsManagerProps) {
  // Obtener configuracion de variantes segun el template
  const templateConfig = TEMPLATE_VARIANTS[template] || TEMPLATE_VARIANTS.default
  
  // Determinar si tiene variantes personalizadas disponibles
  const hasCustom = hasCustomVariantsFeature && customVariants && customVariants.length > 0
  // Extraer nombres de opciones - cada opcion es {id, name, stock}
  const customOptions = hasCustom 
    ? (customVariants || []).flatMap((v: any) => (v.options || []).map((o: any) => typeof o === "string" ? o : o.name))
    : []
  
  // Modo de variantes: "standard" = del template, "custom" = personalizadas, "both" = ambas
  const [variantMode, setVariantMode] = useState<"standard" | "custom" | "both">("standard")
  
  // Calcular las opciones segun el modo elegido
  const getVariantConfig = () => {
    if (variantMode === "custom" && hasCustom) {
      return { label: "Variantes personalizadas", options: customOptions, type: "sizes" as const }
    }
    if (variantMode === "both" && hasCustom) {
      // Combinar opciones del template + personalizadas (sin duplicados)
      const combined = [...new Set([...templateConfig.options, ...customOptions])]
      return { label: `${templateConfig.label} + Personalizadas`, options: combined, type: templateConfig.type }
    }
    return templateConfig
  }
  
  const variantConfig = getVariantConfig()
  const AVAILABLE_SIZES = variantConfig.options
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showCsvImporter, setShowCsvImporter] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compare_at_price: "",
    images: [] as string[],
    category_id: "",
    sizeStocks: [] as SizeStock[],
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [storeId])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/admin/products?storeId=${storeId}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/admin/categories?storeId=${storeId}`)
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const toggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizeStocks.find((s) => s.size === size)
      if (exists) {
        return {
          ...prev,
          sizeStocks: prev.sizeStocks.filter((s) => s.size !== size),
        }
      } else {
        return {
          ...prev,
          sizeStocks: [...prev.sizeStocks, { size, stock: 1 }].sort((a, b) => Number(a.size) - Number(b.size)),
        }
      }
    })
  }

  const updateSizeStock = (size: string, stock: number) => {
    setFormData((prev) => ({
      ...prev,
      sizeStocks: prev.sizeStocks.map((s) => (s.size === size ? { ...s, stock } : s)),
    }))
  }

  const updateSizePrice = (size: string, price: number) => {
    setFormData((prev) => ({
      ...prev,
      sizeStocks: prev.sizeStocks.map((s) => (s.size === size ? { ...s, price } : s)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      storeId: storeId,
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      compare_price: formData.compare_at_price ? Number.parseFloat(formData.compare_at_price) : null,
      image_url: formData.images[0] || null, // Primera imagen como principal
      images: formData.images.length > 0 ? formData.images : null, // Todas las imagenes
      category_id: formData.category_id && formData.category_id !== "none" ? formData.category_id : null,
      sizes: formData.sizeStocks.length > 0 ? formData.sizeStocks : null,
      id: editingProduct?.id,
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        fetchProducts()
        setDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    let sizeStocks: SizeStock[] = []
    if (product.sizes) {
      if (Array.isArray(product.sizes)) {
        if (typeof product.sizes[0] === "string") {
          sizeStocks = (product.sizes as unknown as string[]).map((s) => ({ size: s, stock: 1 }))
        } else {
          sizeStocks = product.sizes as SizeStock[]
        }
      }
    }
    // Convertir image_url antiguo a array si existe
    const images = product.images?.length 
      ? product.images 
      : product.image_url 
        ? [product.image_url] 
        : []
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || "",
      images,
      category_id: product.category_id || "",
      sizeStocks,
    })
    setDialogOpen(true)
  }

  const handleDuplicate = (product: Product) => {
    // No setear editingProduct para que cree uno nuevo
    setEditingProduct(null)
    let sizeStocks: SizeStock[] = []
    if (product.sizes) {
      if (Array.isArray(product.sizes)) {
        if (typeof product.sizes[0] === "string") {
          sizeStocks = (product.sizes as unknown as string[]).map((s) => ({ size: s, stock: 1 }))
        } else {
          sizeStocks = product.sizes as SizeStock[]
        }
      }
    }
    const images = product.images?.length 
      ? product.images 
      : product.image_url 
        ? [product.image_url] 
        : []
    setFormData({
      name: `${product.name} (copia)`,
      description: product.description || "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || "",
      images,
      category_id: product.category_id || "",
      sizeStocks,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      compare_at_price: "",
      images: [],
      category_id: "",
      sizeStocks: [],
    })
  }

  const getTotalStock = (sizes: SizeStock[] | string[] | undefined) => {
    if (!sizes || !Array.isArray(sizes)) return 0
    if (typeof sizes[0] === "string") return sizes.length
    return (sizes as SizeStock[]).reduce((acc, s) => acc + (s.stock || 0), 0)
  }

  const handleOrderChange = async (productId: string, newOrder: number) => {
    try {
      await fetch("/api/admin/products/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, displayOrder: newOrder }),
      })
      // Actualizar localmente
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, display_order: newOrder } : p
      ))
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return null
    const category = categories.find((c) => c.id === categoryId)
    return category?.name
  }

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>
  }

  if (showCsvImporter) {
    return (
      <CsvImporter
        storeId={storeId}
        onClose={() => {
          setShowCsvImporter(false)
          fetchProducts()
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light tracking-wide">Productos</h2>
        <div className="flex gap-2">
          {hasCsvImportFeature && (
            <Button
              variant="outline"
              onClick={() => setShowCsvImporter(true)}
              className="bg-transparent"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
          )}
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-neutral-800">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Imagenes del producto</Label>
                  {hasMultiImagesFeature ? (
                    <>
                      <p className="text-xs text-muted-foreground mb-2">
                        Podes subir hasta 5 imagenes. La primera sera la principal.
                      </p>
                      <div className="mt-2">
                        <MultiImageUpload
                          value={formData.images}
                          onChange={(urls) => setFormData({ ...formData, images: urls })}
                          maxImages={5}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mb-2">
                        Subi la imagen principal del producto.
                      </p>
                      <div className="mt-2">
                        <MultiImageUpload
                          value={formData.images}
                          onChange={(urls) => setFormData({ ...formData, images: urls })}
                          maxImages={1}
                        />
                      </div>
                      <p className="text-xs text-orange-600 mt-2">
                        Queres agregar mas imagenes? Activa la Galeria de Imagenes en el Plan Cositas por solo $1/mes
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin categoría</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      No hay categorías creadas. Crealas en la pestaña Categorías.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-green-600 font-medium">Precio final (con descuento)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="Ej: 90"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Este es el precio que paga el cliente</p>
                  </div>
                  <div>
                    <Label htmlFor="compare_at_price" className="text-red-500">Precio anterior (sin descuento)</Label>
                    <Input
                      id="compare_at_price"
                      type="number"
                      step="0.01"
                      value={formData.compare_at_price}
                      onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                      placeholder="Ej: 100"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Se muestra tachado (debe ser mayor)</p>
                  </div>
                </div>

                <div>
                  {/* Selector de modo de variantes - solo si tiene la feature */}
                  {hasCustom && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg border">
                      <Label className="text-sm font-medium mb-2 block">Tipo de variantes</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => { setVariantMode("standard"); setFormData(prev => ({ ...prev, sizeStocks: [] })) }}
                          className={`text-xs p-2 rounded-md border transition-colors ${
                            variantMode === "standard"
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          Estandar
                        </button>
                        <button
                          type="button"
                          onClick={() => { setVariantMode("custom"); setFormData(prev => ({ ...prev, sizeStocks: [] })) }}
                          className={`text-xs p-2 rounded-md border transition-colors ${
                            variantMode === "custom"
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          Personalizadas
                        </button>
                        <button
                          type="button"
                          onClick={() => { setVariantMode("both"); setFormData(prev => ({ ...prev, sizeStocks: [] })) }}
                          className={`text-xs p-2 rounded-md border transition-colors ${
                            variantMode === "both"
                              ? "bg-violet-500 text-white border-violet-500"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          Ambas
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {variantMode === "standard" && `Usa las variantes del template: ${templateConfig.options.slice(0, 5).join(", ")}...`}
                        {variantMode === "custom" && `Usa tus variantes personalizadas: ${customOptions.slice(0, 5).join(", ")}${customOptions.length > 5 ? "..." : ""}`}
                        {variantMode === "both" && "Combina las variantes del template con las personalizadas"}
                      </p>
                    </div>
                  )}
                  
                  <Label>{variantConfig.label}</Label>
                  <p className="text-xs text-neutral-500 mb-2">
                    {variantConfig.type === "specs" 
                      ? "Selecciona las especificaciones. Podes poner precio diferente para cada una."
                      : variantConfig.type === "volumes"
                      ? "Selecciona las presentaciones. Podes poner precio diferente para cada una."
                      : "Selecciona los talles/variantes y escribi el stock de cada uno"
                    }
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {AVAILABLE_SIZES.map((size) => {
                      const sizeData = formData.sizeStocks.find((s) => s.size === size)
                      const isSelected = !!sizeData
                      return (
                        <div key={size} className="flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`
                              w-full min-w-12 h-12 rounded-md border text-sm font-medium transition-colors px-2
                              ${
                                isSelected
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                              }
                            `}
                          >
                            {size}
                          </button>
                          {isSelected && (
                            <div className="flex flex-col gap-1 mt-1 w-full">
                              <Input
                                type="number"
                                min="0"
                                value={sizeData.stock}
                                onChange={(e) => updateSizeStock(size, Number.parseInt(e.target.value) || 0)}
                                className="w-full h-7 text-center text-xs p-1"
                                placeholder="Stock"
                              />
                              {(variantConfig.type === "specs" || variantConfig.type === "volumes") && (
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={sizeData.price || ""}
                                  onChange={(e) => updateSizePrice(size, Number.parseFloat(e.target.value) || 0)}
                                  className="w-full h-7 text-center text-xs p-1"
                                  placeholder="$ Precio"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {formData.sizeStocks.length > 0 && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Seleccionadas: {formData.sizeStocks.map((s) => 
                        variantConfig.type === "specs" || variantConfig.type === "volumes"
                          ? `${s.size}(${s.stock}${s.price ? ` - $${s.price}` : ""})`
                          : `${s.size}(${s.stock})`
                      ).join(", ")}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-neutral-800">
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">No hay productos todavía</p>
            <p className="text-sm text-neutral-400">Creá tu primer producto para empezar a vender</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-neutral-500">
                <th className="pb-3 font-medium w-16">Orden</th>
                <th className="pb-3 font-medium">Imagen</th>
                <th className="pb-3 font-medium">Nombre</th>
                <th className="pb-3 font-medium">Categoria</th>
                <th className="pb-3 font-medium">Precio</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Tallas</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-b hover:bg-neutral-50">
                  <td className="py-3">
                    <input
                      type="number"
                      min="1"
                      value={product.display_order || index + 1}
                      onChange={(e) => handleOrderChange(product.id, Number.parseInt(e.target.value) || 1)}
                      className="w-12 h-8 text-center text-red-600 font-bold border border-red-200 rounded focus:border-red-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/images/placeholders/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                        <Package className="w-6 h-6 text-neutral-300" />
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="py-3">
                    {getCategoryName(product.category_id) ? (
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                        {getCategoryName(product.category_id)}
                      </span>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${product.price.toLocaleString()}</span>
                      {product.compare_at_price && (
                        <span className="text-sm text-neutral-400 line-through">
                          ${product.compare_at_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm">{getTotalStock(product.sizes)}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-neutral-500">
                      {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
                        ? typeof product.sizes[0] === "string"
                          ? (product.sizes as unknown as string[]).join(", ")
                          : (product.sizes as SizeStock[]).map((s) => s.size).join(", ")
                        : "-"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleDuplicate(product)} title="Duplicar">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)} title="Editar">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
