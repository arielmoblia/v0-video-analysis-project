import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { storeId, features, paymentMethod } = await request.json()

    if (!storeId || !features || features.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // En producción, aquí iría la integración con Mercado Pago u otro procesador de pagos
    // Por ahora, simulamos el pago exitoso

    // Insertar las features compradas
    const inserts = features.map((featureCode: string) => ({
      store_id: storeId,
      feature_code: featureCode,
      is_active: true,
    }))

    const { error } = await supabase
      .from("store_purchased_features")
      .upsert(inserts, { onConflict: "store_id,feature_code" })

    if (error) throw error

    return NextResponse.json({ success: true, message: "Compra realizada exitosamente" })
  } catch (error) {
    console.error("Error purchasing features:", error)
    return NextResponse.json({ error: "Error al procesar la compra" }, { status: 500 })
  }
}
