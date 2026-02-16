import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Desplegar version a todas las tiendas con este template
export async function POST(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    const body = await request.json()
    const { version_id } = body

    // Obtener la version
    const { data: version, error: versionError } = await supabase
      .from("template_versions")
      .select("*")
      .eq("id", version_id)
      .single()

    if (versionError) throw versionError

    // Obtener todas las tiendas con este template que tienen auto_update activado
    const { data: stores, error: storesError } = await supabase
      .from("stores")
      .select("id, subdomain, site_title")
      .eq("template_id", templateId)
      .eq("auto_update", true)

    if (storesError) throw storesError

    const storesUpdated = stores?.length || 0

    // Registrar el update para cada tienda
    if (stores && stores.length > 0) {
      const updateRecords = stores.map(store => ({
        store_id: store.id,
        template_id: templateId,
        version_id: version_id,
        version: version.version,
        status: "applied",
        applied_at: new Date().toISOString()
      }))

      await supabase
        .from("store_update_history")
        .insert(updateRecords)

      // Actualizar la version de cada tienda
      await supabase
        .from("stores")
        .update({ template_version: version.version })
        .eq("template_id", templateId)
        .eq("auto_update", true)
    }

    // Marcar la version como desplegada
    await supabase
      .from("template_versions")
      .update({ 
        deployed_to_all: true,
        deployed_at: new Date().toISOString()
      })
      .eq("id", version_id)

    return NextResponse.json({ 
      success: true, 
      stores_updated: storesUpdated,
      message: `Version ${version.version} desplegada a ${storesUpdated} tiendas`
    })
  } catch (error) {
    console.error("Error deploying version:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error al desplegar version" 
    }, { status: 500 })
  }
}
