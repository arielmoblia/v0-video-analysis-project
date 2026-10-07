import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

// Crea una suscripción (preapproval) de Mercado Pago con tarjeta guardada
// para una o varias "cositas" juntas (mismo cobro, un solo preapproval para
// todo el paquete). Dos usos:
// - trialDays > 0: arranca la prueba gratis, MP cobra solo cuando termina.
// - trialDays = 0 (o no viene): cobra ya el primer mes (botón "Pagar").
// En ambos casos MP vuelve a cobrar solo todos los meses y avisa por
// webhook (ver app/api/tolar/mercadopago/webhook) — no hace falta que
// nuestro backend dispare nada para las renovaciones.
//
// Flujo: el cliente carga la tarjeta en el Brick de MP (en el navegador),
// eso genera un card_token_id de un solo uso, y acá lo mandamos a MP junto
// con los datos de la suscripción.
export async function POST(request: NextRequest) {
  try {
    const {
      storeId,
      features,
      trialDays,
      cardToken,
      payerEmail,
      transactionAmountARS,
    } = await request.json()

    const featureList: { code: string; name?: string }[] = Array.isArray(features) ? features : []

    if (!storeId || featureList.length === 0 || !cardToken || !payerEmail) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const days = Number(trialDays) || 0

    // No permitir arrancar dos veces la misma cosita si ya tiene una
    // suscripción activa (trial o pagada) para esta tienda.
    const { data: existingRows } = await supabase
      .from("store_purchased_features")
      .select("feature_code, feature_name, mp_preapproval_id, is_active")
      .eq("store_id", storeId)
      .in("feature_code", featureList.map(f => f.code))

    const alreadyActive = (existingRows || []).filter(r => r.mp_preapproval_id && r.is_active)
    if (alreadyActive.length > 0) {
      const names = alreadyActive.map(r => r.feature_name || r.feature_code).join(", ")
      return NextResponse.json({ error: `Ya tenés una suscripción activa para: ${names}` }, { status: 400 })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: "Mercado Pago no está configurado" }, { status: 500 })
    }

    const amount = Number(transactionAmountARS)
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 })
    }

    const codesForRef = featureList.map(f => f.code).join("-")
    const externalReference = `cosita_${storeId}_${codesForRef}_${Date.now()}`
    const host = request.headers.get("host") || "tol.ar"
    const reason = `Cosita${featureList.length > 1 ? "s" : ""} tol.ar: ${featureList.map(f => f.name || f.code).join(" + ")}`

    const autoRecurring: Record<string, any> = {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: amount,
      currency_id: "ARS",
    }
    if (days > 0) {
      autoRecurring.free_trial = { frequency: days, frequency_type: "days" }
    }

    const preapprovalBody = {
      reason,
      external_reference: externalReference,
      payer_email: payerEmail,
      card_token_id: cardToken,
      back_url: `https://${host}/admin?tab=planes`,
      status: "authorized",
      auto_recurring: autoRecurring,
    }

    const mpRes = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": externalReference,
      },
      body: JSON.stringify(preapprovalBody),
    })

    const mpData = await mpRes.json()

    if (!mpRes.ok || !mpData.id) {
      console.error("[MP create-subscription] Error creando preapproval:", mpData)
      const rawMessage = mpData.message || mpData.error || ""
      const friendlyMessage = rawMessage.toLowerCase().includes("resource not found")
        ? "Mercado Pago no pudo procesar esta tarjeta para la suscripción. Probá con otra tarjeta o contactanos si el problema sigue."
        : rawMessage || "Mercado Pago rechazó la tarjeta"
      return NextResponse.json({ error: friendlyMessage }, { status: 400 })
    }

    const trialEndsAt = days > 0 ? new Date() : null
    if (trialEndsAt) trialEndsAt.setDate(trialEndsAt.getDate() + days)

    const nowIso = new Date().toISOString()
    const dbErrors: any[] = []
    for (const feature of featureList) {
      const { error: dbError } = await supabase
        .from("store_purchased_features")
        .upsert(
          {
            store_id: storeId,
            feature_code: feature.code,
            feature_name: feature.name || null,
            is_active: true,
            is_trial: days > 0,
            trial_ends_at: trialEndsAt ? trialEndsAt.toISOString() : null,
            payment_method: "mercadopago_subscription",
            mp_preapproval_id: mpData.id,
            mp_subscription_status: mpData.status || "authorized",
            mp_payer_email: payerEmail,
            activated_at: nowIso,
            purchased_at: days > 0 ? null : nowIso,
            charge_reminder_sent_at: null,
          },
          { onConflict: "store_id,feature_code" }
        )
      if (dbError) dbErrors.push(dbError)
    }

    if (dbErrors.length > 0) {
      console.error("[MP create-subscription] Error guardando en DB:", dbErrors)
      // La suscripción en MP ya se creó; devolvemos error para que se pueda reintentar
      // guardar, pero no dejamos a MP cobrando sin registro nuestro.
      return NextResponse.json({ error: "Error al guardar la suscripción" }, { status: 500 })
    }

    // Mail de confirmación (bienvenida al trial, o aviso de cobro+suscripción ya activa)
    try {
      const { data: store } = await supabase
        .from("stores")
        .select("email, subdomain, site_title")
        .eq("id", storeId)
        .single()

      const notifyEmail = store?.email || payerEmail
      const featureNames = featureList.map(f => f.name || f.code).join(", ")
      if (notifyEmail) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESENDAPIKEY)

        if (days > 0 && trialEndsAt) {
          await resend.emails.send({
            from: "TOL.AR <ventas@tiendaonline.com.ar>",
            to: notifyEmail,
            bcc: "soporte@tiendaonline.com.ar",
            subject: `Empezó tu prueba gratis de ${featureNames} en tol.ar`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <h1 style="color:#96305a">Prueba gratis activada</h1>
              <p>Activamos <strong>${featureNames}</strong> gratis por ${days} días en ${store?.subdomain ? `${store.subdomain}.tol.ar` : "tu tienda"}.</p>
              <p>Guardamos tu tarjeta con Mercado Pago para que, si no cancelás antes, se cobre sola cuando termine la prueba (el ${trialEndsAt.toLocaleDateString("es-AR")}).</p>
              <p>Te vamos a avisar por mail unos días antes de que se haga el cobro, para que tengas tiempo de cancelar si no querés seguir.</p>
              <p style="font-size:13px;color:#666">Podés cancelar cuando quieras desde tu panel. Si se hace el cobro automático al terminar la prueba, tenés derecho a arrepentirte de esa compra dentro de los 10 días corridos desde el cobro, sin necesidad de justificar el motivo (Ley 24.240).</p>
              <p><a href="https://${store?.subdomain || ""}.tol.ar/admin?tab=planes" style="color:#96305a">Ver mis cositas</a></p>
            </div>`,
          })
        } else {
          await resend.emails.send({
            from: "TOL.AR <ventas@tiendaonline.com.ar>",
            to: notifyEmail,
            bcc: "soporte@tiendaonline.com.ar",
            subject: `Tu suscripción de ${featureNames} ya está activa - TOL.AR`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <h1 style="color:#96305a">Pago confirmado</h1>
              <p>Cobramos <strong>$${amount.toLocaleString("es-AR")} ARS</strong> y activamos <strong>${featureNames}</strong> en ${store?.subdomain ? `${store.subdomain}.tol.ar` : "tu tienda"}.</p>
              <p>Guardamos tu tarjeta con Mercado Pago para cobrarte este mismo monto automáticamente cada mes, hasta que canceles.</p>
              <p style="font-size:13px;color:#666">Podés cancelar cuando quieras desde tu panel, antes de la próxima fecha de cobro.</p>
              <p><a href="https://${store?.subdomain || ""}.tol.ar/admin?tab=planes" style="color:#96305a">Ver mis cositas</a></p>
            </div>`,
          })
        }
      }
    } catch (emailError) {
      console.error("[MP create-subscription] Error enviando email:", emailError)
    }

    return NextResponse.json({ ok: true, preapprovalId: mpData.id, status: mpData.status, trialEndsAt: trialEndsAt ? trialEndsAt.toISOString() : null })
  } catch (error) {
    console.error("[MP create-subscription] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
