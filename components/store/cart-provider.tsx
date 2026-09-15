"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

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
  showPriceAlert: boolean
  dismissPriceAlert: () => void
  country?: string | null
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

export function CartProvider({
  children,
  storeId,
  country,
}: { children: ReactNode; storeId?: string; country?: string | null }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cartKey, setCartKey] = useState<string>("")
  const [showPriceAlert, setShowPriceAlert] = useState(false)
  const itemsRef = useRef<CartItem[]>([])
  itemsRef.current = items

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

  // Al abrir el carrito, comparamos el precio guardado en localStorage (puede quedar
  // cacheado en el navegador del cliente) contra el precio real de la base de datos.
  useEffect(() => {
    if (!cartOpen || !isLoaded) return

    const checkPrices = async () => {
      try {
        const currentItems = itemsRef.current
        if (currentItems.length === 0) return

        const res = await fetch("/api/cart/check-prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: currentItems.map((item) => ({ productId: item.product.id, size: item.product.selectedSize })),
          }),
        })
        const data = await res.json()

        let changed = false
        setItems((prev) =>
          prev.map((item) => {
            const key = `${item.product.id}-${item.product.selectedSize || "no-size"}`
            const realPrice = data.prices?.[key]
            if (typeof realPrice === "number" && realPrice !== Number(item.product.price)) {
              changed = true
              return { ...item, product: { ...item.product, price: realPrice } }
            }
            return item
          }),
        )
        if (changed) setShowPriceAlert(true)
      } catch (e) {
        console.error("Error verificando precios del carrito:", e)
      }
    }

    checkPrices()
  }, [cartOpen, isLoaded])

  const dismissPriceAlert = () => setShowPriceAlert(false)

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
        showPriceAlert,
        dismissPriceAlert,
        country,
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
