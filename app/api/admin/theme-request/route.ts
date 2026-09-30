import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Cobra la "Portada especial" (pago único) con Mercado Pago y guarda el pedido.
// El cobro se hace acá, del lado del servidor, con el cardToken de un solo uso
// que generó el Brick en el navegador — nunca confiamos en un "aprobado" que
// venga del cliente.
export async function POST(request: NextRequest) {
  try {
    const { storeId, url, cardData, amountARS, storeName, subdomain } = await request.json()

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

    const { data: currentStore } = await supabase
      .from("stores")
      .select("plan_features")
      .eq("id", storeId)
      .single()

    const existing = currentStore?.plan_features?.custom_theme_request
    if (existing?.status === "pendiente" || existing?.status === "listo") {
      return NextResponse.json({ error: "Ya tenés un pedido en camino, esperá a que lo terminemos" }, { status: 409 })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: "Mercado Pago no está configurado" }, { status: 500 })
    }

    const amount = Number(amountARS)
    if (!amount || amount <= 0 || !cardData?.token) {
      return NextResponse.json({ error: "Datos de pago inválidos" }, { status: 400 })
    }

    const externalReference = `portada_especial_${storeId}_${Date.now()}`

    const paymentRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": externalReference,
      },
      body: JSON.stringify({
        transaction_amount: amount,
        token: cardData.token,
        description: `Portada especial tol.ar - Tienda: ${storeName || subdomain}`,
        installments: cardData.installments || 1,
        payment_method_id: cardData.payment_method_id,
        issuer_id: cardData.issuer_id,
        payer: { email: cardData.payer?.email },
        external_reference: externalReference,
      }),
    })

    const payment = await paymentRes.json()

    if (payment.status !== "approved") {
      return NextResponse.json({ error: payment.status_detail || "Pago rechazado. Probá con otra tarjeta." }, { status: 400 })
    }

    const custom_theme_request = {
      url: parsed.toString(),
      status: "pendiente",
      requested_at: new Date().toISOString(),
      mp_payment_id: payment.id?.toString() || null,
      amount_ars: amount,
    }

    const nextPlanFeatures = { ...(currentStore?.plan_features || {}), custom_theme_request }

    const { error } = await supabase
      .from("stores")
      .update({ plan_features: nextPlanFeatures })
      .eq("id", storeId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESENDAPIKEY)
      await resend.emails.send({
        from: "TOL.AR <ventas@tiendaonline.com.ar>",
        to: "soporte@tiendaonline.com.ar",
        subject: `[Portada especial] ${storeName || subdomain} pidió clonar una página`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#96305a">Nuevo pedido de Portada especial</h2>
          <p><strong>Tienda:</strong> ${storeName || subdomain} (${subdomain}.tol.ar)</p>
          <p><strong>Página que quiere clonar:</strong> <a href="${parsed.toString()}">${parsed.toString()}</a></p>
          <p><strong>Pagó:</strong> $${amount.toLocaleString("es-AR")} ARS</p>
          <p><a href="https://${subdomain}.tol.ar/admin?tab=planes">Ver en el admin de la tienda</a></p>
        </div>`,
      })
    } catch (e) {
      console.error("[theme-request] Error enviando mail de aviso:", e)
    }

    return NextResponse.json({ success: true, custom_theme_request })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
