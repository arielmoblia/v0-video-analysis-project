import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { features } = body

    // Obtener version actual
    const { data: latestVersion } = await supabase
      .from("core_versions")
      .select("version")
      .order("released_at", { ascending: false })
      .limit(1)
      .single()

    const currentVersion = latestVersion?.version || "1.0.0"

    // Actualizar features en todas las tiendas con auto_update
    if (features && Object.keys(features).length > 0) {
      const { error: updateError } = await supabase
        .from("store_core_features")
        .update({
          ...features,
          core_version: currentVersion,
          updated_at: new Date().toISOString()
        })
        .eq("auto_update", true)

      if (updateError) throw updateError
    } else {
      // Solo actualizar version
      const { error: updateError } = await supabase
        .from("store_core_features")
        .update({
          core_version: currentVersion,
          updated_at: new Date().toISOString()
        })
        .eq("auto_update", true)

      if (updateError) throw updateError
    }

    // Marcar pending updates como aplicados
    await supabase
      .from("store_pending_updates")
      .update({ 
        applied: true, 
        applied_at: new Date().toISOString() 
      })
      .eq("applied", false)

    // Contar tiendas actualizadas
    const { count } = await supabase
      .from("store_core_features")
      .select("*", { count: "exact", head: true })
      .eq("core_version", currentVersion)

    return NextResponse.json({ 
      success: true, 
      updated: count || 0,
      version: currentVersion
    })
  } catch (error) {
    console.error("Error updating all stores:", error)
    return NextResponse.json({ error: "Error updating stores" }, { status: 500 })
  }
}
