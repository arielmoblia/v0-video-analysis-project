export const dynamic = "force-dynamic"
import { createClient } from "@supabase/supabase-js"
import { encryptFields, decryptFields } from "@/lib/crypto"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  const { data, error } = await supabase.from("payment_methods").select("*").eq("store_id", storeId).single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (data) {
    const decrypted = decryptFields(data, ["mercadopago_access_token","mercadopago_test_token","mobbex_api_key","mobbex_access_token","mercadopago_oauth_access_token","mercadopago_oauth_refresh_token"])
    return NextResponse.json(decrypted)
  }
  return NextResponse.json(null)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { storeId, ...paymentData } = body

  console.log("[v0] POST /api/admin/payments - storeId:", storeId)
  console.log("[v0] POST /api/admin/payments - paymentData:", JSON.stringify(paymentData, null, 2))

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  // Verificar si ya existe
  const { data: existing, error: existingError } = await supabase.from("payment_methods").select("id").eq("store_id", storeId).single()
  
  console.log("[v0] Existing record:", existing, "Error:", existingError?.message)

  if (existing) {
    // Actualizar
    const encryptedData = encryptFields(paymentData, ["mercadopago_access_token","mercadopago_test_token","mobbex_api_key","mobbex_access_token"])
    const { error } = await supabase
      .from("payment_methods")
      .update({
        ...encryptedData,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", storeId)

    console.log("[v0] Update result - Error:", error?.message)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    // Insertar
    const encryptedDataInsert = encryptFields(paymentData, ["mercadopago_access_token","mercadopago_test_token","mobbex_api_key","mobbex_access_token"])
    const { error } = await supabase.from("payment_methods").insert({
      store_id: storeId,
      ...encryptedDataInsert,
    })

    console.log("[v0] Insert result - Error:", error?.message)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
