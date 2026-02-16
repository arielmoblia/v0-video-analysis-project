"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/components/store/cart-provider"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  images?: string[]
}

interface AddToCartButtonProps {
  product: Product
  selectedSize?: string | null
  variant?: "default" | "overlay"
  className?: string
  disabled?: boolean
}

export function AddToCartButton({
  product,
  selectedSize,
  variant = "default",
  className,
  disabled,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const productToAdd = {
      ...product,
      image_url: product.image_url || product.images?.[0] || null,
      selectedSize: selectedSize || undefined,
    }

    addItem(productToAdd as any)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (variant === "overlay") {
    return (
      <button
        onClick={handleAdd}
        disabled={disabled}
        className={`w-full py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
          added ? "bg-white text-black" : "bg-black/80 text-white hover:bg-black"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className || ""}`}
      >
        {added ? "Agregado ✓" : "Agregar al carrito"}
      </button>
    )
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full bg-black hover:bg-neutral-800 text-white text-xs tracking-wider uppercase py-6 ${className || ""}`}
      variant={added ? "secondary" : "default"}
    >
      {added ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Agregado
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Agregar
        </>
      )}
    </Button>
  )
}
