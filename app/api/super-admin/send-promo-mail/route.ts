import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { emails, subject, html } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No hay destinatarios" }, { status: 400 })
    }
    if (!subject || !html) {
      return NextResponse.json({ error: "Faltan asunto o contenido" }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: "RESEND_API_KEY no configurada" }, { status: 500 })
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
          const result = await resend.emails.send({
            from: "TOL.AR <ventas@tiendaonline.com.ar>",
            to: email,
            subject,
            html,
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
    }

    return NextResponse.json({ sent, failed, total: emails.length, errors: errors.slice(0, 5) })
  } catch (error: any) {
    console.error("Error en send-promo-mail:", error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
