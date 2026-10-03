import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: NextRequest) {
  try {
    const { productId, featured } = await request.json()

    if (!productId || featured === undefined) {
      return NextResponse.json({ error: "productId y featured son requeridos" }, { status: 400 })
    }

    const { error } = await supabase
      .from("products")
      .update({ featured })
      .eq("id", productId)

    if (error) {
      console.error("Error updating product featured:", error)
      return NextResponse.json({ error: "Error al actualizar destacado" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in featured API:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
