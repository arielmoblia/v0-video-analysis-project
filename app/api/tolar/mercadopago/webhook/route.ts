import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[MP Webhook] Recibido:", JSON.stringify(body))

    // MP manda distintos tipos de notificaciones
    const { type, data } = body

    if (type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = data?.id
    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    // Consultar el pago en MP
    const accessToken = process.env.MP_ACCESS_TOKEN
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!response.ok) {
      console.error("[MP Webhook] Error consultando pago:", paymentId)
      return NextResponse.json({ error: "Error consultando pago" }, { status: 500 })
    }

    const payment = await response.json()
    console.log("[MP Webhook] Pago:", payment.status, payment.external_reference)

    // Solo procesar pagos aprobados
    if (payment.status !== "approved") {
      return NextResponse.json({ received: true })
    }

    // Buscar el purchase por external_reference
    const { data: purchase } = await supabase
      .from("feature_purchases")
      .select("*")
      .eq("external_reference", payment.external_reference)
      .single()

    if (!purchase) {
      console.error("[MP Webhook] Purchase no encontrado:", payment.external_reference)
      return NextResponse.json({ received: true })
    }

    // Activar las cositas
    const features = purchase.features as { code: string; name: string; price: number }[]
    for (const feature of features) {
      await supabase
        .from("store_purchased_features")
        .upsert({
          store_id: purchase.store_id,
          feature_code: feature.code,
          is_active: true,
          payment_method: "mercadopago",
          payment_id: paymentId.toString(),
          activated_at: new Date().toISOString(),
        }, { onConflict: "store_id,feature_code" })
    }

    // Actualizar el purchase como completado
    await supabase
      .from("feature_purchases")
      .update({ status: "completed", payment_id: paymentId.toString() })
      .eq("id", purchase.id)

    console.log("[MP Webhook] Cositas activadas para tienda:", purchase.store_id)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("[MP Webhook] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
