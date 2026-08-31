import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Chequea el stock real de cada producto de un pedido contra la base actual, sin cambiar
// nada. Usado por el paso "Confirmado" del cronograma en components/admin/orders-manager.tsx
// antes de marcarlo como confirmado. Misma forma de leer sizes/stock que ya usa el webhook
// de Mercado Pago al descontar stock (app/api/mercadopago/webhook/route.ts).
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID requerido" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, items")
      .eq("id", orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    const items = Array.isArray(order.items) ? order.items : []
    const missing: { name: string; size?: string | null; requested: number; available: number }[] = []
    const detail: { name: string; size?: string | null; requested: number; available: number; sufficient: boolean }[] = []

    for (const item of items) {
      const productId = item.productId || item.id
      const size = item.size || item.selectedSize || null
      const requested = Number(item.quantity) || 1

      if (!productId) {
        missing.push({ name: item.name || "Producto", size, requested, available: 0 })
        detail.push({ name: item.name || "Producto", size, requested, available: 0, sufficient: false })
        continue
      }

      const { data: product } = await supabase
        .from("products")
        .select("stock, sizes")
        .eq("id", productId)
        .single()

      if (!product) {
        missing.push({ name: item.name || "Producto", size, requested, available: 0 })
        detail.push({ name: item.name || "Producto", size, requested, available: 0, sufficient: false })
        continue
      }

      let available = 0
      if (size && Array.isArray(product.sizes) && product.sizes.length > 0) {
        const entry = product.sizes.find((s: any) => s.name === size || s.size === size)
        available = entry ? Number(entry.stock) || 0 : 0
      } else {
        available = Number(product.stock) || 0
      }

      detail.push({ name: item.name || "Producto", size, requested, available, sufficient: available >= requested })
      if (available < requested) {
        missing.push({ name: item.name || "Producto", size, requested, available })
      }
    }

    return NextResponse.json({ ok: missing.length === 0, missing, items: detail })
  } catch (error) {
    console.error("[orders/check-stock] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
