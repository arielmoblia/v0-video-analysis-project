module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},42315,(e,t,r)=>{"use strict";t.exports=e.r(18622)},47540,(e,t,r)=>{"use strict";t.exports=e.r(42315).vendored["react-rsc"].React},66680,(e,t,r)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},83922,e=>{"use strict";let t=new(e.i(46245)).Resend(process.env.RESEND_API_KEY),r={pending:{subject:"Recibimos tu pedido",title:"¡Gracias por tu compra!",message:"Hemos recibido tu pedido. Revisá los detalles de pago más abajo."},confirmed:{subject:"Tu pedido fue confirmado",title:"¡Pedido confirmado!",message:"Tu pedido ha sido confirmado y estamos preparándolo."},pagado:{subject:"¡Pago confirmado!",title:"¡Pago confirmado!",message:"Recibimos tu pago. Tu pedido está siendo preparado."},shipped:{subject:"Tu pedido está en camino",title:"¡Tu pedido está en camino!",message:"Tu pedido ha sido enviado y está en camino."},delivered:{subject:"Tu pedido fue entregado",title:"¡Pedido entregado!",message:"Tu pedido ha sido entregado. ¡Esperamos que disfrutes tu compra!"},cancelled:{subject:"Tu pedido fue cancelado",title:"Pedido cancelado",message:"Lamentamos informarte que tu pedido ha sido cancelado."},refunded:{subject:"Reembolso procesado",title:"Reembolso procesado",message:"Hemos procesado el reembolso de tu pedido."}},o={cash:"Efectivo",card:"Tarjeta presencial",transfer:"Transferencia bancaria",mercadopago:"Mercado Pago",mobbex:"Mobbex",modo:"MODO",uala:"Ualá Bis",rapipago:"Rapipago / Pago Fácil"};async function a(e){try{let{orderId:a,customerName:i,customerEmail:n,customerPhone:s,storeName:d,storeEmail:p,items:l,total:c,shippingMethod:u,shippingAddress:g,paymentMethod:m,status:x,refundReason:f,notes:h,paymentData:b}=e,y=r[x]||r.pending,v=l.map(e=>`
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; width: 80px;">
            ${e.image_url?`<img src="${e.image_url}" alt="${e.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;" />`:'<div style="width: 70px; height: 70px; background: #f0f0f0; border-radius: 8px;"></div>'}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong style="font-size: 15px;">${e.name}</strong>
            ${e.selectedSize?`<br/><span style="display: inline-block; margin-top: 5px; background: #000; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 13px;">Talle: ${e.selectedSize}</span>`:""}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${e.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(e.price*e.quantity).toLocaleString()}</td>
        </tr>
      `).join(""),_=b?"transfer"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #1e40af;">Datos para la transferencia</h4>
        ${b.transfer_bank_name?`<p style="margin: 5px 0;"><strong>Banco:</strong> ${b.transfer_bank_name}</p>`:""}
        ${b.transfer_account_holder?`<p style="margin: 5px 0;"><strong>Titular:</strong> ${b.transfer_account_holder}</p>`:""}
        ${b.transfer_cbu?`<p style="margin: 5px 0;"><strong>CBU:</strong> ${b.transfer_cbu}</p>`:""}
        ${b.transfer_alias?`<p style="margin: 5px 0;"><strong>Alias:</strong> ${b.transfer_alias}</p>`:""}
        <p style="margin: 10px 0 0; color: #1e40af; font-size: 14px;">
          Una vez realizada la transferencia, envi\xe1 el comprobante a
          <strong>${p||"la tienda"}</strong>
          para que procesemos tu pedido.
        </p>
        ${b.whatsapp_number?`
          <a href="https://wa.me/${b.whatsapp_number.replace(/[^0-9]/g,"")}" 
             style="display: inline-block; margin-top: 10px; background: #25d366; color: #fff; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold;">
            Enviar comprobante por WhatsApp
          </a>
        `:""}
      </div>
    `:"cash"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #166534;">Pago en efectivo</h4>
        <p style="margin: 5px 0; color: #166534;">
          ${b.cash_instructions||"Pagás cuando retirás en el local o cuando recibís el envío. Tu pedido está reservado."}
        </p>
      </div>
    `:"card"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #1e40af;">Pago con tarjeta presencial</h4>
        <p style="margin: 5px 0; color: #1e40af;">
          ${b.card_instructions||"Pagás con tarjeta cuando retirás en el local o al recibir el envío."}
        </p>
      </div>
    `:"modo"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #5b21b6;">Pago con MODO</h4>
        <p style="margin: 5px 0; color: #5b21b6;">Busc\xe1 al vendedor en MODO con el siguiente n\xfamero:</p>
        <p style="margin: 10px 0; font-size: 22px; font-weight: bold; color: #5b21b6; letter-spacing: 2px;">
          ${b.modo_phone||""}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #7c3aed;">Sin comisi\xf3n \xb7 El dinero llega directo al vendedor.</p>
      </div>
    `:"uala"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #fff1f2; border: 1px solid #fca5a5; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #991b1b;">Pago con Ual\xe1 Bis</h4>
        <p style="margin: 5px 0; color: #991b1b;">Hac\xe9 click en el bot\xf3n para completar tu pago:</p>
        ${b.uala_link?`
          <a href="${b.uala_link}" style="display: inline-block; margin-top: 10px; background: #dc2626; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Pagar con Ual\xe1 Bis
          </a>
        `:""}
      </div>
    `:"rapipago"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #fff7ed; border: 1px solid #fdba74; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #9a3412;">Rapipago / Pago F\xe1cil</h4>
        <p style="margin: 5px 0; color: #9a3412;">
          ${b.rapipago_instructions||"El vendedor te enviará el código de pago por email. Podés pagarlo en cualquier sucursal de Rapipago o Pago Fácil."}
        </p>
      </div>
    `:"mercadopago"===m||"mobbex"===m?`
      <div style="margin-top: 20px; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #166534;">Pago online confirmado</h4>
        <p style="margin: 5px 0; color: #166534;">Tu pago fue procesado correctamente. El vendedor ya recibi\xf3 la notificaci\xf3n.</p>
      </div>
    `:"":"",$=`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${d}</h1>
          </div>

          <div style="padding: 30px 20px;">
            <h2 style="color: #000; margin-bottom: 10px;">${y.title}</h2>
            <p style="color: #666; margin-bottom: 20px;">${y.message}</p>

            ${"refunded"===x&&f?`
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <strong>Motivo del reembolso:</strong><br/>${f}
              </div>
            `:""}

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0;"><strong>N\xfamero de pedido:</strong> #${a.slice(0,8).toUpperCase()}</p>
              <p style="margin: 5px 0 0;"><strong>Cliente:</strong> ${i}</p>
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
              <tbody>${v}</tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px; font-weight: bold; font-size: 18px;">Total</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">$${c.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <h4 style="margin-top: 0;">Detalles del env\xedo</h4>
              <p style="margin: 5px 0;"><strong>M\xe9todo:</strong> ${u}</p>
              ${g?`<p style="margin: 5px 0;"><strong>Direcci\xf3n:</strong> ${g}</p>`:""}
              <p style="margin: 5px 0;"><strong>Forma de pago:</strong> ${o[m]||m}</p>
            </div>

            ${_}

          </div>

          ${b?.store_address||b?.store_phone?`
          <div style="margin: 0 20px 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666;">
            <p style="margin: 0 0 5px; font-weight: bold; color: #333;">Datos de contacto</p>
            ${b.store_address?`<p style="margin: 3px 0;">📍 ${b.store_address}</p>`:""}
            ${b.store_phone?`<p style="margin: 3px 0;">📞 ${b.store_phone}</p>`:""}
            ${b.whatsapp_number?`<p style="margin: 3px 0;">💬 WhatsApp: ${b.whatsapp_number}</p>`:""}
          </div>
          `:""}
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">Gracias por comprar en ${d}</p>
            <p style="margin: 5px 0 0;"><a href="https://tol.ar" style="color: #000;">Powered by tol.ar</a></p>
          </div>
        </body>
      </html>
    `,{error:w}=await t.emails.send({from:`${d} <ventas@tiendaonline.com.ar>`,to:n,subject:`${y.subject} - ${d}`,html:$});if(w&&console.error("Error enviando email al cliente:",w),p&&"pending"===x){let e=`
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
                <p style="margin: 0;"><strong>Pedido:</strong> #${a.slice(0,8).toUpperCase()}</p>
                <p style="margin: 5px 0 0;"><strong>Total:</strong> $${c.toLocaleString()}</p>
                <p style="margin: 5px 0 0;"><strong>Pago:</strong> ${o[m]||m}</p>
              </div>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-top: 0;">Datos del cliente</h4>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${i}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${n}</p>
                ${s?`<p style="margin: 5px 0;"><strong>Telefono:</strong> ${s}</p>`:""}
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
                  ${l.map(e=>`
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        <strong>${e.name}</strong>
                        ${e.selectedSize?`<br/><span style="background: #000; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Talle: ${e.selectedSize}</span>`:""}
                      </td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${e.quantity}</td>
                      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(e.price*e.quantity).toLocaleString()}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Envio:</strong> ${u}</p>
                ${g?`<p style="margin: 5px 0;"><strong>Direccion:</strong> ${g}</p>`:""}
              </div>
              ${h?`
                <div style="margin-top: 20px; padding: 15px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px;">
                  <h4 style="margin-top: 0;">Observaciones del cliente</h4>
                  <p style="margin: 0;">${h}</p>
                </div>
              `:""}
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">Notificacion de <a href="https://tol.ar" style="color: #22c55e;">tol.ar</a></p>
            </div>
          </body>
        </html>
      `,{error:r}=await t.emails.send({from:"tol.ar <notificaciones@tiendaonline.com.ar>",to:p,subject:`Nueva venta! Pedido #${a.slice(0,8).toUpperCase()} - $${c.toLocaleString()}`,html:e});r&&console.error("Error enviando email al vendedor:",r)}return!0}catch(e){return console.error("Error en sendOrderEmail:",e),!1}}e.s(["sendOrderEmail",()=>a])},81585,e=>{"use strict";var t=e.i(47909),r=e.i(74017),o=e.i(96250),a=e.i(59756),i=e.i(61916),n=e.i(14444),s=e.i(10680),d=e.i(69741),p=e.i(16795),l=e.i(87718),c=e.i(95169),u=e.i(47587),g=e.i(66012),m=e.i(70101),x=e.i(26937),f=e.i(10372),h=e.i(93695);e.i(52474);var b=e.i(5232),y=e.i(24389),v=e.i(89171),_=e.i(83922);let $=(0,y.createClient)("https://tuznlaqncbrsbokbbzhy.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function w(e){try{let{storeId:t,items:r,total:o,customer:a,shipping:i,paymentMethod:n}=await e.json(),s=[],d=0;for(let e of r){if(e.productId){let{data:t}=await $.from("products").select("name, price, stock, sizes").eq("id",e.productId).single();if(t){let r=t.price;if(t.sizes&&Array.isArray(t.sizes)&&e.size){let o=t.sizes.find(t=>t.name===e.size||t.size===e.size);if(o&&"number"==typeof o.stock&&o.stock<e.quantity)return v.NextResponse.json({error:`Stock insuficiente para "${t.name}" talle ${e.size}. Disponible: ${o.stock}`},{status:400});o&&"number"==typeof o.price&&(r=o.price)}else if("number"==typeof t.stock&&t.stock<e.quantity)return v.NextResponse.json({error:`Stock insuficiente para "${t.name}". Disponible: ${t.stock}`},{status:400});r!==e.price&&console.warn(`[precio] Corregido en pedido: producto ${e.productId} vino en $${e.price}, precio real $${r}`),s.push({...e,price:r}),d+=r*e.quantity;continue}}s.push(e),d+=Number(e.price||0)*e.quantity}let p=d+Number(i.shippingCost||0),{data:l,error:c}=await $.from("orders").insert({store_id:t,customer_name:a.name,customer_email:a.email,customer_phone:a.phone,shipping_method:i.method,shipping_label:i.label||i.method,shipping_address:i.address,shipping_city:i.city,shipping_postal_code:i.postalCode,shipping_notes:i.notes,shipping_cost:i.shippingCost||0,payment_method:n,items:s,total:p,status:"pending"}).select().single();if(c)return console.error("Error creando orden:",c),v.NextResponse.json({error:c.message},{status:500});if("mercadopago"!==n&&"mobbex"!==n){for(let e of r)if(e.productId){let{data:t}=await $.from("products").select("stock, sizes").eq("id",e.productId).single();if(t)if(t.sizes&&Array.isArray(t.sizes)&&e.size){let r=t.sizes.map(t=>t.name===e.size||t.size===e.size?{...t,stock:Math.max(0,(t.stock||0)-e.quantity)}:t);await $.from("products").update({sizes:r}).eq("id",e.productId)}else"number"==typeof t.stock&&await $.from("products").update({stock:Math.max(0,t.stock-e.quantity)}).eq("id",e.productId)}}let{data:u}=await $.from("stores").select("site_title, email, whatsapp_number, address, phone").eq("id",t).single(),{data:g}=await $.from("payment_methods").select("*").eq("store_id",t).single(),m=s.map(e=>({id:e.productId,name:e.name,price:e.price,quantity:e.quantity,selectedSize:e.size,image_url:e.image_url}));return await (0,_.sendOrderEmail)({orderId:l.id,customerName:a.name,customerEmail:a.email,customerPhone:a.phone,storeName:u?.site_title||"Tienda",storeEmail:u?.email,items:m,total:p,shippingMethod:i.label||i.method,shippingAddress:i.address?`${i.address}${i.city?", "+i.city:""}`:void 0,paymentMethod:n,status:"pending",notes:i.notes,paymentData:g?{transfer_bank_name:g.transfer_bank_name,transfer_account_holder:g.transfer_account_holder,transfer_cbu:g.transfer_cbu,transfer_alias:g.transfer_alias,store_email:u?.email,whatsapp_number:u?.whatsapp_number,store_address:u?.address,store_phone:u?.phone,modo_phone:g.modo_phone,uala_link:g.uala_link,rapipago_instructions:g.rapipago_instructions,cash_instructions:g.cash_instructions,card_instructions:g.card_instructions}:void 0}),v.NextResponse.json({success:!0,orderId:l.id})}catch(e){return console.error("Error:",e),v.NextResponse.json({error:"Error al crear pedido"},{status:500})}}e.s(["POST",()=>w],48035);var k=e.i(48035);let R=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/orders/route",pathname:"/api/orders",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/orders/route.ts",nextConfigOutput:"",userland:k}),{workAsyncStorage:E,workUnitAsyncStorage:P,serverHooks:C}=R;function T(){return(0,o.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:P})}async function q(e,t,o){R.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/orders/route";y=y.replace(/\/index$/,"")||"/";let v=await R.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:_,params:$,nextConfig:w,parsedUrl:k,isDraftMode:E,prerenderManifest:P,routerServerContext:C,isOnDemandRevalidate:T,revalidateOnlyGenerated:q,resolvedPathname:j,clientReferenceManifest:z,serverActionsManifest:A}=v,N=(0,d.normalizeAppPath)(y),S=!!(P.dynamicRoutes[N]||P.routes[j]),O=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,k,!1):t.end("This page could not be found"),null);if(S&&!E){let e=!!P.routes[j],t=P.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(w.experimental.adapterPath)return await O();throw new h.NoFallbackError}}let D=null;!S||R.isDev||E||(D="/index"===(D=j)?"/":D);let I=!0===R.isDev||!S,M=S&&!I;A&&z&&(0,n.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:z,serverActionsManifest:A,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:A})});let U=e.method||"GET",H=(0,i.getTracer)(),B=H.getActiveScopeSpan(),F={params:$,prerenderManifest:P,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:w.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o)=>R.onRequestError(e,t,o,C)},sharedContext:{buildId:_}},L=new p.NodeNextRequest(e),K=new p.NodeNextResponse(t),G=l.NextRequestAdapter.fromNodeNextRequest(L,(0,l.signalFromNodeResponse)(t));try{let n=async e=>R.handle(G,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let t=`${U} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${U} ${y}`)}),s=!!(0,a.getRequestMeta)(e,"minimalMode"),d=async a=>{var i,d;let p=async({previousCacheEntry:r})=>{try{if(!s&&T&&q&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(a);e.fetchMetrics=F.renderOpts.fetchMetrics;let d=F.renderOpts.pendingWaitUntil;d&&o.waitUntil&&(o.waitUntil(d),d=void 0);let p=F.renderOpts.collectedTags;if(!S)return await (0,g.sendResponse)(L,K,i,F.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(i.headers);p&&(t[f.NEXT_CACHE_TAGS_HEADER]=p),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,o=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:T})},C),t}},l=await R.handleResponse({req:e,nextConfig:w,cacheKey:D,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:P,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:q,responseGenerator:p,waitUntil:o.waitUntil,isMinimalMode:s});if(!S)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",T?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,m.fromNodeOutgoingHttpHeaders)(l.value.headers);return s&&S||c.delete(f.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,x.getCacheControlHeader)(l.cacheControl)),await (0,g.sendResponse)(L,K,new Response(l.value.body,{headers:c,status:l.value.status||200})),null};B?await d(B):await H.withPropagatedContext(e.headers,()=>H.trace(c.BaseServerSpan.handleRequest,{spanName:`${U} ${y}`,kind:i.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},d))}catch(t){if(t instanceof h.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:T})}),S)throw t;return await (0,g.sendResponse)(L,K,new Response(null,{status:500})),null}}e.s(["handler",()=>q,"patchFetch",()=>T,"routeModule",()=>R,"serverHooks",()=>C,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>P],81585)},6693,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0f0094c1._.js","server/chunks/[root-of-the-server]__fb4a4b4e._.js"].map(t=>e.l(t))).then(()=>t(1631)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__17c03b40._.js.map