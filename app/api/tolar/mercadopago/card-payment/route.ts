import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: NextRequest) {
  try {
    const { cardData, storeId, features, totalARS } = await request.json()
    const accessToken = process.env.MP_ACCESS_TOKEN

    const paymentRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": `cositas_${storeId}_${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: totalARS,
        token: cardData.token,
        description: `Cositas tol.ar: ${features.join(", ")}`,
        installments: cardData.installments || 1,
        payment_method_id: cardData.payment_method_id,
        issuer_id: cardData.issuer_id,
        payer: { email: cardData.payer.email },
      }),
    })

    const payment = await paymentRes.json()

    if (payment.status === "approved") {
      for (const code of features) {
        await supabase
          .from("store_purchased_features")
          .upsert({
            store_id: storeId,
            feature_code: code,
            is_active: true,
            payment_method: "mercadopago_card",
            payment_id: payment.id.toString(),
            activated_at: new Date().toISOString(),
          }, { onConflict: "store_id,feature_code" })
      }

      await supabase.from("feature_purchases").insert({
        store_id: storeId,
        features: features.map((code: string) => ({ code, name: code, price: 1 })),
        amount_ars: totalARS,
        status: "completed",
        payment_method: "mercadopago_card",
        payment_id: payment.id.toString(),
        external_reference: `card_${storeId}_${Date.now()}`,
      })

      if (features.includes("dropshipping")) {
        await supabase
          .from("stores")
          .update({ is_dropship: true })
          .eq("id", storeId)
      }

      const { data: store } = await supabase
        .from("stores")
        .select("email, subdomain, site_title")
        .eq("id", storeId)
        .single()

      if (store?.email) {
        try {
          const { Resend } = await import("resend")
          const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESENDAPIKEY)
          await resend.emails.send({
            from: "TOL.AR <ventas@tiendaonline.com.ar>",
            to: store.email,
            bcc: "soporte@tiendaonline.com.ar",
            subject: `Tus cositas estan activas en ${store.site_title || store.subdomain + ".tol.ar"}`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <h1 style="color:#96305a">Pago confirmado</h1>
              <p>Tus cositas ya estan activas en <strong>${store.subdomain}.tol.ar</strong></p>
              <p>Total pagado: $${totalARS.toLocaleString("es-AR")} ARS</p>
              <p><a href="https://${store.subdomain}.tol.ar/admin?tab=planes" style="color:#96305a">Ver mis cositas activas</a></p>
            </div>`,
          })
        } catch (e) {
          console.error("Email error:", e)
        }
      }

      return NextResponse.json({ status: "approved" })
    }

    return NextResponse.json(
      { error: payment.status_detail || "Pago rechazado" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Card payment error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
