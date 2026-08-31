import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[MP Webhook] Recibido:", JSON.stringify(body))

    const { type, data } = body
    if (type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = data?.id
    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

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

    if (payment.status !== "approved") {
      return NextResponse.json({ received: true })
    }

    const { data: purchase } = await supabase
      .from("feature_purchases")
      .select("*")
      .eq("external_reference", payment.external_reference)
      .single()

    if (!purchase) {
      console.error("[MP Webhook] Purchase no encontrado:", payment.external_reference)
      return NextResponse.json({ received: true })
    }

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

    await supabase
      .from("feature_purchases")
      .update({ status: "completed", payment_id: paymentId.toString() })
      .eq("id", purchase.id)

    if (features.some(f => f.code === "dropshipping")) {
      await supabase
        .from("stores")
        .update({ is_dropship: true })
        .eq("id", purchase.store_id)
      console.log("[MP Webhook] Dropshipping activado para tienda:", purchase.store_id)
    }

    console.log("[MP Webhook] Cositas activadas para tienda:", purchase.store_id)

    const { data: store } = await supabase
      .from("stores")
      .select("email, subdomain, site_title")
      .eq("id", purchase.store_id)
      .single()

    if (store?.email) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESENDAPIKEY)
        const featureNames = features.map(f => f.name).join(", ")
        const totalARS = purchase.amount_ars?.toLocaleString("es-AR") || "0"
        await resend.emails.send({
          from: "TOL.AR <ventas@tiendaonline.com.ar>",
          to: store.email,
          bcc: "soporte@tiendaonline.com.ar",
          subject: `Tus cositas estan activas en ${store.site_title || store.subdomain + ".tol.ar"}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #96305a;">Pago confirmado</h1>
              <p>Hola,</p>
              <p>Tu pago fue procesado con exito y las siguientes cositas ya estan activas en tu tienda:</p>
              <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="color: #15803d; margin: 0 0 8px 0;">Cositas activadas</h3>
                <p style="margin: 0; color: #166534; font-weight: bold;">${featureNames}</p>
              </div>
              <div style="background: #fafafa; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 4px 0;"><strong>Tienda:</strong> ${store.subdomain}.tol.ar</p>
                <p style="margin: 0 0 4px 0;"><strong>Total pagado:</strong> $${totalARS} ARS</p>
                <p style="margin: 0;"><strong>Metodo:</strong> MercadoPago</p>
              </div>
              <p>Podes ver tus cositas activas en <a href="https://${store.subdomain}.tol.ar/admin?tab=planes" style="color: #96305a;">tu panel de administracion</a>.</p>
              <p style="color: #666; font-size: 13px;">Si tenes alguna duda escribinos a soporte@tiendaonline.com.ar</p>
            </div>
          `,
        })
        console.log("[MP Webhook] Email enviado a:", store.email)
      } catch (emailError) {
        console.error("[MP Webhook] Error enviando email:", emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[MP Webhook] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
