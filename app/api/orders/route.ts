import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendOrderEmail } from "@/lib/email/send-order-email"
import { forwardOrderToSupplierIfConnected } from "@/lib/services/order-forwarding"
import { sendDropshippingNotification } from "@/lib/services/dropshipping-notification"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { storeId, items, total, customer, shipping, paymentMethod } = body

    // Verificar stock y precio real (contra la base de datos, nunca el del navegador)
    // antes de crear el pedido
    const verifiedItems: any[] = []
    let itemsTotal = 0

    for (const item of items) {
      if (item.productId) {
        const { data: product } = await supabase
          .from("products")
          .select("name, price, stock, sizes, source_url")
          .eq("id", item.productId)
          .single()

        if (product) {
          let realPrice = product.price

          // Verificar stock por talla
          if (product.sizes && Array.isArray(product.sizes) && item.size) {
            const sizeData = product.sizes.find((s: any) => s.name === item.size || s.size === item.size)
            if (sizeData && typeof sizeData.stock === "number" && sizeData.stock < item.quantity) {
              return NextResponse.json({
                error: `Stock insuficiente para "${product.name}" talle ${item.size}. Disponible: ${sizeData.stock}`
              }, { status: 400 })
            }
            if (sizeData && typeof sizeData.price === "number") realPrice = sizeData.price
          }
          // Verificar stock general
          else if (typeof product.stock === "number" && product.stock < item.quantity) {
            return NextResponse.json({
              error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
            }, { status: 400 })
          }

          if (realPrice !== item.price) {
            console.warn(`[precio] Corregido en pedido: producto ${item.productId} vino en $${item.price}, precio real $${realPrice}`)
          }

          verifiedItems.push({ ...item, price: realPrice, source_url: product.source_url || null })
          itemsTotal += realPrice * item.quantity
          continue
        }
      }

      // Sin productId (no se puede verificar contra el catálogo): se confía en el valor recibido
      verifiedItems.push(item)
      itemsTotal += Number(item.price || 0) * item.quantity
    }

    const verifiedTotal = itemsTotal + Number(shipping.shippingCost || 0)

    // Crear el pedido
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        store_id: storeId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_dni: customer.dni || null,
        shipping_method: shipping.method,
        shipping_label: shipping.label || shipping.method,
        shipping_address: shipping.address,
        shipping_street_number: shipping.streetNumber || null,
        shipping_province: shipping.province || null,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postalCode,
        shipping_notes: shipping.notes,
        shipping_cost: shipping.shippingCost || 0,
        payment_method: paymentMethod,
        items: verifiedItems,
        total: verifiedTotal,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creando orden:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Prueba: si esta tienda es un clon "conectado" (botón en scraping.tol.ar), reenvía el
    // pedido a la tienda de origen. No bloquea ni retrasa la respuesta al cliente real: si
    // falla, solo queda un log.
    // Con Mercado Pago el pedido nace "pending" y todavía no está cobrado de verdad — el
    // reenvío (que compra en la tienda de origen) se dispara recién cuando el webhook de MP
    // confirma el pago (ver mercadopago/webhook/route.ts). Así no se le compra al proveedor
    // algo que el cliente todavía no pagó.
    if (paymentMethod !== "mercadopago") {
      forwardOrderToSupplierIfConnected(storeId, order.id, verifiedItems).catch((e) =>
        console.error("[order-forwarding] Error reenviando pedido:", e)
      )
    }

    // Dropshipping externo: si la tienda tiene plan_features.dropshipping = true,
    // envía un email al dueño con instrucciones para comprar en el sitio original.
    sendDropshippingNotification(
      storeId,
      order.id,
      verifiedItems,
      verifiedTotal,
      customer.name,
      customer.phone,
      shipping.address ? `${shipping.address}${shipping.city ? ", " + shipping.city : ""}${shipping.postalCode ? " (" + shipping.postalCode + ")" : ""}` : undefined,
      shipping.label || shipping.method
    ).catch((e) =>
      console.error("[dropshipping-notification] Error enviando notificación:", e)
    )

    // Actualizar stock solo si NO es pago online (MP/Mobbex descuentan en el webhook)
    const skipStock = paymentMethod === "mercadopago" || paymentMethod === "mobbex"
    if (!skipStock) for (const item of items) {
      if (item.productId) {
        // Obtener el producto actual
        const { data: product } = await supabase
          .from("products")
          .select("stock, sizes")
          .eq("id", item.productId)
          .single()

        if (product) {
          // Si tiene tallas, actualizar el stock de la talla especifica
          if (product.sizes && Array.isArray(product.sizes) && item.size) {
            const updatedSizes = product.sizes.map((s: any) => {
              if (s.name === item.size || s.size === item.size) {
                return { ...s, stock: Math.max(0, (s.stock || 0) - item.quantity) }
              }
              return s
            })
            await supabase
              .from("products")
              .update({ sizes: updatedSizes })
              .eq("id", item.productId)
          } 
          // Si no tiene tallas, actualizar el stock general
          else if (typeof product.stock === "number") {
            await supabase
              .from("products")
              .update({ stock: Math.max(0, product.stock - item.quantity) })
              .eq("id", item.productId)
          }
        }
      }
    }

    const { data: store } = await supabase.from("stores").select("site_title, email, whatsapp_number, address, phone").eq("id", storeId).single()
    const { data: paymentMethods } = await supabase.from("payment_methods").select("*").eq("store_id", storeId).single()

    const emailItems = verifiedItems.map((item: any) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.size,
      image_url: item.image_url,
    }))

    await sendOrderEmail({
      orderId: order.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      storeName: store?.site_title || "Tienda",
      storeEmail: store?.email,
      items: emailItems,
      total: verifiedTotal,
      shippingMethod: shipping.label || shipping.method,
      shippingAddress: shipping.address ? `${shipping.address}${shipping.city ? ", " + shipping.city : ""}` : undefined,
      paymentMethod: paymentMethod,
      status: "pending",
      notes: shipping.notes,
      paymentData: paymentMethods ? {
        transfer_bank_name: paymentMethods.transfer_bank_name,
        transfer_account_holder: paymentMethods.transfer_account_holder,
        transfer_cbu: paymentMethods.transfer_cbu,
        transfer_alias: paymentMethods.transfer_alias,
        store_email: store?.email,
        whatsapp_number: store?.whatsapp_number,
        store_address: store?.address,
        store_phone: store?.phone,
        modo_phone: paymentMethods.modo_phone,
        uala_link: paymentMethods.uala_link,
        rapipago_instructions: paymentMethods.rapipago_instructions,
        cash_instructions: paymentMethods.cash_instructions,
        card_instructions: paymentMethods.card_instructions,
      } : undefined,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
