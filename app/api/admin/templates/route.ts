import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Obtener templates con conteo de tiendas
    const { data: templates, error } = await supabase
      .from("templates")
      .select("*")
      .order("name")

    if (error) throw error

    // Obtener conteo de tiendas por template
    const { data: storeCounts } = await supabase
      .from("stores")
      .select("template_id")

    const countsMap: Record<string, number> = {}
    storeCounts?.forEach(store => {
      if (store.template_id) {
        countsMap[store.template_id] = (countsMap[store.template_id] || 0) + 1
      }
    })

    const templatesWithCounts = templates?.map(t => ({
      ...t,
      stores_count: countsMap[t.id] || 0
    }))

    return NextResponse.json({ 
      success: true, 
      templates: templatesWithCounts 
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener templates" 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, icon, variantes } = body

    const { data, error } = await supabase
      .from("templates")
      .insert({
        name,
        slug,
        description,
        icon: icon || "default",
        variantes: variantes || [],
        current_version: "1.0.0",
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    // Crear version inicial
    await supabase.from("template_versions").insert({
      template_id: data.id,
      version: "1.0.0",
      changelog: "Version inicial",
      breaking_changes: false,
      deployed_to_all: true,
      deployed_at: new Date().toISOString()
    })

    return NextResponse.json({ success: true, template: data })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error al crear template" 
    }, { status: 500 })
  }
}
