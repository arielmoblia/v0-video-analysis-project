export const maxDuration = 300

import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { emails, subject, html, stores } = await request.json()
    const storeMap: Record<string,string> = {}
    if (stores) stores.forEach((s: any) => { storeMap[s.email] = s.subdomain })

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No hay destinatarios" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }
    if (!subject || !html) {
      return NextResponse.json({ error: "Faltan asunto o contenido" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: "RESEND_API_KEY no configurada" }, { status: 500, headers: { "Cache-Control": "no-store" } })
    }

    const resend = new Resend(resendKey)
    let sent = 0
    let failed = 0
    const errors: string[] = []

    // Enviar en lotes de 5 para no sobrecargar
    const batchSize = 5
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      const promises = batch.map(async (email: string) => {
        try {
          const storeName = storeMap[email] || email
          const personalizedHtml = html
            .replace(/\[nombre de la tienda\]/g, storeName)
            .replace(/\[link\]/g, `https://tol.ar/promocion-redes/${storeName}`)
          const result = await resend.emails.send({
            from: "TOL.AR <noticias@tiendaonline.com.ar>",
            to: email,
            subject,
            html: personalizedHtml,
          })
          if (result.error) {
            console.error(`Error Resend para ${email}:`, result.error)
            errors.push(`${email}: ${result.error.message}`)
            failed++
          } else {
            sent++
          }
        } catch (err: any) {
          console.error(`Error enviando a ${email}:`, err)
          errors.push(`${email}: ${err.message || "Error desconocido"}`)
          failed++
        }
      })
      await Promise.all(promises)
      await new Promise(resolve => setTimeout(resolve, 1200))
    }

    return NextResponse.json({ sent, failed, total: emails.length, errors: errors.slice(0, 5) }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error: any) {
    console.error("Error en send-promo-mail:", error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
