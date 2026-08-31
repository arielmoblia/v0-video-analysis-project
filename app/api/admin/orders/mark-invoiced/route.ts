import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Tilda el paso "Facturado" del cronograma (components/admin/orders-manager.tsx). Es
// puramente un registro manual todavía: no hay integración real con AFIP, por eso vive en
// su propia columna (invoiced_at, migración 014) separada del campo `status`, para no tocar
// los valores de status que ya lee el resto del código.
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID requerido" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ invoiced_at: new Date().toISOString() })
      .eq("id", orderId)
      .select("id, invoiced_at")
      .single()

    if (error) {
      console.error("Error marking order invoiced:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("[orders/mark-invoiced] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
