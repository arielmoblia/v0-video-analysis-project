import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    await resend.emails.send({
      from: `tol.ar - Contacto <ventas@tiendaonline.com.ar>`,
      to: "info@tiendaonline.com.ar",
      subject: `[tol.ar] Nuevo mensaje: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #000; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0; font-size: 24px;">tol.ar</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.8;">Nuevo mensaje de contacto</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${
                phone
                  ? `
              <div class="field">
                <div class="label">Teléfono</div>
                <div class="value">${phone}</div>
              </div>
              `
                  : ""
              }
              <div class="field">
                <div class="label">Asunto</div>
                <div class="value">${subject}</div>
              </div>
              <div class="message-box">
                <div class="label">Mensaje</div>
                <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // Enviar confirmación al usuario
    await resend.emails.send({
      from: `tol.ar <ventas@tiendaonline.com.ar>`,
      to: email,
      subject: `Recibimos tu mensaje - tol.ar`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .icon { font-size: 48px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0; font-size: 24px;">tol.ar</h1>
            </div>
            <div class="content" style="text-align: center;">
              <div class="icon">✉️</div>
              <h2>¡Recibimos tu mensaje!</h2>
              <p>Hola ${name},</p>
              <p>Gracias por contactarnos. Hemos recibido tu mensaje sobre "${subject}" y te responderemos a la brevedad.</p>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Este es un mensaje automático. No respondas a este email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending contact email:", error)
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 })
  }
}
