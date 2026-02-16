import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { storeId, design } = await request.json()

    if (!storeId || !design) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    // Guardar el diseño en la tienda
    const { error } = await supabase
      .from("stores")
      .update({
        ai_design: design,
        // También actualizar los colores principales de la tienda
        primary_color: design.primaryColor,
        secondary_color: design.secondaryColor,
        accent_color: design.accentColor,
      })
      .eq("id", storeId)

    if (error) {
      console.error("Error al guardar diseño:", error)
      return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
