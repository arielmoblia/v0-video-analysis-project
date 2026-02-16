"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-provider"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQuantity, total, clearCart } = useCart()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const handleCheckout = () => {
    setCartOpen(false)

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      const isSubdomain = hostname.includes(".tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar"

      if (isSubdomain) {
        // Estamos en prueba6.tol.ar, ir a /checkout
        router.push("/checkout")
      } else {
        // Estamos en localhost o dominio principal con /tienda/xxx
        const pathParts = window.location.pathname.split("/")
        if (pathParts.includes("tienda")) {
          const subdomainIndex = pathParts.indexOf("tienda") + 1
          const subdomain = pathParts[subdomainIndex]
          router.push(`/tienda/${subdomain}/checkout`)
        } else {
          router.push("/checkout")
        }
      }
    }
  }

  const getItemKey = (item: (typeof items)[0]) => {
    return `${item.product.id}-${item.product.selectedSize || "no-size"}`
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xs tracking-[0.2em] uppercase">Carrito</h2>
          <button onClick={() => setCartOpen(false)} className="hover:opacity-60 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag className="h-12 w-12 text-neutral-300 mb-4" strokeWidth={1} />
            <p className="text-sm text-neutral-500 mb-2">Tu carrito está vacío</p>
            <p className="text-xs text-neutral-400">Agregá productos para comenzar</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <div key={getItemKey(item)} className="flex gap-4 px-6 py-5 border-b">
                  <div className="relative h-24 w-20 bg-neutral-100 flex-shrink-0">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-normal leading-tight pr-4">{item.product.name}</h4>
                      <button
                        onClick={() => removeItem(item.product.id, item.product.selectedSize)}
                        className="text-neutral-400 hover:text-black transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {item.product.selectedSize && (
                      <p className="text-xs text-neutral-500 mb-1">Talla: {item.product.selectedSize}</p>
                    )}
                    <p className="text-sm text-neutral-600 mb-auto">{formatPrice(Number(item.product.price))}</p>
                    <div className="flex items-center border border-neutral-200 self-start">
                      <button
                        className="px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.product.selectedSize)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1.5 text-sm min-w-[40px] text-center">{item.quantity}</span>
                      <button
                        className="px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.product.selectedSize)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-6 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs tracking-[0.2em] uppercase">Subtotal</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-neutral-500 text-center mb-4">Envío e impuestos calculados en el checkout</p>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
              >
                Finalizar compra
              </button>
              <button
                onClick={clearCart}
                className="w-full py-3 text-xs tracking-wider text-neutral-500 hover:text-black transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
