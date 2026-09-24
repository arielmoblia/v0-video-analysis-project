import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// GET - Obtener features compradas/regaladas de una tienda
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  // Obtener features activas de esta tienda
  const { data: purchasedFeatures, error } = await supabase
    .from("store_purchased_features")
    .select("feature_code")
    .eq("store_id", storeId)
    .eq("is_active", true)

  if (error) {
    console.error("Error cargando features:", error)
    return NextResponse.json({ features: [] })
  }

  // Devolver array de codigos de features activas
  const features = (purchasedFeatures || []).map((f) => f.feature_code)

  return NextResponse.json({ features })
}
