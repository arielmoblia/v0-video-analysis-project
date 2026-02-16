import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Esta API se ejecuta diariamente via Vercel Cron
// Configura en vercel.json: { "crons": [{ "path": "/api/cron/trial-reminders", "schedule": "0 9 * * *" }] }

export async function GET(request: NextRequest) {
  try {
    // Verificar que es una llamada de cron (opcional: agregar secret)
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
    if (!resendApiKey) {
      return NextResponse.json({ error: "Resend API key no configurada" }, { status: 500 })
    }

    const { Resend } = await import("resend")
    const resend = new Resend(resendApiKey)

    // Obtener tiendas en trial que necesitan recordatorio
    const { data: trialStores, error } = await supabase
      .from("stores")
      .select("*")
      .eq("is_trial", true)
      .order("trial_expires_at", { ascending: true })

    if (error) {
      console.error("Error fetching trial stores:", error)
      return NextResponse.json({ error: "Error al obtener tiendas" }, { status: 500 })
    }

    const now = new Date()
    const results = {
      reminders_sent: 0,
      stores_deleted: 0,
      skipped_protected: 0,
      errors: [] as string[],
    }

    for (const store of trialStores || []) {
      // NUNCA borrar tiendas que son templates (tienen template_type definido) o arielmobilia
      if (store.template_type || store.subdomain === "arielmobilia") {
        results.skipped_protected++
        continue
      }
      const trialExpires = new Date(store.trial_expires_at)
      const daysLeft = Math.ceil((trialExpires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const warningsSent = store.warning_emails_sent || 0

      // Si ya expiro, eliminar la tienda
      if (daysLeft <= 0) {
        try {
          // Guardar datos en deleted_stores antes de eliminar
          await supabase.from("deleted_stores").insert({
            original_store_id: store.id,
            username: store.username,
            email: store.email,
            subdomain: store.subdomain,
            site_title: store.site_title,
            plan: store.plan || "free",
            created_at: store.created_at,
            deleted_at: new Date().toISOString(),
            reason: "inactividad",
          })

          // Enviar email de eliminacion
          await resend.emails.send({
            from: "TOL.AR <ventas@tiendaonline.com.ar>",
            to: store.email,
            subject: `Tu tienda ${store.site_title} fue eliminada - TOL.AR`,
            html: getDeletedEmail(store),
          })

          // Eliminar productos, categorias y la tienda
          await supabase.from("products").delete().eq("store_id", store.id)
          await supabase.from("categories").delete().eq("store_id", store.id)
          await supabase.from("payment_methods").delete().eq("store_id", store.id)
          await supabase.from("shipping_methods").delete().eq("store_id", store.id)
          await supabase.from("stores").delete().eq("id", store.id)

          results.stores_deleted++
        } catch (err) {
          results.errors.push(`Error eliminando ${store.subdomain}: ${err}`)
        }
        continue
      }

      // Determinar que tipo de recordatorio enviar
      let emailHtml = ""
      let subject = ""

      if (daysLeft <= 1 && warningsSent < 7) {
        // ULTIMO DIA - Email urgente
        subject = `ULTIMA OPORTUNIDAD: Tu tienda ${store.site_title} se elimina MANANA`
        emailHtml = getUrgentEmail(store, daysLeft)
      } else if (daysLeft <= 2 && warningsSent < 6) {
        // 2 dias - Advertencia roja
        subject = `URGENTE: Tu tienda ${store.site_title} se elimina en ${daysLeft} dias`
        emailHtml = getWarningEmail(store, daysLeft)
      } else if (daysLeft <= 5 && warningsSent < daysLeft) {
        // 3-5 dias - Recordatorio amarillo
        subject = `Recordatorio: Tu tienda ${store.site_title} - ${daysLeft} dias restantes`
        emailHtml = getReminderEmail(store, daysLeft)
      } else {
        // No enviar email hoy
        continue
      }

      try {
        await resend.emails.send({
          from: "TOL.AR <ventas@tiendaonline.com.ar>",
          to: store.email,
          subject,
          html: emailHtml,
        })

        // Actualizar contador de emails enviados
        await supabase
          .from("stores")
          .update({ warning_emails_sent: warningsSent + 1 })
          .eq("id", store.id)

        results.reminders_sent++
      } catch (err) {
        results.errors.push(`Error enviando a ${store.email}: ${err}`)
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      processed: trialStores?.length || 0,
    })
  } catch (error) {
    console.error("Error in trial-reminders cron:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// Email amigable (dias 3-5)
function getReminderEmail(store: any, daysLeft: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8b5cf6;">Recordatorio: Tu tienda te espera</h1>
      
      <p>Hola ${store.username},</p>
      
      <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="color: #92400e; margin: 0; font-size: 16px;">
          Te quedan <strong>${daysLeft} dias</strong> para configurar tu tienda 
          <strong>${store.site_title}</strong> antes de que sea eliminada.
        </p>
      </div>
      
      <p>Entra a tu panel de administracion y agrega tus productos:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${store.admin_url}" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Ir al Admin
        </a>
      </p>
      
      <p style="color: #6b7280; font-size: 12px;">
        Cada vez que entres al admin, se reinicia el contador de 7 dias.
      </p>
    </div>
  `
}

// Email de advertencia (dias 2)
function getWarningEmail(store: any, daysLeft: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626;">ADVERTENCIA: Tu tienda sera eliminada pronto</h1>
      
      <p>Hola ${store.username},</p>
      
      <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="color: #dc2626; margin: 0; font-size: 18px; font-weight: bold;">
          Tu tienda ${store.site_title} sera ELIMINADA en ${daysLeft} dias 
          si no hay actividad.
        </p>
      </div>
      
      <p>Para evitar la eliminacion, simplemente entra a tu panel de administracion:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${store.admin_url}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          ENTRAR AHORA
        </a>
      </p>
      
      <p><strong>Tus credenciales:</strong></p>
      <ul>
        <li>URL: ${store.admin_url}</li>
        <li>Usuario: ${store.username}</li>
        <li>Contrasena: (la que recibiste al crear la tienda)</li>
      </ul>
    </div>
  `
}

// Email urgente (ultimo dia)
function getUrgentEmail(store: any, daysLeft: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">ULTIMA OPORTUNIDAD</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Hola ${store.username},</p>
        
        <div style="background: #fef2f2; border: 3px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="color: #dc2626; margin: 0; font-size: 20px; font-weight: bold;">
            TU TIENDA SE ELIMINA MANANA
          </p>
          <p style="color: #991b1b; margin: 10px 0 0 0;">
            ${store.site_title} (${store.subdomain}.tol.ar)
          </p>
        </div>
        
        <p style="font-size: 16px;">
          Esta es tu <strong>ultima oportunidad</strong> de conservar tu tienda. 
          Si no entras al panel de administracion antes de manana, 
          <strong>todos tus datos seran eliminados permanentemente</strong>.
        </p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${store.admin_url}" style="background: #dc2626; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
            SALVAR MI TIENDA
          </a>
        </p>
        
        <p style="color: #6b7280; font-size: 13px;">
          Si ya no deseas tu tienda, puedes ignorar este mensaje y sera eliminada automaticamente.
        </p>
      </div>
    </div>
  `
}

// Email de eliminacion
function getDeletedEmail(store: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6b7280;">Tu tienda fue eliminada</h1>
      
      <p>Hola ${store.username},</p>
      
      <p>
        Tu tienda <strong>${store.site_title}</strong> (${store.subdomain}.tol.ar) 
        fue eliminada porque no hubo actividad en los ultimos 7 dias.
      </p>
      
      <p>Si cambias de opinion, siempre podes crear una nueva tienda en:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="https://tol.ar/plan-gratis" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Crear Nueva Tienda
        </a>
      </p>
      
      <p style="color: #6b7280; font-size: 12px;">
        Gracias por probar TOL.AR
      </p>
    </div>
  `
}
