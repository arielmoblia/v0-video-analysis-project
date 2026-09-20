import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

// Cancela una suscripción de MP antes de que cobre (botón "Cancelar" en el
// panel, o desde el link del mail de aviso de cobro). No borra el historial,
// solo la desactiva.
export async function POST(request: NextRequest) {
  try {
    const { storeId, featureCode } = await request.json()
    if (!storeId || !featureCode) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const { data: row } = await supabase
      .from("store_purchased_features")
      .select("id, mp_preapproval_id")
      .eq("store_id", storeId)
      .eq("feature_code", featureCode)
      .maybeSingle()

    if (!row?.mp_preapproval_id) {
      return NextResponse.json({ error: "No se encontró una suscripción de Mercado Pago para cancelar" }, { status: 404 })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${row.mp_preapproval_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "cancelled" }),
    })

    if (!mpRes.ok) {
      const errData = await mpRes.json().catch(() => ({}))
      console.error("[MP cancel-subscription] Error cancelando en MP:", errData)
      return NextResponse.json({ error: "No se pudo cancelar en Mercado Pago" }, { status: 400 })
    }

    await supabase
      .from("store_purchased_features")
      .update({ is_active: false, is_trial: false, mp_subscription_status: "cancelled" })
      .eq("id", row.id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[MP cancel-subscription] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
