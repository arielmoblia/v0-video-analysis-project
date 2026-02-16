import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("shipping_methods")
      .select("*")
      .eq("store_id", storeId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ config: data })
  } catch (error) {
    console.error("[v0] Error obteniendo config de envío:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
