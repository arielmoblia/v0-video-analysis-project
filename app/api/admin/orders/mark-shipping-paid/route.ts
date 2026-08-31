import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Tilda "Ya transferí a Enviamelo" en la pestaña Envío (components/admin/orders-manager.tsx).
// Registro manual (migración 015): no hay API para verificar que la plata llegó de verdad,
// pero mientras esta columna esté en null, el panel bloquea "Generar guía con Enviamelo".
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID requerido" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ shipping_guide_paid_at: new Date().toISOString() })
      .eq("id", orderId)
      .select("id, shipping_guide_paid_at")
      .single()

    if (error) {
      console.error("Error marking shipping paid:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("[orders/mark-shipping-paid] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
