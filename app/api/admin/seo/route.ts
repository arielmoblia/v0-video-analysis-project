import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  const { data: store } = await supabase
    .from("stores")
    .select("seo_config")
    .eq("id", storeId)
    .single()

  return NextResponse.json({ seo: store?.seo_config || null })
}

export async function POST(request: NextRequest) {
  try {
    const { storeId, seo } = await request.json()
    
    if (!storeId) {
      return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("stores")
      .update({ seo_config: seo })
      .eq("id", storeId)
      .select("seo_config")
      .single()

    if (error) {
      console.error("Error guardando SEO:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, seo: data?.seo_config })
  } catch (err) {
    console.error("Error en POST SEO:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
