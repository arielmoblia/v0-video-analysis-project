import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Obtener versiones de un template
export async function GET(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params

    const { data: versions, error } = await supabase
      .from("template_versions")
      .select("*")
      .eq("template_id", templateId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, versions })
  } catch (error) {
    console.error("Error fetching versions:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener versiones" 
    }, { status: 500 })
  }
}

// POST - Crear nueva version
export async function POST(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    const body = await request.json()
    const { version, changelog, breaking_changes } = body

    // Crear version
    const { data: newVersion, error } = await supabase
      .from("template_versions")
      .insert({
        template_id: templateId,
        version,
        changelog,
        breaking_changes: breaking_changes || false,
        deployed_to_all: false
      })
      .select()
      .single()

    if (error) throw error

    // Actualizar version actual del template
    await supabase
      .from("templates")
      .update({ current_version: version })
      .eq("id", templateId)

    return NextResponse.json({ success: true, version: newVersion })
  } catch (error) {
    console.error("Error creating version:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Error al crear version" 
    }, { status: 500 })
  }
}
