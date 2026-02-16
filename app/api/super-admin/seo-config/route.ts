import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Usamos config_key para identificar la configuracion (evita problemas con UUID)
const CONFIG_KEY = "tol_ar_main"

// GET - Obtener configuracion SEO
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("platform_seo_config")
      .select("*")
      .eq("config_key", CONFIG_KEY)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching SEO config:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Si no hay datos, devolver valores por defecto
    if (!data) {
      return NextResponse.json({
        config_key: CONFIG_KEY,
        site_title: "tol.ar - Crea tu tienda online gratis",
        site_description: "Hace tu tienda online en 2 minutos. Sin conocimientos tecnicos. Empeza a vender hoy.",
        keywords: "tienda online, ecommerce, vender online, crear tienda",
        google_analytics_id: null,
        google_verification: null,
        google_verified: false,
        bing_verification: null,
        bing_verified: false,
        sitemap_submitted: false
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET SEO config:", error)
    return NextResponse.json({ error: "Error fetching SEO config" }, { status: 500 })
  }
}

// POST - Actualizar configuracion SEO
export async function POST(request: Request) {
  try {
    const updates = await request.json()
    
    // Obtener datos actuales
    const { data: existing } = await supabase
      .from("platform_seo_config")
      .select("*")
      .eq("config_key", CONFIG_KEY)
      .single()

    // Preparar datos para guardar (sin el id, dejamos que Supabase lo maneje)
    const { id: _id, ...cleanUpdates } = updates as Record<string, unknown>
    
    // Merge con datos existentes
    const mergedData = {
      ...(existing || {}),
      ...cleanUpdates,
      config_key: CONFIG_KEY,
      updated_at: new Date().toISOString()
    }
    
    // Remover id si existe para evitar conflictos
    delete (mergedData as Record<string, unknown>).id

    // Upsert usando config_key
    const { data, error } = await supabase
      .from("platform_seo_config")
      .upsert(mergedData, { onConflict: "config_key" })
      .select()
      .single()

    if (error) {
      console.error("Error saving SEO config:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in POST SEO config:", error)
    return NextResponse.json({ error: "Error saving SEO config" }, { status: 500 })
  }
}
