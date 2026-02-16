import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderEmail } from "@/lib/email/send-order-email"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("store_id") || searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      orders: data || [],
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, storeName, refundReason } = body

    if (!orderId) {
      return NextResponse.json({ error: "Order ID requerido" }, { status: 400 })
    }

    const { data: currentOrder } = await supabase
      .from("orders")
      .select("*, stores(site_title)")
      .eq("id", orderId)
      .single()

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (currentOrder && currentOrder.customer_email) {
      const emailItems = (currentOrder.items || []).map((item: any) => ({
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.size || item.selectedSize,
        image_url: item.image_url,
      }))

      await sendOrderEmail({
        orderId: currentOrder.id,
        customerName: currentOrder.customer_name,
        customerEmail: currentOrder.customer_email,
        storeName: storeName || currentOrder.stores?.site_title || "Tienda",
        items: emailItems,
        total: Number.parseFloat(currentOrder.total),
        shippingMethod: currentOrder.shipping_method,
        shippingAddress:
          currentOrder.shipping_method === "delivery"
            ? `${currentOrder.shipping_address}, ${currentOrder.shipping_city}`
            : undefined,
        paymentMethod: currentOrder.payment_method,
        status: status,
        refundReason: refundReason,
      })
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID requerido" }, { status: 400 })
    }

    const { error } = await supabase.from("orders").delete().eq("id", orderId)

    if (error) {
      console.error("Error deleting order:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
