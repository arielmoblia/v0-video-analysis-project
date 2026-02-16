import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: NextRequest) {
  try {
    const { productId, displayOrder } = await request.json()

    if (!productId || displayOrder === undefined) {
      return NextResponse.json({ error: "productId y displayOrder son requeridos" }, { status: 400 })
    }

    const { error } = await supabase
      .from("products")
      .update({ display_order: displayOrder })
      .eq("id", productId)

    if (error) {
      console.error("Error updating product order:", error)
      return NextResponse.json({ error: "Error al actualizar orden" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in order API:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
