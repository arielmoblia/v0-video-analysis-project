import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

function generarCodigo() {
  return `ARR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

// Botón de arrepentimiento (Disposición 954/2025): solicitud sin login, con
// código de constancia inmediato para el comprador y aviso a la tienda.
export async function POST(request: Request) {
  try {
    const { nombre, email, numeroPedido, motivo, storeId, storeName, storeEmail } = await request.json()

    if (!nombre || !email || !storeId || !storeEmail) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const codigo = generarCodigo()

    const { error: dbError } = await supabase.from("arrepentimiento_solicitudes").insert({
      store_id: storeId,
      codigo,
      nombre,
      email,
      numero_pedido: numeroPedido || null,
      motivo: motivo || null,
    })

    if (dbError) {
      console.error("Error guardando solicitud de arrepentimiento:", dbError)
      return NextResponse.json({ error: "Error al registrar la solicitud" }, { status: 500 })
    }

    await resend.emails.send({
      from: `${storeName} - Arrepentimiento <ventas@tiendaonline.com.ar>`,
      to: storeEmail,
      subject: `Solicitud de arrepentimiento - Código ${codigo}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background:#000; color:#fff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:22px;">${storeName}</h1>
              <p style="margin:10px 0 0 0; opacity:.8;">Nueva solicitud de arrepentimiento de compra</p>
            </div>
            <div style="padding:30px; background:#f9f9f9;">
              <p><strong>Código:</strong> ${codigo}</p>
              <p><strong>Cliente:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${numeroPedido ? `<p><strong>Número de pedido:</strong> ${numeroPedido}</p>` : ""}
              ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ""}
              <p style="margin-top:20px; color:#b91c1c; font-weight:bold;">
                Recordá confirmar esta solicitud dentro de las 24 horas (Disposición 954/2025).
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    await resend.emails.send({
      from: `${storeName} <ventas@tiendaonline.com.ar>`,
      to: email,
      subject: `Recibimos tu solicitud de arrepentimiento - Código ${codigo}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background:#000; color:#fff; padding:30px; text-align:center;">
              <h1 style="margin:0; font-size:22px;">${storeName}</h1>
            </div>
            <div style="padding:30px; background:#f9f9f9; text-align:center;">
              <h2>Recibimos tu solicitud de arrepentimiento</h2>
              <p>Hola ${nombre},</p>
              <p>Tu código de arrepentimiento es:</p>
              <p style="font-size:24px; font-weight:bold; letter-spacing:2px;">${codigo}</p>
              <p>La tienda tiene 24 horas para confirmar tu solicitud. Guardá este código como constancia.</p>
              <p style="margin-top:30px; color:#666; font-size:14px;">
                Este es un mensaje automático. No respondas a este email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, codigo })
  } catch (error) {
    console.error("Error procesando solicitud de arrepentimiento:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
