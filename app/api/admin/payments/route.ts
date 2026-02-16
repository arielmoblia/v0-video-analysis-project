import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("payment_methods").select("*").eq("store_id", storeId).single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || null)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { storeId, ...paymentData } = body

  console.log("[v0] POST /api/admin/payments - storeId:", storeId)
  console.log("[v0] POST /api/admin/payments - paymentData:", JSON.stringify(paymentData, null, 2))

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  // Verificar si ya existe
  const { data: existing, error: existingError } = await supabase.from("payment_methods").select("id").eq("store_id", storeId).single()
  
  console.log("[v0] Existing record:", existing, "Error:", existingError?.message)

  if (existing) {
    // Actualizar
    const { error } = await supabase
      .from("payment_methods")
      .update({
        ...paymentData,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", storeId)

    console.log("[v0] Update result - Error:", error?.message)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    // Insertar
    const { error } = await supabase.from("payment_methods").insert({
      store_id: storeId,
      ...paymentData,
    })

    console.log("[v0] Insert result - Error:", error?.message)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
