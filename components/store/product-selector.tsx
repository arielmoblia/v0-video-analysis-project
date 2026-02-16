"use client"

import { useState } from "react"
import Image from "next/image"
import { AddToCartButton } from "./add-to-cart-button"

interface SizeWithStock {
  size: string
  stock: number
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
}

export function ProductSelector({ product, subdomain, hasMultiImages = false }: ProductSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  
  // Combinar todas las imagenes disponibles
  // Si no tiene la feature de multi-imagenes, solo usar la primera
  const allImages: string[] = []
  if (hasMultiImages && product.images && product.images.length > 0) {
    allImages.push(...product.images)
  } else if (product.images && product.images.length > 0) {
    allImages.push(product.images[0])
  } else if (product.image_url) {
    allImages.push(product.image_url)
  }
  
  // Si no hay imagenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push("/placeholder.svg")
  }
  
  const [selectedImage, setSelectedImage] = useState(0)

  const sizes: SizeWithStock[] = product.sizes || []
  const totalStock = sizes.reduce((acc, s) => acc + (s.stock || 0), 0)
  const hasSizes = sizes.length > 0

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Columna izquierda: Miniaturas + Imagen principal */}
      <div className="flex gap-4">
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
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
        
        {/* Imagen principal */}
        <div className="relative flex-1 aspect-square bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src={allImages[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
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
        <h1 className="text-2xl md:text-3xl font-light mb-4">{product.name}</h1>
        
        {/* Precio */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl md:text-3xl font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-lg text-neutral-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Descripcion */}
        {product.description && (
          <p className="text-neutral-600 mb-8 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Selector de tallas */}
        {hasSizes && (
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3">Tallas disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sizeData) => (
                <button
                  key={sizeData.size}
                  onClick={() => sizeData.stock > 0 && setSelectedSize(sizeData.size)}
                  className={`relative px-4 py-2 border rounded text-sm transition-all ${
                    sizeData.stock > 0
                      ? selectedSize === sizeData.size
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
                        selectedSize === sizeData.size ? "bg-white text-black" : "bg-green-500 text-white"
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
              ))}
            </div>
            {hasSizes && !selectedSize && (
              <p className="text-sm text-amber-600 mt-2">Selecciona una talla para continuar</p>
            )}
          </div>
        )}

        <p className="text-sm text-neutral-500 mb-6">
          {totalStock > 0 ? `${totalStock} unidades disponibles en total` : "Producto agotado"}
        </p>

        {/* Add to Cart */}
        <div className="mt-auto">
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
            className="w-full py-6 text-lg"
            disabled={totalStock === 0 || (hasSizes && !selectedSize)}
          />
        </div>
      </div>
    </div>
  )
}
