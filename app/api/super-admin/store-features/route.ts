import { createClient as createServerClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js" // Declare the createClient variable

// Service role client para super-admin (bypass RLS)
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Obtener features de una tienda especifica
export async function GET(request: Request) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  // Obtener features compradas/regaladas de esta tienda
  const { data: purchasedFeatures, error: purchasedError } = await supabase
    .from("store_purchased_features")
    .select("feature_code, is_active, is_gifted, created_at")
    .eq("store_id", storeId)
    .eq("is_active", true)

  if (purchasedError) {
    console.error("[store-features] Error:", purchasedError)
  }

  const purchased = purchasedFeatures || []
  const purchasedCodes = purchased.map((p) => p.feature_code)

  // Debug temporal
  console.log("[v0] GET store-features - storeId:", storeId, "purchasedCodes:", purchasedCodes, "error:", purchasedError)

  return NextResponse.json({ purchasedCodes, debug: { storeId, count: purchased.length, error: purchasedError?.message } })
}

// POST - Regalar o quitar feature a una tienda
export async function POST(request: Request) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { storeId, featureCode, action } = await request.json()

  if (!storeId || !featureCode || !action) {
    return NextResponse.json({ error: "Faltan parametros" }, { status: 400 })
  }

  if (action === "gift") {
    // Primero verificar si ya existe
    const { data: existing } = await supabase
      .from("store_purchased_features")
      .select("*")
      .eq("store_id", storeId)
      .eq("feature_code", featureCode)
      .single()

    let error
    if (existing) {
      // Actualizar
      const result = await supabase
        .from("store_purchased_features")
        .update({ is_active: true, is_gifted: true })
        .eq("store_id", storeId)
        .eq("feature_code", featureCode)
      error = result.error
    } else {
      // Insertar
      const result = await supabase
        .from("store_purchased_features")
        .insert({
          store_id: storeId,
          feature_code: featureCode,
          is_active: true,
          is_gifted: true,
        })
      error = result.error
    }

    if (error) {
      console.error("[v0] Error gifting feature:", error)
      return NextResponse.json({ error: "Error al regalar feature: " + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Feature regalada" })
  } else if (action === "remove") {
    // Quitar feature
    const { error } = await supabase
      .from("store_purchased_features")
      .delete()
      .eq("store_id", storeId)
      .eq("feature_code", featureCode)

    if (error) {
      console.error("Error removing feature:", error)
      return NextResponse.json({ error: "Error al quitar feature" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Feature quitada" })
  }

  return NextResponse.json({ error: "Accion no valida" }, { status: 400 })
}
