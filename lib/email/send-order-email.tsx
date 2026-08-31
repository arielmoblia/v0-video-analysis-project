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

interface PaymentData {
  // Transferencia
  transfer_bank_name?: string
  transfer_account_holder?: string
  transfer_cbu?: string
  transfer_alias?: string
  store_email?: string
  // MODO
  modo_phone?: string
  // Ualá
  uala_link?: string
  // Rapipago
  rapipago_instructions?: string
  // Efectivo / Tarjeta
  cash_instructions?: string
  card_instructions?: string
  // WhatsApp del merchant
  whatsapp_number?: string
  // Contacto del merchant
  store_address?: string
  store_phone?: string
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
  paymentData?: PaymentData
}

const statusMessages: Record<string, { subject: string; title: string; message: string }> = {
  pending: {
    subject: "Recibimos tu pedido",
    title: "¡Gracias por tu compra!",
    message: "Hemos recibido tu pedido. Revisá los detalles de pago más abajo.",
  },
  confirmed: {
    subject: "Tu pedido fue confirmado",
    title: "¡Pedido confirmado!",
    message: "Tu pedido ha sido confirmado y estamos preparándolo.",
  },
  pagado: {
    subject: "¡Pago confirmado!",
    title: "¡Pago confirmado!",
    message: "Recibimos tu pago. Tu pedido está siendo preparado.",
  },
  shipped: {
    subject: "Tu pedido está en camino",
    title: "¡Tu pedido está en camino!",
    message: "Tu pedido ha sido enviado y está en camino.",
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
    message: "Hemos procesado el reembolso de tu pedido.",
  },
}

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta presencial",
  transfer: "Transferencia bancaria",
  mercadopago: "Mercado Pago",
  mobbex: "Mobbex",
  modo: "MODO",
  uala: "Ualá Bis",
  rapipago: "Rapipago / Pago Fácil",
}

function getPaymentInstructionsHtml(paymentMethod: string, paymentData?: PaymentData, storeEmail?: string): string {
  if (!paymentData) return ""

  if (paymentMethod === "transfer") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #1e40af;">Datos para la transferencia</h4>
        ${paymentData.transfer_bank_name ? `<p style="margin: 5px 0;"><strong>Banco:</strong> ${paymentData.transfer_bank_name}</p>` : ""}
        ${paymentData.transfer_account_holder ? `<p style="margin: 5px 0;"><strong>Titular:</strong> ${paymentData.transfer_account_holder}</p>` : ""}
        ${paymentData.transfer_cbu ? `<p style="margin: 5px 0;"><strong>CBU:</strong> ${paymentData.transfer_cbu}</p>` : ""}
        ${paymentData.transfer_alias ? `<p style="margin: 5px 0;"><strong>Alias:</strong> ${paymentData.transfer_alias}</p>` : ""}
        <p style="margin: 10px 0 0; color: #1e40af; font-size: 14px;">
          Una vez realizada la transferencia, enviá el comprobante a
          <strong>${storeEmail || "la tienda"}</strong>
          para que procesemos tu pedido.
        </p>
        ${paymentData.whatsapp_number ? `
          <a href="https://wa.me/${paymentData.whatsapp_number.replace(/[^0-9]/g, '')}" 
             style="display: inline-block; margin-top: 10px; background: #25d366; color: #fff; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold;">
            Enviar comprobante por WhatsApp
          </a>
        ` : ""}
      </div>
    `
  }

  if (paymentMethod === "cash") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #166534;">Pago en efectivo</h4>
        <p style="margin: 5px 0; color: #166534;">
          ${paymentData.cash_instructions || "Pagás cuando retirás en el local o cuando recibís el envío. Tu pedido está reservado."}
        </p>
      </div>
    `
  }

  if (paymentMethod === "card") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #1e40af;">Pago con tarjeta presencial</h4>
        <p style="margin: 5px 0; color: #1e40af;">
          ${paymentData.card_instructions || "Pagás con tarjeta cuando retirás en el local o al recibir el envío."}
        </p>
      </div>
    `
  }

  if (paymentMethod === "modo") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #5b21b6;">Pago con MODO</h4>
        <p style="margin: 5px 0; color: #5b21b6;">Buscá al vendedor en MODO con el siguiente número:</p>
        <p style="margin: 10px 0; font-size: 22px; font-weight: bold; color: #5b21b6; letter-spacing: 2px;">
          ${paymentData.modo_phone || ""}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #7c3aed;">Sin comisión · El dinero llega directo al vendedor.</p>
      </div>
    `
  }

  if (paymentMethod === "uala") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #fff1f2; border: 1px solid #fca5a5; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #991b1b;">Pago con Ualá Bis</h4>
        <p style="margin: 5px 0; color: #991b1b;">Hacé click en el botón para completar tu pago:</p>
        ${paymentData.uala_link ? `
          <a href="${paymentData.uala_link}" style="display: inline-block; margin-top: 10px; background: #dc2626; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Pagar con Ualá Bis
          </a>
        ` : ""}
      </div>
    `
  }

  if (paymentMethod === "rapipago") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #fff7ed; border: 1px solid #fdba74; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #9a3412;">Rapipago / Pago Fácil</h4>
        <p style="margin: 5px 0; color: #9a3412;">
          ${paymentData.rapipago_instructions || "El vendedor te enviará el código de pago por email. Podés pagarlo en cualquier sucursal de Rapipago o Pago Fácil."}
        </p>
      </div>
    `
  }

  if (paymentMethod === "mercadopago" || paymentMethod === "mobbex") {
    return `
      <div style="margin-top: 20px; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #166534;">Pago online confirmado</h4>
        <p style="margin: 5px 0; color: #166534;">Tu pago fue procesado correctamente. El vendedor ya recibió la notificación.</p>
      </div>
    `
  }

  return ""
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
      paymentData,
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
                : `<div style="width: 70px; height: 70px; background: #f0f0f0; border-radius: 8px;"></div>`
            }
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong style="font-size: 15px;">${item.name}</strong>
            ${item.selectedSize ? `<br/><span style="display: inline-block; margin-top: 5px; background: #000; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 13px;">Talle: ${item.selectedSize}</span>` : ""}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `,
      )
      .join("")

    const paymentInstructionsHtml = getPaymentInstructionsHtml(paymentMethod, paymentData, storeEmail)

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

            ${status === "refunded" && refundReason ? `
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <strong>Motivo del reembolso:</strong><br/>${refundReason}
              </div>
            ` : ""}

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0;"><strong>Número de pedido:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
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
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px; font-weight: bold; font-size: 18px;">Total</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">$${total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <h4 style="margin-top: 0;">Detalles del envío</h4>
              <p style="margin: 5px 0;"><strong>Método:</strong> ${shippingMethod}</p>
              ${shippingAddress ? `<p style="margin: 5px 0;"><strong>Dirección:</strong> ${shippingAddress}</p>` : ""}
              <p style="margin: 5px 0;"><strong>Forma de pago:</strong> ${paymentLabels[paymentMethod] || paymentMethod}</p>
            </div>

            ${paymentInstructionsHtml}

          </div>

          ${(paymentData?.store_address || paymentData?.store_phone) ? `
          <div style="margin: 0 20px 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666;">
            <p style="margin: 0 0 5px; font-weight: bold; color: #333;">Datos de contacto</p>
            ${paymentData.store_address ? `<p style="margin: 3px 0;">📍 ${paymentData.store_address}</p>` : ""}
            ${paymentData.store_phone ? `<p style="margin: 3px 0;">📞 ${paymentData.store_phone}</p>` : ""}
            ${paymentData.whatsapp_number ? `<p style="margin: 3px 0;">💬 WhatsApp: ${paymentData.whatsapp_number}</p>` : ""}
          </div>
          ` : ""}
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">Gracias por comprar en ${storeName}</p>
            <p style="margin: 5px 0 0;"><a href="https://tol.ar" style="color: #000;">Powered by tol.ar</a></p>
          </div>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: `${storeName} <ventas@tiendaonline.com.ar>`,
      to: customerEmail,
      subject: `${statusInfo.subject} - ${storeName}`,
      html: emailHtml,
    })

    if (error) {
      console.error("Error enviando email al cliente:", error)
    }

    // Notificacion al vendedor solo para pedidos nuevos
    if (storeEmail && status === "pending") {
      const sellerEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #22c55e; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Nueva Venta</h1>
            </div>
            <div style="padding: 30px 20px;">
              <h2 style="color: #22c55e;">Tenes un nuevo pedido!</h2>
              <div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong>Pedido:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0 0;"><strong>Total:</strong> $${total.toLocaleString()}</p>
                <p style="margin: 5px 0 0;"><strong>Pago:</strong> ${paymentLabels[paymentMethod] || paymentMethod}</p>
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
                <p style="margin: 5px 0;"><strong>Envio:</strong> ${shippingMethod}</p>
                ${shippingAddress ? `<p style="margin: 5px 0;"><strong>Direccion:</strong> ${shippingAddress}</p>` : ""}
              </div>
              ${notes ? `
                <div style="margin-top: 20px; padding: 15px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px;">
                  <h4 style="margin-top: 0;">Observaciones del cliente</h4>
                  <p style="margin: 0;">${notes}</p>
                </div>
              ` : ""}
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
        subject: `Nueva venta! Pedido #${orderId.slice(0, 8).toUpperCase()} - $${total.toLocaleString()}`,
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
