module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/email/send-order-email.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendOrderEmail",
    ()=>sendOrderEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
;
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY);
const statusMessages = {
    pending: {
        subject: "Recibimos tu pedido",
        title: "¡Gracias por tu compra!",
        message: "Hemos recibido tu pedido. Revisá los detalles de pago más abajo."
    },
    confirmed: {
        subject: "Tu pedido fue confirmado",
        title: "¡Pedido confirmado!",
        message: "Tu pedido ha sido confirmado y estamos preparándolo."
    },
    pagado: {
        subject: "¡Pago confirmado!",
        title: "¡Pago confirmado!",
        message: "Recibimos tu pago. Tu pedido está siendo preparado."
    },
    shipped: {
        subject: "Tu pedido está en camino",
        title: "¡Tu pedido está en camino!",
        message: "Tu pedido ha sido enviado y está en camino."
    },
    delivered: {
        subject: "Tu pedido fue entregado",
        title: "¡Pedido entregado!",
        message: "Tu pedido ha sido entregado. ¡Esperamos que disfrutes tu compra!"
    },
    cancelled: {
        subject: "Tu pedido fue cancelado",
        title: "Pedido cancelado",
        message: "Lamentamos informarte que tu pedido ha sido cancelado."
    },
    refunded: {
        subject: "Reembolso procesado",
        title: "Reembolso procesado",
        message: "Hemos procesado el reembolso de tu pedido."
    }
};
const paymentLabels = {
    cash: "Efectivo",
    card: "Tarjeta presencial",
    transfer: "Transferencia bancaria",
    mercadopago: "Mercado Pago",
    mobbex: "Mobbex",
    modo: "MODO",
    uala: "Ualá Bis",
    rapipago: "Rapipago / Pago Fácil"
};
function getPaymentInstructionsHtml(paymentMethod, paymentData, storeEmail) {
    if (!paymentData) return "";
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
    `;
    }
    if (paymentMethod === "cash") {
        return `
      <div style="margin-top: 20px; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #166534;">Pago en efectivo</h4>
        <p style="margin: 5px 0; color: #166534;">
          ${paymentData.cash_instructions || "Pagás cuando retirás en el local o cuando recibís el envío. Tu pedido está reservado."}
        </p>
      </div>
    `;
    }
    if (paymentMethod === "card") {
        return `
      <div style="margin-top: 20px; padding: 20px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #1e40af;">Pago con tarjeta presencial</h4>
        <p style="margin: 5px 0; color: #1e40af;">
          ${paymentData.card_instructions || "Pagás con tarjeta cuando retirás en el local o al recibir el envío."}
        </p>
      </div>
    `;
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
    `;
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
    `;
    }
    if (paymentMethod === "rapipago") {
        return `
      <div style="margin-top: 20px; padding: 20px; background: #fff7ed; border: 1px solid #fdba74; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #9a3412;">Rapipago / Pago Fácil</h4>
        <p style="margin: 5px 0; color: #9a3412;">
          ${paymentData.rapipago_instructions || "El vendedor te enviará el código de pago por email. Podés pagarlo en cualquier sucursal de Rapipago o Pago Fácil."}
        </p>
      </div>
    `;
    }
    if (paymentMethod === "mercadopago" || paymentMethod === "mobbex") {
        return `
      <div style="margin-top: 20px; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #166534;">Pago online confirmado</h4>
        <p style="margin: 5px 0; color: #166534;">Tu pago fue procesado correctamente. El vendedor ya recibió la notificación.</p>
      </div>
    `;
    }
    return "";
}
async function sendOrderEmail(params) {
    try {
        const { orderId, customerName, customerEmail, customerPhone, storeName, storeEmail, items, total, shippingMethod, shippingAddress, paymentMethod, status, refundReason, notes, paymentData } = params;
        const statusInfo = statusMessages[status] || statusMessages.pending;
        const itemsHtml = items.map((item)=>`
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; width: 80px;">
            ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;" />` : `<div style="width: 70px; height: 70px; background: #f0f0f0; border-radius: 8px;"></div>`}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong style="font-size: 15px;">${item.name}</strong>
            ${item.selectedSize ? `<br/><span style="display: inline-block; margin-top: 5px; background: #000; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 13px;">Talle: ${item.selectedSize}</span>` : ""}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `).join("");
        const paymentInstructionsHtml = getPaymentInstructionsHtml(paymentMethod, paymentData, storeEmail);
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

          ${paymentData?.store_address || paymentData?.store_phone ? `
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
    `;
        const { error } = await resend.emails.send({
            from: `${storeName} <ventas@tiendaonline.com.ar>`,
            to: customerEmail,
            subject: `${statusInfo.subject} - ${storeName}`,
            html: emailHtml
        });
        if (error) {
            console.error("Error enviando email al cliente:", error);
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
                  ${items.map((item)=>`
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
      `;
            const { error: sellerError } = await resend.emails.send({
                from: `tol.ar <notificaciones@tiendaonline.com.ar>`,
                to: storeEmail,
                subject: `Nueva venta! Pedido #${orderId.slice(0, 8).toUpperCase()} - $${total.toLocaleString()}`,
                html: sellerEmailHtml
            });
            if (sellerError) {
                console.error("Error enviando email al vendedor:", sellerError);
            }
        }
        return true;
    } catch (error) {
        console.error("Error en sendOrderEmail:", error);
        return false;
    }
}
}),
"[project]/app/api/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$send$2d$order$2d$email$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email/send-order-email.tsx [app-route] (ecmascript)");
;
;
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://tuznlaqncbrsbokbbzhy.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY);
async function POST(request) {
    try {
        const body = await request.json();
        const { storeId, items, total, customer, shipping, paymentMethod } = body;
        // Verificar stock y precio real (contra la base de datos, nunca el del navegador)
        // antes de crear el pedido
        const verifiedItems = [];
        let itemsTotal = 0;
        for (const item of items){
            if (item.productId) {
                const { data: product } = await supabase.from("products").select("name, price, stock, sizes").eq("id", item.productId).single();
                if (product) {
                    let realPrice = product.price;
                    // Verificar stock por talla
                    if (product.sizes && Array.isArray(product.sizes) && item.size) {
                        const sizeData = product.sizes.find((s)=>s.name === item.size || s.size === item.size);
                        if (sizeData && typeof sizeData.stock === "number" && sizeData.stock < item.quantity) {
                            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                                error: `Stock insuficiente para "${product.name}" talle ${item.size}. Disponible: ${sizeData.stock}`
                            }, {
                                status: 400
                            });
                        }
                        if (sizeData && typeof sizeData.price === "number") realPrice = sizeData.price;
                    } else if (typeof product.stock === "number" && product.stock < item.quantity) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
                        }, {
                            status: 400
                        });
                    }
                    if (realPrice !== item.price) {
                        console.warn(`[precio] Corregido en pedido: producto ${item.productId} vino en $${item.price}, precio real $${realPrice}`);
                    }
                    verifiedItems.push({
                        ...item,
                        price: realPrice
                    });
                    itemsTotal += realPrice * item.quantity;
                    continue;
                }
            }
            // Sin productId (no se puede verificar contra el catálogo): se confía en el valor recibido
            verifiedItems.push(item);
            itemsTotal += Number(item.price || 0) * item.quantity;
        }
        const verifiedTotal = itemsTotal + Number(shipping.shippingCost || 0);
        // Crear el pedido
        const { data: order, error } = await supabase.from("orders").insert({
            store_id: storeId,
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            shipping_method: shipping.method,
            shipping_label: shipping.label || shipping.method,
            shipping_address: shipping.address,
            shipping_city: shipping.city,
            shipping_postal_code: shipping.postalCode,
            shipping_notes: shipping.notes,
            shipping_cost: shipping.shippingCost || 0,
            payment_method: paymentMethod,
            items: verifiedItems,
            total: verifiedTotal,
            status: "pending"
        }).select().single();
        if (error) {
            console.error("Error creando orden:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        // Actualizar stock solo si NO es pago online (MP/Mobbex descuentan en el webhook)
        const skipStock = paymentMethod === "mercadopago" || paymentMethod === "mobbex";
        if (!skipStock) for (const item of items){
            if (item.productId) {
                // Obtener el producto actual
                const { data: product } = await supabase.from("products").select("stock, sizes").eq("id", item.productId).single();
                if (product) {
                    // Si tiene tallas, actualizar el stock de la talla especifica
                    if (product.sizes && Array.isArray(product.sizes) && item.size) {
                        const updatedSizes = product.sizes.map((s)=>{
                            if (s.name === item.size || s.size === item.size) {
                                return {
                                    ...s,
                                    stock: Math.max(0, (s.stock || 0) - item.quantity)
                                };
                            }
                            return s;
                        });
                        await supabase.from("products").update({
                            sizes: updatedSizes
                        }).eq("id", item.productId);
                    } else if (typeof product.stock === "number") {
                        await supabase.from("products").update({
                            stock: Math.max(0, product.stock - item.quantity)
                        }).eq("id", item.productId);
                    }
                }
            }
        }
        const { data: store } = await supabase.from("stores").select("site_title, email, whatsapp_number, address, phone").eq("id", storeId).single();
        const { data: paymentMethods } = await supabase.from("payment_methods").select("*").eq("store_id", storeId).single();
        const emailItems = verifiedItems.map((item)=>({
                id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                selectedSize: item.size,
                image_url: item.image_url
            }));
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2f$send$2d$order$2d$email$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendOrderEmail"])({
            orderId: order.id,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            storeName: store?.site_title || "Tienda",
            storeEmail: store?.email,
            items: emailItems,
            total: verifiedTotal,
            shippingMethod: shipping.label || shipping.method,
            shippingAddress: shipping.address ? `${shipping.address}${shipping.city ? ", " + shipping.city : ""}` : undefined,
            paymentMethod: paymentMethod,
            status: "pending",
            notes: shipping.notes,
            paymentData: paymentMethods ? {
                transfer_bank_name: paymentMethods.transfer_bank_name,
                transfer_account_holder: paymentMethods.transfer_account_holder,
                transfer_cbu: paymentMethods.transfer_cbu,
                transfer_alias: paymentMethods.transfer_alias,
                store_email: store?.email,
                whatsapp_number: store?.whatsapp_number,
                store_address: store?.address,
                store_phone: store?.phone,
                modo_phone: paymentMethods.modo_phone,
                uala_link: paymentMethods.uala_link,
                rapipago_instructions: paymentMethods.rapipago_instructions,
                cash_instructions: paymentMethods.cash_instructions,
                card_instructions: paymentMethods.card_instructions
            } : undefined
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            orderId: order.id
        });
    } catch (error) {
        console.error("Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al crear pedido"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dfb209ba._.js.map