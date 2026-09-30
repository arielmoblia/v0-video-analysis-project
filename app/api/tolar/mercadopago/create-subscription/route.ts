import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

// Crea una suscripción (preapproval) de Mercado Pago con free_trial para
// arrancar la prueba gratis de una "cosita" con tarjeta guardada. Cuando el
// trial termina, Mercado Pago cobra solo (no hace falta que nuestro backend
// dispare nada) y avisa por webhook (ver app/api/tolar/mercadopago/webhook).
//
// Flujo: el cliente carga la tarjeta en el Brick de MP (en el navegador),
// eso genera un card_token_id de un solo uso, y acá lo mandamos a MP junto
// con los datos de la prueba.
export async function POST(request: NextRequest) {
  try {
    const {
      storeId,
      featureCode,
      featureName,
      trialDays,
      cardToken,
      payerEmail,
      transactionAmountARS,
    } = await request.json()

    if (!storeId || !featureCode || !cardToken || !payerEmail || !trialDays) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // No permitir arrancar dos veces la misma prueba para la misma tienda/cosita
    const { data: existing } = await supabase
      .from("store_purchased_features")
      .select("id, mp_preapproval_id, mp_subscription_status, is_active")
      .eq("store_id", storeId)
      .eq("feature_code", featureCode)
      .maybeSingle()

    if (existing?.mp_preapproval_id && existing.is_active) {
      return NextResponse.json({ error: "Ya tiene una suscripción activa para esta función" }, { status: 400 })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: "Mercado Pago no está configurado" }, { status: 500 })
    }

    const amount = Number(transactionAmountARS)
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 })
    }

    const externalReference = `cosita_trial_${storeId}_${featureCode}_${Date.now()}`
    const host = request.headers.get("host") || "tol.ar"

    const preapprovalBody = {
      reason: `Cosita tol.ar: ${featureName || featureCode}`,
      external_reference: externalReference,
      payer_email: payerEmail,
      card_token_id: cardToken,
      back_url: `https://${host}/admin?tab=planes`,
      status: "authorized",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: amount,
        currency_id: "ARS",
        free_trial: {
          frequency: trialDays,
          frequency_type: "days",
        },
      },
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

    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + Number(trialDays))

    const { error: dbError } = await supabase
      .from("store_purchased_features")
      .upsert(
        {
          store_id: storeId,
          feature_code: featureCode,
          feature_name: featureName || null,
          is_active: true,
          is_trial: true,
          trial_ends_at: trialEndsAt.toISOString(),
          payment_method: "mercadopago_subscription",
          mp_preapproval_id: mpData.id,
          mp_subscription_status: mpData.status || "authorized",
          mp_payer_email: payerEmail,
          activated_at: new Date().toISOString(),
          charge_reminder_sent_at: null,
        },
        { onConflict: "store_id,feature_code" }
      )

    if (dbError) {
      console.error("[MP create-subscription] Error guardando en DB:", dbError)
      // La suscripción en MP ya se creó; devolvemos error para que se pueda reintentar
      // guardar, pero no dejamos a MP cobrando sin registro nuestro.
      return NextResponse.json({ error: "Error al guardar la suscripción" }, { status: 500 })
    }

    // Mail de bienvenida al trial (no es el aviso de cobro, ese lo manda el cron aparte)
    try {
      const { data: store } = await supabase
        .from("stores")
        .select("email, subdomain, site_title")
        .eq("id", storeId)
        .single()

      const notifyEmail = store?.email || payerEmail
      if (notifyEmail) {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESENDAPIKEY)
        await resend.emails.send({
          from: "TOL.AR <ventas@tiendaonline.com.ar>",
          to: notifyEmail,
          bcc: "soporte@tiendaonline.com.ar",
          subject: `Empezó tu prueba gratis de ${featureName || featureCode} en tol.ar`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h1 style="color:#96305a">Prueba gratis activada</h1>
            <p>Activamos <strong>${featureName || featureCode}</strong> gratis por ${trialDays} días en ${store?.subdomain ? `${store.subdomain}.tol.ar` : "tu tienda"}.</p>
            <p>Guardamos tu tarjeta con Mercado Pago para que, si no cancelás antes, se cobre sola cuando termine la prueba (el ${trialEndsAt.toLocaleDateString("es-AR")}).</p>
            <p>Te vamos a avisar por mail unos días antes de que se haga el cobro, para que tengas tiempo de cancelar si no querés seguir.</p>
            <p style="font-size:13px;color:#666">Podés cancelar cuando quieras desde tu panel. Si se hace el cobro automático al terminar la prueba, tenés derecho a arrepentirte de esa compra dentro de los 10 días corridos desde el cobro, sin necesidad de justificar el motivo (Ley 24.240).</p>
            <p><a href="https://${store?.subdomain || ""}.tol.ar/admin?tab=planes" style="color:#96305a">Ver mis cositas</a></p>
          </div>`,
        })
      }
    } catch (emailError) {
      console.error("[MP create-subscription] Error enviando email:", emailError)
    }

    return NextResponse.json({ ok: true, preapprovalId: mpData.id, status: mpData.status, trialEndsAt: trialEndsAt.toISOString() })
  } catch (error) {
    console.error("[MP create-subscription] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
