import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendOrderEmail } from "@/lib/email/send-order-email"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { storeId, items, total, customer, shipping, paymentMethod } = body

    // Verificar stock disponible antes de crear el pedido
    for (const item of items) {
      if (item.productId) {
        const { data: product } = await supabase
          .from("products")
          .select("name, stock, sizes")
          .eq("id", item.productId)
          .single()

        if (product) {
          // Verificar stock por talla
          if (product.sizes && Array.isArray(product.sizes) && item.size) {
            const sizeData = product.sizes.find((s: any) => s.name === item.size || s.size === item.size)
            if (sizeData && typeof sizeData.stock === "number" && sizeData.stock < item.quantity) {
              return NextResponse.json({ 
                error: `Stock insuficiente para "${product.name}" talle ${item.size}. Disponible: ${sizeData.stock}` 
              }, { status: 400 })
            }
          } 
          // Verificar stock general
          else if (typeof product.stock === "number" && product.stock < item.quantity) {
            return NextResponse.json({ 
              error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}` 
            }, { status: 400 })
          }
        }
      }
    }

    // Crear el pedido
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        store_id: storeId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_method: shipping.method,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postalCode,
        shipping_notes: shipping.notes,
        payment_method: paymentMethod,
        items: items,
        total: total,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creando orden:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Actualizar stock de cada producto
    for (const item of items) {
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

    const { data: store } = await supabase.from("stores").select("site_title, email").eq("id", storeId).single()

    const emailItems = items.map((item: any) => ({
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
      total: total,
      shippingMethod: shipping.method,
      shippingAddress: shipping.method === "delivery" ? `${shipping.address}, ${shipping.city}` : undefined,
      paymentMethod: paymentMethod,
      status: "pending",
      notes: shipping.notes,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
