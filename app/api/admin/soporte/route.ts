import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { storeName, subdomain, storeEmail, message } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 })
    }

    await resend.emails.send({
      from: `tol.ar - Soporte <ventas@tiendaonline.com.ar>`,
      to: "soporte@tiendaonline.com.ar",
      replyTo: storeEmail || undefined,
      subject: `Soporte - ${storeName} (${subdomain}.tol.ar)`,
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
            .message-box { background: white; padding: 20px; border-left: 4px solid #000; margin-top: 20px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0; font-size: 24px;">tol.ar</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.8;">Pedido de soporte desde el panel</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Tienda</div>
                <div class="value">${storeName} (${subdomain}.tol.ar)</div>
              </div>
              ${
                storeEmail
                  ? `<div class="field">
                <div class="label">Email de contacto</div>
                <div class="value"><a href="mailto:${storeEmail}">${storeEmail}</a></div>
              </div>`
                  : ""
              }
              <div class="message-box">${message}</div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending support email:", error)
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 })
  }
}
