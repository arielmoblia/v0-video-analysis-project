import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Esta API se llama cuando el usuario entra al admin o hace cambios
// Reinicia el contador de 7 dias

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId } = body

    if (!storeId) {
      return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Calcular nueva fecha de expiracion (7 dias desde ahora)
    const newTrialExpires = new Date()
    newTrialExpires.setDate(newTrialExpires.getDate() + 7)

    // Actualizar actividad
    const { error } = await supabase
      .from("stores")
      .update({
        last_activity_at: new Date().toISOString(),
        trial_expires_at: newTrialExpires.toISOString(),
        // Resetear contador de emails si hubo actividad
        warning_emails_sent: 0
      })
      .eq("id", storeId)
      .eq("is_trial", true) // Solo para tiendas en trial

    if (error) {
      console.error("Error updating activity:", error)
      return NextResponse.json({ error: "Error al actualizar actividad" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Actividad registrada, trial extendido 7 dias" 
    })
  } catch (error) {
    console.error("Error tracking activity:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
