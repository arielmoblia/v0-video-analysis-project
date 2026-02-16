"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Product {
  id: string
  name: string
  price: number
  image_url?: string | null
  selectedSize?: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string, selectedSize?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void
  clearCart: () => void
  total: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function getSubdomainFromUrl(): string {
  if (typeof window === "undefined") return "default"

  const hostname = window.location.hostname
  // Si es localhost o v0.dev, usar default
  if (hostname === "localhost" || hostname.includes("v0.dev") || hostname.includes("vercel.app")) {
    // Intentar obtener de la URL path /tienda/xxx
    const pathMatch = window.location.pathname.match(/\/tienda\/([^/]+)/)
    if (pathMatch) return pathMatch[1]
    return "default"
  }

  // Para subdominios como prueba6.tol.ar
  const parts = hostname.split(".")
  if (parts.length >= 2 && parts[0] !== "www") {
    return parts[0]
  }

  return "default"
}

export function CartProvider({ children, storeId }: { children: ReactNode; storeId?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cartKey, setCartKey] = useState<string>("")

  useEffect(() => {
    const subdomain = getSubdomainFromUrl()
    const key = `tol-cart-${subdomain}`
    setCartKey(key)

    // Cargar carrito inmediatamente
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        setItems(parsed)
      }
    } catch (e) {
      console.error("Error loading cart:", e)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded && cartKey && typeof window !== "undefined") {
      localStorage.setItem(cartKey, JSON.stringify(items))
    }
  }, [items, isLoaded, cartKey])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.product.selectedSize === product.selectedSize,
      )
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.product.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { product, quantity }]
    })
    setCartOpen(true)
  }

  const removeItem = (productId: string, selectedSize?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.product.selectedSize === selectedSize)),
    )
  }

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.product.selectedSize === selectedSize ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        cartOpen,
        setCartOpen,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
