import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { storeId, url, paypalOrderId, amountUsd } = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return NextResponse.json({ error: "Link inválido" }, { status: 400 })
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Link inválido" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: currentStore } = await supabase
      .from("stores")
      .select("plan_features")
      .eq("id", storeId)
      .single()

    const existing = currentStore?.plan_features?.custom_theme_request
    if (existing?.status === "pendiente") {
      return NextResponse.json({ error: "Ya tenés un pedido en camino, esperá a que lo terminemos" }, { status: 409 })
    }

    const custom_theme_request = {
      url: parsed.toString(),
      status: "pendiente",
      requested_at: new Date().toISOString(),
      ...(paypalOrderId ? { paypal_order_id: paypalOrderId, amount_usd: amountUsd ?? null } : {}),
    }

    const nextPlanFeatures = { ...(currentStore?.plan_features || {}), custom_theme_request }

    const { error } = await supabase
      .from("stores")
      .update({ plan_features: nextPlanFeatures })
      .eq("id", storeId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, custom_theme_request })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
