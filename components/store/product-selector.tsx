"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { seoClean } from "@/lib/utils"
import { AddToCartButton } from "./add-to-cart-button"

interface SizeWithStock {
  size: string
  stock: number
  price?: number
  exchangeRate?: number
}

interface Product {
  id: string
  name: string
  description?: string
  price: number
  compare_price?: number
  image_url?: string
  images?: string[]
  sizes?: SizeWithStock[]
}

interface ProductSelectorProps {
  product: Product
  subdomain?: string
  hasMultiImages?: boolean
  exchangeRate?: number
  template?: string
}

const categoryLabels: Record<string, string> = {
  perfumes: "Perfume",
  electronicos: "Electrónica",
  zapatos: "Calzado",
  ropa: "Indumentaria",
}

// Mapeo de colores comunes a hex
const colorMap: Record<string, string> = {
  negro: "#000000",
  black: "#000000",
  blanco: "#FFFFFF",
  white: "#FFFFFF",
  rojo: "#DC2626",
  red: "#DC2626",
  azul: "#2563EB",
  blue: "#2563EB",
  verde: "#16A34A",
  green: "#16A34A",
  "verde seco": "#6B7B5C",
  "verde oliva": "#6B8E23",
  amarillo: "#EAB308",
  yellow: "#EAB308",
  naranja: "#EA580C",
  orange: "#EA580C",
  rosa: "#EC4899",
  pink: "#EC4899",
  violeta: "#8B5CF6",
  purple: "#8B5CF6",
  gris: "#6B7280",
  gray: "#6B7280",
  grey: "#6B7280",
  marron: "#92400E",
  brown: "#92400E",
  camel: "#C19A6B",
  beige: "#D4B896",
  crema: "#FFFDD0",
  cream: "#FFFDD0",
  celeste: "#87CEEB",
  bordo: "#800020",
  burgundy: "#800020",
  coral: "#FF7F50",
  turquesa: "#40E0D0",
  turquoise: "#40E0D0",
  dorado: "#D4AF37",
  gold: "#D4AF37",
  plateado: "#C0C0C0",
  silver: "#C0C0C0",
  natural: "#E8DCC8",
  nude: "#E3BC9A",
  terracota: "#E2725B",
  mostaza: "#FFDB58",
  lavanda: "#E6E6FA",
  suela: "#8B4513",
  cuero: "#8B4513",
  leopardo: "#C19A6B",
  animal: "#C19A6B",
}

function getColorHex(colorName: string): string | null {
  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || null
}

// Detecta si un valor de variante corresponde a un talle (y no a un color),
// para no depender del orden "Talle / Color" u "Color / Talle" que define cada tienda de origen
function looksLikeTalle(value: string): boolean {
  const v = value.trim().toUpperCase()
  if (/^X{0,3}(S|M|L)$/.test(v)) return true // S, M, L, XS, XL, XXL, XXXL
  if (/^\d{1,2}X?L$/.test(v)) return true // 2XL, 3XL, 4XL
  if (/^\d{1,3}$/.test(v)) return true // talles numéricos: ropa (34-60) o calzado (20-50)
  if (/^(UNICO|ÚNICO|U|T\/U|ONE SIZE)$/.test(v)) return true
  return false
}

export function ProductSelector({ product, subdomain, hasMultiImages = false, exchangeRate = 0, template }: ProductSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [selectedTalle, setSelectedTalle] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Mostrar todas las imágenes del producto (imagen principal + secundarias)
  const allImages: string[] = []
  if (product.images && product.images.length > 0) {
    allImages.push(...product.images)
  } else if (product.image_url) {
    allImages.push(product.image_url)
  }

  // Si no hay imagenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push("/images/placeholders/placeholder.svg")
  }

  const [selectedImage, setSelectedImage] = useState(0)

  const sizes: SizeWithStock[] = product.sizes || []

  // Detectar si las variantes tienen formato "Talle / Color"
  const hasSeparatedVariants = useMemo(() => {
    if (sizes.length === 0) return false
    // Verificar si al menos el 80% tienen el formato "X / Y"
    const withSeparator = sizes.filter(s => s.size.includes(" / ")).length
    return withSeparator / sizes.length >= 0.8
  }, [sizes])

  // Extraer talles y colores únicos si están separados
  const { talles, colores, variantMap } = useMemo(() => {
    if (!hasSeparatedVariants) {
      return { talles: [] as string[], colores: [] as string[], variantMap: new Map() }
    }

    const tallesSet = new Set<string>()
    const coloresSet = new Set<string>()
    const map = new Map<string, SizeWithStock>()

    sizes.forEach(s => {
      const parts = s.size.split(" / ")
      if (parts.length >= 2) {
        const partA = parts[0].trim()
        const partB = parts.slice(1).join(" / ").trim()

        // Por defecto se asume orden "Talle / Color", pero si sólo una de las
        // dos partes matchea un patrón de talle, se usa eso para decidir cuál es cuál
        // (algunas tiendas de origen definen el orden como "Color / Talle")
        let talle = partA
        let color = partB
        if (looksLikeTalle(partB) && !looksLikeTalle(partA)) {
          talle = partB
          color = partA
        }

        tallesSet.add(talle)
        coloresSet.add(color)
        map.set(`${talle}|${color}`, s)
      }
    })

    return {
      talles: Array.from(tallesSet),
      colores: Array.from(coloresSet),
      variantMap: map
    }
  }, [sizes, hasSeparatedVariants])

  // Obtener stock para combinación talle+color
  const getVariantStock = (talle: string, color: string): number => {
    const variant = variantMap.get(`${talle}|${color}`)
    return variant?.stock || 0
  }

  // Obtener precio para combinación talle+color (si esa variante puntual tiene precio propio)
  const getVariantPrice = (talle: string, color: string): number | undefined => {
    const variant = variantMap.get(`${talle}|${color}`)
    return variant?.price
  }

  // Stock total por talle (sumando todos los colores)
  const getTalleStock = (talle: string): number => {
    return colores.reduce((acc, color) => acc + getVariantStock(talle, color), 0)
  }

  // Stock total por color (sumando todos los talles)
  const getColorStock = (color: string): number => {
    return talles.reduce((acc, talle) => acc + getVariantStock(talle, color), 0)
  }

  // Variante seleccionada actual
  const currentVariant = hasSeparatedVariants && selectedTalle && selectedColor
    ? variantMap.get(`${selectedTalle}|${selectedColor}`)
    : sizes.find(s => s.size === selectedVariant)

  const selectedSize = hasSeparatedVariants
    ? (currentVariant?.size || null)
    : selectedVariant

  const displayPrice = currentVariant?.price || product.price
  const hasSizes = sizes.length > 0
  const totalStock = hasSizes ? sizes.reduce((acc, s) => acc + (s.stock || 0), 0) : (product.stock || 0)

  const formatPrice = (price: number) => {
    if (exchangeRate > 0) return `$${(price * exchangeRate).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
    return `$${price.toLocaleString("es-AR")}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Columna izquierda: Miniaturas + Imagen principal */}
      <div className="flex gap-4 self-start">
        {/* Miniaturas verticales */}
        {allImages.length > 1 && (
          <div className="flex flex-col gap-2 flex-shrink-0">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-black"
                    : "border-transparent hover:border-neutral-300"
                }`}
              >
                <Image
                  src={img || "/images/placeholders/placeholder.svg"}
                  alt={`${product.name} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
        
        {/* Imagen principal — sin recortar: se ajusta solo el ancho y el alto sigue
            la proporción real de la foto (nunca la fuerza a cuadrado) */}
        <div className="relative flex-1 bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src={allImages[selectedImage] || "/images/placeholders/placeholder.svg"}
            alt={product.name}
            width={0}
            height={0}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="w-full h-auto"
            priority
          />
          {product.compare_price && product.compare_price > product.price && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded">
              {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Informacion del producto */}
      <div className="flex flex-col">
        {template && categoryLabels[template] && (
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">
            {categoryLabels[template]}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-light mb-4">{seoClean(product.name)}</h1>
        
        {/* Precio */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl md:text-3xl font-medium">
            {formatPrice(displayPrice)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-lg text-neutral-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Descripcion - soporta HTML para tablas de talles, etc */}
        {product.description && (
          <div
            className="text-neutral-600 mb-8 leading-relaxed prose prose-sm max-w-none
              [&_table]:border-collapse [&_table]:w-auto [&_table]:text-sm
              [&_td]:border [&_td]:border-neutral-300 [&_td]:px-3 [&_td]:py-1
              [&_th]:border [&_th]:border-neutral-300 [&_th]:px-3 [&_th]:py-1 [&_th]:bg-neutral-100
              [&_p]:mb-2"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {/* Selectores de variantes */}
        {hasSizes && hasSeparatedVariants ? (
          /* Selectores separados para Talle y Color */
          <div className="mb-8 space-y-6">
            {/* Selector de Talle */}
            <div>
              <h3 className="text-sm font-medium mb-3">Talle</h3>
              <div className="flex flex-wrap gap-2">
                {talles.map((talle) => {
                  const stock = getTalleStock(talle)
                  const isSelected = selectedTalle === talle
                  return (
                    <button
                      key={talle}
                      onClick={() => stock > 0 && setSelectedTalle(talle)}
                      className={`relative px-4 py-2 border rounded text-sm transition-all ${
                        stock > 0
                          ? isSelected
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 hover:border-neutral-600 cursor-pointer"
                          : "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      }`}
                      disabled={stock === 0}
                    >
                      {talle}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selector de Color */}
            <div>
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colores.map((color) => {
                  const stock = selectedTalle
                    ? getVariantStock(selectedTalle, color)
                    : getColorStock(color)
                  const isSelected = selectedColor === color
                  const hex = getColorHex(color)
                  const isLight = hex && (hex === "#FFFFFF" || hex === "#FFFDD0" || hex === "#E8DCC8" || hex === "#D4B896" || hex === "#E3BC9A")
                  const variantPrice = selectedTalle ? getVariantPrice(selectedTalle, color) : undefined

                  return (
                    <div key={color} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => stock > 0 && setSelectedColor(color)}
                        className={`relative flex items-center gap-2 px-3 py-2 border rounded text-sm transition-all ${
                          stock > 0
                            ? isSelected
                              ? "border-black ring-2 ring-black ring-offset-1"
                              : "border-neutral-300 hover:border-neutral-600 cursor-pointer"
                            : "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed opacity-50"
                        }`}
                        disabled={stock === 0}
                      >
                        {/* Cuadradito de color */}
                        {hex ? (
                          <span
                            className={`w-5 h-5 rounded-sm border ${isLight ? "border-neutral-300" : "border-transparent"}`}
                            style={{ backgroundColor: hex }}
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-sm bg-gradient-to-br from-neutral-200 to-neutral-400 border border-neutral-300" />
                        )}
                        <span>{color}</span>
                        {stock > 0 && (
                          <span
                            className={`absolute -top-2 -right-2 text-[10px] px-1.5 rounded-full ${
                              isSelected ? "bg-black text-white" : "bg-green-500 text-white"
                            }`}
                          >
                            {stock}
                          </span>
                        )}
                      </button>
                      {variantPrice && variantPrice !== product.price && (
                        <span className={`text-xs font-medium ${variantPrice > product.price ? "text-red-500" : "text-green-600"}`}>
                          {formatPrice(variantPrice)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mensaje de selección */}
            {(!selectedTalle || !selectedColor) && (
              <p className="text-sm text-amber-600">
                {!selectedTalle && !selectedColor
                  ? "Seleccioná talle y color para continuar"
                  : !selectedTalle
                  ? "Seleccioná un talle"
                  : "Seleccioná un color"}
              </p>
            )}

            {/* Stock de la combinación seleccionada */}
            {selectedTalle && selectedColor && (
              <p className="text-sm text-neutral-500">
                {getVariantStock(selectedTalle, selectedColor) > 0
                  ? `${getVariantStock(selectedTalle, selectedColor)} unidades disponibles`
                  : "Sin stock para esta combinación"}
              </p>
            )}
          </div>
        ) : hasSizes ? (
          /* Selector simple (sin separación talle/color) */
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3">Disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sizeData) => (
                <div key={sizeData.size} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => sizeData.stock > 0 && setSelectedVariant(sizeData.size)}
                    className={`relative px-4 py-2 border rounded text-sm transition-all ${
                      sizeData.stock > 0
                        ? selectedVariant === sizeData.size
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 hover:border-neutral-600 cursor-pointer"
                        : "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    }`}
                    disabled={sizeData.stock === 0}
                  >
                    {sizeData.size}
                    {sizeData.stock > 0 && (
                      <span
                        className={`absolute -top-2 -right-2 text-[10px] px-1.5 rounded-full ${
                          selectedVariant === sizeData.size ? "bg-white text-black" : "bg-green-500 text-white"
                        }`}
                      >
                        {sizeData.stock}
                      </span>
                    )}
                    {sizeData.stock === 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                        0
                      </span>
                    )}
                  </button>
                  {sizeData.price && sizeData.price !== product.price && (
                    <span className={`text-xs font-medium ${sizeData.price > product.price ? "text-red-500" : "text-green-600"}`}>
                      {formatPrice(sizeData.price)}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {!selectedVariant && (
              <p className="text-sm text-amber-600 mt-2">Seleccioná una opción para continuar</p>
            )}
          </div>
        ) : null}

        <p className="text-sm text-neutral-500 mb-6">
          {totalStock > 0 ? `${totalStock} unidades disponibles en total` : "Producto agotado"}
        </p>

        {/* Add to Cart */}
        <div className="mt-auto">
          <AddToCartButton
            product={{ ...product, price: displayPrice }}
            selectedSize={selectedSize}
            className="w-full py-6 text-lg"
            disabled={totalStock === 0 || (hasSizes && !selectedSize)}
          />
        </div>
      </div>
    </div>
  )
}
