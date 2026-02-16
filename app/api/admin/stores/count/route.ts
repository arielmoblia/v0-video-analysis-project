import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Contar total de tiendas
    const { count: total } = await supabase
      .from("stores")
      .select("*", { count: "exact", head: true })

    // Obtener version actual
    const { data: latestVersion } = await supabase
      .from("core_versions")
      .select("version")
      .order("released_at", { ascending: false })
      .limit(1)
      .single()

    const currentVersion = latestVersion?.version || "1.0.0"

    // Contar tiendas actualizadas a la ultima version
    const { count: updated } = await supabase
      .from("store_core_features")
      .select("*", { count: "exact", head: true })
      .eq("core_version", currentVersion)

    return NextResponse.json({ 
      total: total || 0, 
      updated: updated || 0,
      currentVersion 
    })
  } catch (error) {
    console.error("Error counting stores:", error)
    return NextResponse.json({ error: "Error counting stores" }, { status: 500 })
  }
}
