import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "Store ID required" }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("shipping_methods").select("*").eq("store_id", storeId).single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { storeId, ...config } = body

  if (!storeId) {
    return NextResponse.json({ error: "Store ID required" }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  // Check if config exists
  const { data: existing } = await supabase.from("shipping_methods").select("id").eq("store_id", storeId).single()

  if (existing) {
    // Update
    const { error } = await supabase
      .from("shipping_methods")
      .update({
        ...config,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", storeId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    // Insert
    const { error } = await supabase.from("shipping_methods").insert({
      store_id: storeId,
      ...config,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
