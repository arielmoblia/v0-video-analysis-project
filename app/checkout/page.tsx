import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getStoreBySubdomain } from "@/lib/store-context"
import { CartProvider } from "@/components/store/cart-provider"
import { CheckoutForm } from "@/components/store/checkout-form"

export const revalidate = 0

export default async function CheckoutPage() {
  const headersList = await headers()
  const host = headersList.get("host") || ""

  // Detectar subdominio
  const hostParts = host.split(".")
  let subdomain: string | null = null

  if (host.includes("tol.ar") && hostParts.length >= 2) {
    const potentialSubdomain = hostParts[0]
    if (potentialSubdomain !== "www" && potentialSubdomain !== "tol") {
      subdomain = potentialSubdomain
    }
  }

  // Si no hay subdominio, redirigir a la página principal
  if (!subdomain) {
    redirect("/")
  }

  // Obtener la tienda
  const store = await getStoreBySubdomain(subdomain)

  if (!store) {
    redirect("/")
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <a href="/" className="text-2xl font-bold tracking-wide">
              {store.site_title || store.subdomain?.toUpperCase()}
            </a>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <CheckoutForm store={store} />
        </main>
      </div>
    </CartProvider>
  )
}
