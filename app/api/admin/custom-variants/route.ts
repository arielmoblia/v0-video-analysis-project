import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "Store ID required" }, { status: 400 })
  }

  const { data: store } = await supabase
    .from("stores")
    .select("custom_variants")
    .eq("id", storeId)
    .single()

  return NextResponse.json({
    variant_types: store?.custom_variants?.variant_types || [],
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { storeId, variant_types } = body

  if (!storeId) {
    return NextResponse.json({ error: "Store ID required" }, { status: 400 })
  }

  const { error } = await supabase
    .from("stores")
    .update({
      custom_variants: { variant_types },
    })
    .eq("id", storeId)

  if (error) {
    console.error("Error saving custom variants:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
