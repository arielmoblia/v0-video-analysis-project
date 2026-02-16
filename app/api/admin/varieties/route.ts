import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  try {
    const { data: store } = await supabase
      .from("stores")
      .select("custom_varieties")
      .eq("id", storeId)
      .single()

    return NextResponse.json({ varieties: store?.custom_varieties || [] })
  } catch (error) {
    console.error("Error fetching varieties:", error)
    return NextResponse.json({ error: "Error al obtener variedades" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { storeId, varieties } = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
    }

    const { error } = await supabase
      .from("stores")
      .update({ custom_varieties: varieties })
      .eq("id", storeId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving varieties:", error)
    return NextResponse.json({ error: "Error al guardar variedades" }, { status: 500 })
  }
}
