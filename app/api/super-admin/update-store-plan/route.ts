import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { storeId, plan } = await request.json()

    if (!storeId || !plan) {
      return NextResponse.json({ error: "storeId y plan son requeridos" }, { status: 400 })
    }

    // Validar que el plan sea uno de los permitidos
    const validPlans = ["free", "templates", "cositas", "socios", "custom", "mayoristas"]
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Plan no valido" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("stores")
      .update({ plan })
      .eq("id", storeId)

    if (error) {
      console.error("Error actualizando plan:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error("Error en update-store-plan:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
