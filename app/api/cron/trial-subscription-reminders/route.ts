import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Cron diario: avisa por mail 2-3 días ANTES de que Mercado Pago cobre el
// fin de la prueba gratis de una cosita (para dar tiempo a cancelar antes
// del cobro - tema legal de "botón de arrepentimiento" / derecho de
// cancelación). Distinto del cron app/api/cron/trial-reminders (ese es para
// tiendas del plan gratis inactivas, no toca esta lógica).
// vercel.json: { "crons": [{ "path": "/api/cron/trial-subscription-reminders", "schedule": "0 12 * * *" }] }

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const resendApiKey = process.env.RESEND_API_KEY || process.env.RESENDAPIKEY
    const resend = resendApiKey ? new (await import("resend")).Resend(resendApiKey) : null

    const now = new Date()
    const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    // Solo pruebas con tarjeta guardada (mp_preapproval_id) que vencen entre
    // 2 y 3 días desde ahora y todavía no recibieron el aviso.
    const { data: trials, error } = await supabase
      .from("store_purchased_features")
      .select("id, store_id, feature_code, feature_name, trial_ends_at, mp_preapproval_id, mp_subscription_status")
      .eq("is_trial", true)
      .eq("is_active", true)
      .not("mp_preapproval_id", "is", null)
      .is("charge_reminder_sent_at", null)
      .gte("trial_ends_at", in2Days.toISOString())
      .lte("trial_ends_at", in3Days.toISOString())

    if (error) {
      return NextResponse.json({ error: "Error al obtener pruebas activas" }, { status: 500 })
    }

    const results = { reminders_sent: 0, skipped: 0, errors: [] as string[] }

    for (const trial of trials || []) {
      try {
        const { data: store } = await supabase
          .from("stores")
          .select("email, subdomain, site_title")
          .eq("id", trial.store_id)
          .single()

        const { data: feature } = await supabase
          .from("store_features")
          .select("name, price")
          .eq("code", trial.feature_code)
          .maybeSingle()

        if (!store?.email) {
          results.skipped++
          continue
        }

        const featureName = trial.feature_name || feature?.name || trial.feature_code
        const chargeDate = new Date(trial.trial_ends_at)
        const chargeDateStr = chargeDate.toLocaleDateString("es-AR", { day: "numeric", month: "long" })
        const planUrl = `https://${store.subdomain}.tol.ar/admin?tab=planes`

        if (resend) {
          await resend.emails.send({
            from: "TOL.AR <ventas@tiendaonline.com.ar>",
            to: store.email,
            bcc: "soporte@tiendaonline.com.ar",
            subject: `Termina tu prueba de ${featureName} el ${chargeDateStr} - se va a cobrar`,
            html: getReminderEmail(store, featureName, chargeDateStr, planUrl),
          })
        }

        await supabase
          .from("store_purchased_features")
          .update({ charge_reminder_sent_at: new Date().toISOString() })
          .eq("id", trial.id)

        results.reminders_sent++
      } catch (err) {
        results.errors.push(`Error avisando a tienda ${trial.store_id}: ${err}`)
      }
    }

    return NextResponse.json({ success: true, ...results, processed: trials?.length || 0 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

function getReminderEmail(store: any, featureName: string, chargeDateStr: string, planUrl: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <h1 style="color:#f97316">Tu prueba gratis está por terminar</h1>
    <p>Hola,</p>
    <div style="background:#fff7ed;border:2px solid #f97316;border-radius:8px;padding:16px;margin:20px 0">
      <p style="margin:0;color:#9a3412">
        El <strong>${chargeDateStr}</strong> termina tu prueba gratis de <strong>${featureName}</strong> en
        <strong> ${store.site_title || store.subdomain + ".tol.ar"}</strong> y se va a cobrar automáticamente
        con la tarjeta que guardaste.
      </p>
    </div>
    <p>Si querés seguir usándola, no hace falta que hagas nada.</p>
    <p>Si NO querés que se cobre, cancelala antes de esa fecha desde tu panel:</p>
    <p style="text-align:center;margin:30px 0">
      <a href="${planUrl}" style="background:#f97316;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold">
        Ir a mis cositas
      </a>
    </p>
    <p style="color:#666;font-size:12px">Ahí vas a ver un botón "Cancelar" al lado de ${featureName}.</p>
  </div>`
}
