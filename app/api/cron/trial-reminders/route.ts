import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Cron diario: marca como inactivas las tiendas sin actividad en 7 dias
// vercel.json: { "crons": [{ "path": "/api/cron/trial-reminders", "schedule": "0 9 * * *" }] }

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

    // Tiendas activas, no templates, no arielmobilia
    const { data: activeStores, error } = await supabase
      .from("stores")
      .select("*")
      .eq("status", "active")
      .eq("plan", "free")
      .order("updated_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: "Error al obtener tiendas" }, { status: 500 })
    }

    const now = new Date()
    const INACTIVITY_DAYS = 7
    const results = { reminders_sent: 0, stores_deactivated: 0, skipped: 0, errors: [] as string[] }

    for (const store of activeStores || []) {
      // Proteger templates y arielmobilia
      if (store.subdomain === "arielmobilia" || store.plan === "templates") {
        results.skipped++
        continue
      }

      const lastActivity = new Date(store.updated_at)
      const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      const daysLeft = INACTIVITY_DAYS - daysSinceActivity

      // 7+ dias sin actividad -> marcar inactiva (soft delete, datos se conservan)
      if (daysLeft <= 0) {
        try {
          await supabase.from("stores").update({ status: "inactive" }).eq("id", store.id)
          if (resend && store.email) {
            await resend.emails.send({
              from: "TOL.AR <ventas@tiendaonline.com.ar>",
              to: store.email,
              subject: `Tu tienda ${store.site_title} fue desactivada - TOL.AR`,
              html: getDeletedEmail(store),
            })
          }
          results.stores_deactivated++
        } catch (err) {
          results.errors.push(`Error desactivando ${store.subdomain}: ${err}`)
        }
        continue
      }

      // Recordatorios por email (dias 1-5 restantes)
      const warningsSent = store.warning_emails_sent || 0
      let subject = ""
      let emailHtml = ""

      if (daysLeft <= 1 && warningsSent < 7) {
        subject = `ULTIMA OPORTUNIDAD: Tu tienda ${store.site_title} se desactiva MANANA`
        emailHtml = getUrgentEmail(store, daysLeft)
      } else if (daysLeft <= 2 && warningsSent < 6) {
        subject = `URGENTE: Tu tienda ${store.site_title} se desactiva en ${daysLeft} dias`
        emailHtml = getWarningEmail(store, daysLeft)
      } else if (daysLeft <= 5 && warningsSent < daysLeft) {
        subject = `Recordatorio: Tu tienda ${store.site_title} - ${daysLeft} dias restantes`
        emailHtml = getReminderEmail(store, daysLeft)
      } else {
        continue
      }

      try {
        if (resend && store.email) {
          await resend.emails.send({ from: "TOL.AR <ventas@tiendaonline.com.ar>", to: store.email, subject, html: emailHtml })
          await supabase.from("stores").update({ warning_emails_sent: warningsSent + 1 }).eq("id", store.id)
          results.reminders_sent++
        }
      } catch (err) {
        results.errors.push(`Error enviando a ${store.email}: ${err}`)
      }
    }

    return NextResponse.json({ success: true, ...results, processed: activeStores?.length || 0 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

function getReminderEmail(store: any, daysLeft: number) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h1 style="color:#8b5cf6">Recordatorio: Tu tienda te espera</h1><p>Hola ${store.username},</p><div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:15px;margin:20px 0"><p style="color:#92400e;margin:0">Te quedan <strong>${daysLeft} dias</strong> para que tu tienda <strong>${store.site_title}</strong> sea desactivada por inactividad.</p></div><p style="text-align:center;margin:30px 0"><a href="${store.admin_url}" style="background:#8b5cf6;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold">Ir al Admin</a></p><p style="color:#6b7280;font-size:12px">Cada vez que entres al admin se reinicia el contador de 7 dias.</p></div>`
}

function getWarningEmail(store: any, daysLeft: number) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h1 style="color:#dc2626">ADVERTENCIA: Tu tienda sera desactivada pronto</h1><p>Hola ${store.username},</p><div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:15px;margin:20px 0"><p style="color:#dc2626;margin:0;font-size:18px;font-weight:bold">Tu tienda ${store.site_title} sera DESACTIVADA en ${daysLeft} dias si no hay actividad.</p></div><p style="text-align:center;margin:30px 0"><a href="${store.admin_url}" style="background:#dc2626;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold">ENTRAR AHORA</a></p></div>`
}

function getUrgentEmail(store: any, daysLeft: number) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:#dc2626;color:white;padding:20px;text-align:center"><h1 style="margin:0">ULTIMA OPORTUNIDAD</h1></div><div style="padding:20px"><p>Hola ${store.username},</p><div style="background:#fef2f2;border:3px solid #dc2626;border-radius:8px;padding:20px;margin:20px 0;text-align:center"><p style="color:#dc2626;margin:0;font-size:20px;font-weight:bold">TU TIENDA SE DESACTIVA MANANA</p><p style="color:#991b1b;margin:10px 0 0 0">${store.site_title} (${store.subdomain}.tol.ar)</p></div><p style="text-align:center;margin:30px 0"><a href="${store.admin_url}" style="background:#dc2626;color:white;padding:20px 40px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:18px">SALVAR MI TIENDA</a></p></div></div>`
}

function getDeletedEmail(store: any) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><h1 style="color:#6b7280">Tu tienda fue desactivada</h1><p>Hola ${store.username},</p><p>Tu tienda <strong>${store.site_title}</strong> (${store.subdomain}.tol.ar) fue desactivada por inactividad (7 dias sin actividad).</p><p>Si queres reactivarla, contactanos o crea una nueva:</p><p style="text-align:center;margin:30px 0"><a href="https://tol.ar/plan-gratis" style="background:#8b5cf6;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold">Crear Nueva Tienda</a></p></div>`
}
