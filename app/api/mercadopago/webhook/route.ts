import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[MP Webhook] Recibido:", JSON.stringify(body))

    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data.id

    // Buscar el pedido por payment_id o via external_reference
    // Primero obtenemos el pago de MP para saber el external_reference
    // Necesitamos el access token de la tienda — lo buscamos via el pedido

    // Intentar encontrar el pedido por payment_id (si ya fue guardado)
    let { data: order } = await supabase
      .from("orders")
      .select("id, store_id, items, status")
      .eq("payment_id", String(paymentId))
      .single()

    // Si no lo encontramos por payment_id, buscar via MP API
    if (!order) {
      // Buscar todas las tiendas con MP configurado para encontrar el pago
      const { data: paymentMethods } = await supabase
        .from("payment_methods")
        .select("store_id, mercadopago_access_token, mercadopago_test_mode, mercadopago_test_token")
        .eq("mercadopago_enabled", true)

      for (const pm of paymentMethods || []) {
        const token = pm.mercadopago_test_mode ? pm.mercadopago_test_token : pm.mercadopago_access_token
        if (!token) continue

        try {
          const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (!mpRes.ok) continue
          const payment = await mpRes.json()

          if (payment.external_reference) {
            const { data: foundOrder } = await supabase
              .from("orders")
              .select("id, store_id, items, status")
              .eq("id", payment.external_reference)
              .single()

            if (foundOrder) {
              order = foundOrder

              // Actualizar payment_id en el pedido
              await supabase
                .from("orders")
                .update({ payment_id: String(paymentId) })
                .eq("id", foundOrder.id)

              // Verificar estado del pago
              if (payment.status === "approved") {
                await confirmOrder(foundOrder.id, foundOrder.items)
              } else if (payment.status === "pending") {
                await supabase
                  .from("orders")
                  .update({ status: "pendiente_pago" })
                  .eq("id", foundOrder.id)
              }
              break
            }
          }
        } catch (e) {
          continue
        }
      }
    } else if (order.status !== "pagado") {
      // Si encontramos el pedido por payment_id, confirmar
      await confirmOrder(order.id, order.items)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[MP Webhook] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

async function confirmOrder(orderId: string, items: any[]) {
  // Marcar pedido como pagado
  await supabase
    .from("orders")
    .update({ status: "pagado" })
    .eq("id", orderId)

  // Descontar stock
  for (const item of items || []) {
    if (!item.productId) continue

    const { data: product } = await supabase
      .from("products")
      .select("stock, sizes")
      .eq("id", item.productId)
      .single()

    if (!product) continue

    if (product.sizes && Array.isArray(product.sizes) && item.size) {
      const updatedSizes = product.sizes.map((s: any) => {
        if (s.name === item.size || s.size === item.size) {
          return { ...s, stock: Math.max(0, (s.stock || 0) - item.quantity) }
        }
        return s
      })
      await supabase.from("products").update({ sizes: updatedSizes }).eq("id", item.productId)
    } else if (typeof product.stock === "number") {
      await supabase
        .from("products")
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq("id", item.productId)
    }
  }

  console.log(`[MP Webhook] Pedido ${orderId} confirmado y stock actualizado`)
}
