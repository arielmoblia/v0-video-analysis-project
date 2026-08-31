// ===========================================
// NOTIFICACIONES DE DROPSHIPPING EXTERNO
// ===========================================
// Para tiendas que revenden productos de sitios externos (no tol.ar).
// Cuando entra un pedido, envía un email al dueño con instrucciones
// para comprar manualmente en el sitio original.
//
// Configuración: en plan_features de la tienda:
//   dropshipping: true
//   source_store: "mochi.com.ar"
//   margin_percent: 20

import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  name: string
  price: number
  quantity: number
  selectedSize?: string
  image_url?: string
}

interface DropshippingConfig {
  dropshipping: boolean
  source_store: string
  margin_percent: number
}

export async function sendDropshippingNotification(
  storeId: string,
  orderId: string,
  items: OrderItem[],
  total: number,
  customerName: string,
  customerPhone: string | undefined,
  shippingAddress: string | undefined,
  shippingMethod: string
): Promise<void> {
  // Obtener la tienda y su configuración
  const { data: store } = await supabase
    .from("stores")
    .select("email, site_title, plan_features")
    .eq("id", storeId)
    .single()

  if (!store?.email) return

  const config = store.plan_features as DropshippingConfig | null
  if (!config?.dropshipping || !config.source_store) return

  const marginPercent = config.margin_percent || 20
  const sourceStore = config.source_store

  // Calcular precios originales (sin el margen)
  const itemsWithOriginal = items.map(item => {
    const originalPrice = Math.round(item.price / (1 + marginPercent / 100))
    return {
      ...item,
      originalPrice,
      searchUrl: `https://www.${sourceStore}/productos/?q=${encodeURIComponent(item.name)}`
    }
  })

  const originalTotal = itemsWithOriginal.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
  const ganancia = total - originalTotal

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f97316; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛒 NUEVO PEDIDO DROPSHIPPING</h1>
        </div>

        <div style="padding: 30px 20px;">
          <div style="background: #fff7ed; border: 2px solid #f97316; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #ea580c; margin: 0 0 10px;">¡Tenés que comprar en ${sourceStore}!</h2>
            <p style="margin: 0; color: #9a3412;">
              Ya recibiste el pago del cliente. Ahora comprá los productos abajo en
              <a href="https://www.${sourceStore}" style="color: #ea580c; font-weight: bold;">${sourceStore}</a>
              y mandalo a la dirección del cliente.
            </p>
          </div>

          <div style="background: #dcfce7; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #166534;">💰 Tu ganancia: $${ganancia.toLocaleString('es-AR')}</h3>
            <p style="margin: 5px 0 0; color: #166534; font-size: 14px;">
              Cliente pagó: $${total.toLocaleString('es-AR')} |
              Comprás en ${sourceStore}: $${originalTotal.toLocaleString('es-AR')}
            </p>
          </div>

          <h3 style="border-bottom: 2px solid #f97316; padding-bottom: 10px;">📦 Productos a comprar</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #fff7ed;">
                <th style="padding: 12px; text-align: left;">Producto</th>
                <th style="padding: 12px; text-align: center;">Cant.</th>
                <th style="padding: 12px; text-align: right;">Precio en ${sourceStore}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsWithOriginal.map(item => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong>
                    ${item.selectedSize ? `<br/><span style="background: #000; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Talle: ${item.selectedSize}</span>` : ""}
                    <br/>
                    <a href="${item.searchUrl}" style="color: #f97316; font-size: 13px;">🔍 Buscar en ${sourceStore}</a>
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold;">${item.quantity}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">~$${item.originalPrice.toLocaleString('es-AR')}</td>
                </tr>
              `).join("")}
            </tbody>
            <tfoot>
              <tr style="background: #fff7ed;">
                <td colspan="2" style="padding: 15px; font-weight: bold; font-size: 16px;">Total aproximado a pagar en ${sourceStore}</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">~$${originalTotal.toLocaleString('es-AR')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #ea580c;">📍 Dirección de envío (del cliente)</h4>
            <p style="margin: 5px 0;"><strong>Cliente:</strong> ${customerName}</p>
            ${customerPhone ? `<p style="margin: 5px 0;"><strong>Teléfono:</strong> ${customerPhone}</p>` : ""}
            <p style="margin: 5px 0;"><strong>Método:</strong> ${shippingMethod}</p>
            ${shippingAddress ? `
              <div style="margin-top: 10px; padding: 15px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
                <strong>🏠 Dirección completa:</strong><br/>
                ${shippingAddress}
              </div>
            ` : ""}
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #1d4ed8;">📝 Pasos a seguir</h4>
            <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
              <li>Entrá a <a href="https://www.${sourceStore}" style="color: #3b82f6;">${sourceStore}</a></li>
              <li>Buscá cada producto usando los links de arriba</li>
              <li>Agregá al carrito con el talle correcto</li>
              <li>En el checkout, usá la dirección del cliente (arriba)</li>
              <li>Pagá con tu tarjeta/MercadoPago</li>
              <li>¡Listo! La ganancia ya es tuya</li>
            </ol>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 13px; color: #666; text-align: center;">
            Pedido #${orderId.slice(0, 8).toUpperCase()} · Tienda ${store.site_title || 'Dropshipping'}
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
          <p style="margin: 0;">Sistema de dropshipping de <a href="https://tol.ar" style="color: #f97316;">tol.ar</a></p>
        </div>
      </body>
    </html>
  `

  const { error } = await resend.emails.send({
    from: `tol.ar Dropshipping <notificaciones@tiendaonline.com.ar>`,
    to: store.email,
    subject: `🛒 COMPRÁ EN ${sourceStore.toUpperCase()} → Pedido #${orderId.slice(0, 8).toUpperCase()} - Ganancia $${ganancia.toLocaleString('es-AR')}`,
    html: emailHtml,
  })

  if (error) {
    console.error("[dropshipping-notification] Error enviando email:", error)
  } else {
    console.log(`[dropshipping-notification] Email enviado a ${store.email} para pedido ${orderId}`)
  }
}
