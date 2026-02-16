import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  selectedSize?: string
  image_url?: string
}

interface SendOrderEmailParams {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  storeName: string
  storeEmail?: string
  items: OrderItem[]
  total: number
  shippingMethod: string
  shippingAddress?: string
  paymentMethod: string
  status: string
  refundReason?: string
  notes?: string
}

const statusMessages: Record<string, { subject: string; title: string; message: string }> = {
  pending: {
    subject: "Recibimos tu pedido",
    title: "¡Gracias por tu compra!",
    message: "Hemos recibido tu pedido y lo estamos procesando. Te avisaremos cuando esté confirmado.",
  },
  confirmed: {
    subject: "Tu pedido fue confirmado",
    title: "¡Pedido confirmado!",
    message: "Tu pedido ha sido confirmado y estamos preparándolo para el envío.",
  },
  shipped: {
    subject: "Tu pedido está en camino",
    title: "¡Tu pedido está en camino!",
    message: "Tu pedido ha sido enviado y está en camino a tu dirección.",
  },
  delivered: {
    subject: "Tu pedido fue entregado",
    title: "¡Pedido entregado!",
    message: "Tu pedido ha sido entregado. ¡Esperamos que disfrutes tu compra!",
  },
  cancelled: {
    subject: "Tu pedido fue cancelado",
    title: "Pedido cancelado",
    message: "Lamentamos informarte que tu pedido ha sido cancelado.",
  },
  refunded: {
    subject: "Reembolso procesado",
    title: "Reembolso procesado",
    message: "Hemos procesado el reembolso de tu pedido. El dinero estará disponible en tu cuenta pronto.",
  },
}

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta de crédito/débito",
  transfer: "Transferencia bancaria",
  mercadopago: "Mercado Pago",
}

export async function sendOrderEmail(params: SendOrderEmailParams): Promise<boolean> {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      storeName,
      storeEmail,
      items,
      total,
      shippingMethod,
      shippingAddress,
      paymentMethod,
      status,
      refundReason,
      notes,
    } = params

    const statusInfo = statusMessages[status] || statusMessages.pending

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; width: 80px;">
            ${
              item.image_url
                ? `<img src="${item.image_url}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;" />`
                : `<div style="width: 70px; height: 70px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Sin imagen</div>`
            }
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong style="font-size: 15px;">${item.name}</strong>
            ${
              item.selectedSize
                ? `<br/><span style="display: inline-block; margin-top: 5px; background: #000; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 13px;">Talle: ${item.selectedSize}</span>`
                : ""
            }
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            $${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      `,
      )
      .join("")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${storeName}</h1>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #000; margin-bottom: 10px;">${statusInfo.title}</h2>
            <p style="color: #666; margin-bottom: 20px;">${statusInfo.message}</p>
            
            ${
              status === "refunded" && refundReason
                ? `
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <strong>Motivo del reembolso:</strong><br/>
                ${refundReason}
              </div>
            `
                : ""
            }
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0;"><strong>Número de pedido:</strong> #${orderId.slice(0, 8)}</p>
              <p style="margin: 5px 0 0;"><strong>Cliente:</strong> ${customerName}</p>
            </div>
            
            <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px;">Productos</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left;">Imagen</th>
                  <th style="padding: 12px; text-align: left;">Producto</th>
                  <th style="padding: 12px; text-align: center;">Cant.</th>
                  <th style="padding: 12px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px; font-weight: bold; font-size: 18px;">Total</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">$${total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <h4 style="margin-top: 0;">Detalles del envío</h4>
              <p style="margin: 5px 0;">
                <strong>Método:</strong> ${shippingMethod === "pickup" ? "Retiro en local" : "Envío a domicilio"}
              </p>
              ${shippingAddress ? `<p style="margin: 5px 0;"><strong>Dirección:</strong> ${shippingAddress}</p>` : ""}
              <p style="margin: 5px 0;">
                <strong>Pago:</strong> ${paymentLabels[paymentMethod] || paymentMethod}
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">Gracias por comprar en ${storeName}</p>
            <p style="margin: 5px 0 0;">
              <a href="https://tol.ar" style="color: #000;">Powered by tol.ar</a>
            </p>
          </div>
        </body>
      </html>
    `

    // Enviar email al cliente
    const { error } = await resend.emails.send({
      from: `${storeName} <ventas@tiendaonline.com.ar>`,
      to: customerEmail,
      subject: `${statusInfo.subject} - ${storeName}`,
      html: emailHtml,
    })

    if (error) {
      console.error("Error enviando email al cliente:", error)
    }

    // Enviar notificacion al vendedor (solo para pedidos nuevos)
    if (storeEmail && status === "pending") {
      const sellerEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #22c55e; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Nueva Venta</h1>
            </div>
            
            <div style="padding: 30px 20px;">
              <h2 style="color: #22c55e; margin-bottom: 10px;">Tenes un nuevo pedido!</h2>
              <p style="color: #666; margin-bottom: 20px;">Un cliente acaba de realizar una compra en tu tienda.</p>
              
              <div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong>Pedido:</strong> #${orderId.slice(0, 8)}</p>
                <p style="margin: 5px 0 0;"><strong>Total:</strong> $${total.toLocaleString()}</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-top: 0;">Datos del cliente</h4>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
                ${customerPhone ? `<p style="margin: 5px 0;"><strong>Telefono:</strong> ${customerPhone}</p>` : ""}
              </div>
              
              <h3 style="border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Productos</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: left;">Producto</th>
                    <th style="padding: 12px; text-align: center;">Cant.</th>
                    <th style="padding: 12px; text-align: right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => `
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        <strong>${item.name}</strong>
                        ${item.selectedSize ? `<br/><span style="background: #000; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Talle: ${item.selectedSize}</span>` : ""}
                      </td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Envio:</strong> ${shippingMethod === "pickup" ? "Retiro en local" : "Envio a domicilio"}</p>
                ${shippingAddress ? `<p style="margin: 5px 0;"><strong>Direccion:</strong> ${shippingAddress}</p>` : ""}
                <p style="margin: 5px 0;"><strong>Pago:</strong> ${paymentLabels[paymentMethod] || paymentMethod}</p>
              </div>
              
              ${notes ? `
                <div style="margin-top: 20px; padding: 15px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px;">
                  <h4 style="margin-top: 0;">Observaciones del cliente</h4>
                  <p style="margin: 0;">${notes}</p>
                </div>
              ` : ""}
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://${storeName.toLowerCase().replace(/\s+/g, "")}.tol.ar/admin" style="display: inline-block; background: #22c55e; color: #fff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Ver pedido en el panel
                </a>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">Notificacion de <a href="https://tol.ar" style="color: #22c55e;">tol.ar</a></p>
            </div>
          </body>
        </html>
      `

      const { error: sellerError } = await resend.emails.send({
        from: `tol.ar <notificaciones@tiendaonline.com.ar>`,
        to: storeEmail,
        subject: `Nueva venta! Pedido #${orderId.slice(0, 8)} - $${total.toLocaleString()}`,
        html: sellerEmailHtml,
      })

      if (sellerError) {
        console.error("Error enviando email al vendedor:", sellerError)
      }
    }

    return true
  } catch (error) {
    console.error("Error en sendOrderEmail:", error)
    return false
  }
}
