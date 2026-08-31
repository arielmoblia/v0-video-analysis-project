import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Devuelve el precio real y actual de cada item del carrito, para detectar
// si el navegador del cliente tiene un precio viejo guardado en localStorage.
export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ prices: {} })
    }

    const ids = [...new Set(items.map((item: any) => item.productId).filter(Boolean))]
    const { data: products } = await supabase
      .from("products")
      .select("id, price, sizes")
      .in("id", ids)

    const prices: Record<string, number> = {}
    for (const item of items) {
      const product = products?.find((p) => p.id === item.productId)
      if (!product) continue

      let realPrice = product.price
      if (product.sizes && Array.isArray(product.sizes) && item.size) {
        const sizeData = product.sizes.find((s: any) => s.name === item.size || s.size === item.size)
        if (sizeData && typeof sizeData.price === "number") realPrice = sizeData.price
      }

      const key = `${item.productId}-${item.size || "no-size"}`
      prices[key] = realPrice
    }

    return NextResponse.json({ prices })
  } catch (error) {
    console.error("[cart/check-prices] Error:", error)
    return NextResponse.json({ prices: {} })
  }
}
