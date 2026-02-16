import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { version, changelog, breaking_changes, features } = body

    // Crear nueva version
    const { data: newVersion, error: versionError } = await supabase
      .from("core_versions")
      .insert({
        version,
        changelog,
        breaking_changes,
        features
      })
      .select()
      .single()

    if (versionError) throw versionError

    // Si no hay breaking changes, actualizar todas las tiendas automaticamente
    if (!breaking_changes) {
      const { error: updateError } = await supabase
        .from("store_core_features")
        .update({ 
          core_version: version,
          updated_at: new Date().toISOString()
        })
        .eq("auto_update", true)

      if (updateError) console.error("Error auto-updating stores:", updateError)
    } else {
      // Si hay breaking changes, crear pending updates para cada tienda
      const { data: stores } = await supabase
        .from("stores")
        .select("id")

      if (stores && stores.length > 0) {
        const { data: currentFeatures } = await supabase
          .from("store_core_features")
          .select("store_id, core_version")

        const pendingUpdates = (currentFeatures || []).map(sf => ({
          store_id: sf.store_id,
          from_version: sf.core_version,
          to_version: version,
          requires_action: true,
          action_description: changelog
        }))

        if (pendingUpdates.length > 0) {
          await supabase.from("store_pending_updates").insert(pendingUpdates)
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      version: newVersion,
      message: breaking_changes 
        ? "Version creada. Las tiendas deben actualizar manualmente." 
        : "Version creada y aplicada a todas las tiendas."
    })
  } catch (error) {
    console.error("Error releasing version:", error)
    return NextResponse.json({ error: "Error releasing version" }, { status: 500 })
  }
}
