import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Obtener todas las features
export async function GET() {
  try {
    const { data: features, error } = await supabase
      .from("store_features")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ features })
  } catch (error) {
    console.error("Error fetching features:", error)
    return NextResponse.json({ error: "Error al obtener features" }, { status: 500 })
  }
}

// POST - Crear nueva feature
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, name, description, price, icon } = body

    const { data: feature, error } = await supabase
      .from("store_features")
      .insert({
        code,
        name,
        description,
        price,
        icon,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ feature })
  } catch (error) {
    console.error("Error creating feature:", error)
    return NextResponse.json({ error: "Error al crear feature" }, { status: 500 })
  }
}

// PUT - Actualizar feature
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data: feature, error } = await supabase
      .from("store_features")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ feature })
  } catch (error) {
    console.error("Error updating feature:", error)
    return NextResponse.json({ error: "Error al actualizar feature" }, { status: 500 })
  }
}

// DELETE - Eliminar feature
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    const { error } = await supabase.from("store_features").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting feature:", error)
    return NextResponse.json({ error: "Error al eliminar feature" }, { status: 500 })
  }
}
