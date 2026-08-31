module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},42315,(e,t,a)=>{"use strict";t.exports=e.r(18622)},47540,(e,t,a)=>{"use strict";t.exports=e.r(42315).vendored["react-rsc"].React},66680,(e,t,a)=>{t.exports=e.x("node:crypto",()=>require("node:crypto"))},10044,e=>{"use strict";var t=e.i(47909),a=e.i(74017),r=e.i(96250),n=e.i(59756),s=e.i(61916),o=e.i(14444),i=e.i(10680),l=e.i(69741),d=e.i(16795),c=e.i(87718),p=e.i(95169),u=e.i(47587),v=e.i(66012),h=e.i(70101),x=e.i(26937),m=e.i(10372),f=e.i(93695);e.i(52474);var g=e.i(5232),R=e.i(89171);let b=new(e.i(46245)).Resend(process.env.RESEND_API_KEY);async function y(e){try{let{name:t,email:a,phone:r,subject:n,message:s,storeName:o,storeEmail:i}=await e.json();if(!t||!a||!n||!s)return R.NextResponse.json({error:"Faltan campos requeridos"},{status:400});return await b.emails.send({from:`${o} - Contacto <ventas@tiendaonline.com.ar>`,to:i,subject:`Nuevo mensaje de contacto: ${n}`,html:`
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
              <h1 style="margin:0; font-size: 24px;">${o}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.8;">Nuevo mensaje de contacto</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nombre</div>
                <div class="value">${t}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${a}">${a}</a></div>
              </div>
              ${r?`
              <div class="field">
                <div class="label">Tel\xe9fono</div>
                <div class="value">${r}</div>
              </div>
              `:""}
              <div class="field">
                <div class="label">Asunto</div>
                <div class="value">${n}</div>
              </div>
              <div class="message-box">
                <div class="label">Mensaje</div>
                <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${s}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `}),await b.emails.send({from:`${o} <ventas@tiendaonline.com.ar>`,to:a,subject:`Recibimos tu mensaje - ${o}`,html:`
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
              <h1 style="margin:0; font-size: 24px;">${o}</h1>
            </div>
            <div class="content" style="text-align: center;">
              <div class="icon">✉️</div>
              <h2>\xa1Recibimos tu mensaje!</h2>
              <p>Hola ${t},</p>
              <p>Gracias por contactarnos. Hemos recibido tu mensaje sobre "${n}" y te responderemos a la brevedad.</p>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Este es un mensaje autom\xe1tico. No respondas a este email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `}),R.NextResponse.json({success:!0})}catch(e){return console.error("Error sending contact email:",e),R.NextResponse.json({error:"Error al enviar el mensaje"},{status:500})}}e.s(["POST",()=>y],91242);var w=e.i(91242);let E=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/contact/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:C,workUnitAsyncStorage:j,serverHooks:A}=E;function N(){return(0,r.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:j})}async function k(e,t,r){E.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/contact/route";R=R.replace(/\/index$/,"")||"/";let b=await E.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:y,params:w,nextConfig:C,parsedUrl:j,isDraftMode:A,prerenderManifest:N,routerServerContext:k,isOnDemandRevalidate:P,revalidateOnlyGenerated:T,resolvedPathname:_,clientReferenceManifest:O,serverActionsManifest:$}=b,S=(0,l.normalizeAppPath)(R),q=!!(N.dynamicRoutes[S]||N.routes[_]),H=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,j,!1):t.end("This page could not be found"),null);if(q&&!A){let e=!!N.routes[_],t=N.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(C.experimental.adapterPath)return await H();throw new f.NoFallbackError}}let M=null;!q||E.isDev||A||(M="/index"===(M=_)?"/":M);let D=!0===E.isDev||!q,I=q&&!D;$&&O&&(0,o.setReferenceManifestsSingleton)({page:R,clientReferenceManifest:O,serverActionsManifest:$,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:$})});let U=e.method||"GET",F=(0,s.getTracer)(),K=F.getActiveScopeSpan(),z={params:w,prerenderManifest:N,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:C.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>E.onRequestError(e,t,r,k)},sharedContext:{buildId:y}},B=new d.NodeNextRequest(e),L=new d.NodeNextResponse(t),G=c.NextRequestAdapter.fromNodeNextRequest(B,(0,c.signalFromNodeResponse)(t));try{let o=async e=>E.handle(G,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${U} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${U} ${R}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let d=async({previousCacheEntry:a})=>{try{if(!i&&P&&T&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(n);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let d=z.renderOpts.collectedTags;if(!q)return await (0,v.sendResponse)(B,L,s,z.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(s.headers);d&&(t[m.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,r=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:P})},k),t}},c=await E.handleResponse({req:e,nextConfig:C,cacheKey:M,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:T,responseGenerator:d,waitUntil:r.waitUntil,isMinimalMode:i});if(!q)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",P?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return i&&q||p.delete(m.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(c.cacheControl)),await (0,v.sendResponse)(B,L,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};K?await l(K):await F.withPropagatedContext(e.headers,()=>F.trace(p.BaseServerSpan.handleRequest,{spanName:`${U} ${R}`,kind:s.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},l))}catch(t){if(t instanceof f.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:P})}),q)throw t;return await (0,v.sendResponse)(B,L,new Response(null,{status:500})),null}}e.s(["handler",()=>k,"patchFetch",()=>N,"routeModule",()=>E,"serverHooks",()=>A,"workAsyncStorage",()=>C,"workUnitAsyncStorage",()=>j],10044)},6693,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__0f0094c1._.js","server/chunks/[root-of-the-server]__fb4a4b4e._.js"].map(t=>e.l(t))).then(()=>t(1631)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__e59e90a7._.js.map