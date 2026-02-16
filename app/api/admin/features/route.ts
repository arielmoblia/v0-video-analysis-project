import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function getDolarBlueRate(): Promise<number> {
  try {
    const response = await fetch("https://dolarapi.com/v1/dolares/blue", {
      next: { revalidate: 3600 }, // Cache por 1 hora
    })
    if (response.ok) {
      const data = await response.json()
      return data.venta || 1100
    }
  } catch (error) {
    console.error("Error fetching dolar blue:", error)
  }
  return 1100 // Fallback
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")
  const includeAvailable = searchParams.get("includeAvailable") === "true"

  if (!storeId) {
    return NextResponse.json({ error: "storeId es requerido" }, { status: 400 })
  }

  try {
    // Obtener features compradas por la tienda
    const { data: purchasedData, error: purchasedError } = await supabase
      .from("store_purchased_features")
      .select("feature_code")
      .eq("store_id", storeId)
      .eq("is_active", true)

    if (purchasedError) throw purchasedError

    const purchasedFeatures = purchasedData?.map((f) => f.feature_code) || []

    // Si se pide incluir las features disponibles (activas en la plataforma)
    if (includeAvailable) {
      const { data: availableData, error: availableError } = await supabase
        .from("store_features")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true })

      if (availableError) throw availableError

      const exchangeRate = await getDolarBlueRate()

      return NextResponse.json({
        features: purchasedFeatures,
        availableFeatures: availableData || [],
        exchangeRate,
      })
    }

    return NextResponse.json({ features: purchasedFeatures })
  } catch (error) {
    console.error("Error fetching features:", error)
    return NextResponse.json({ error: "Error al obtener features" }, { status: 500 })
  }
}
