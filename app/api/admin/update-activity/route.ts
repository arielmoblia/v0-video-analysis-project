import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Actualizar ultima actividad y extender trial si es necesario
    const now = new Date()
    const newTrialExpires = new Date()
    newTrialExpires.setDate(newTrialExpires.getDate() + 7)

    const { error } = await supabase
      .from("stores")
      .update({
        last_activity_at: now.toISOString(),
        // Reiniciar el contador de 7 dias cada vez que hay actividad
        trial_expires_at: newTrialExpires.toISOString(),
        // Resetear contador de emails de advertencia
        warning_emails_sent: 0,
      })
      .eq("id", storeId)
      .eq("is_trial", true) // Solo actualizar si esta en periodo de prueba

    if (error) {
      console.error("Error updating activity:", error)
      return NextResponse.json({ error: "Error al actualizar actividad" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in update-activity:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
