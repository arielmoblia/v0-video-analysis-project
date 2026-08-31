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
"[project]/app/sitemap.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>sitemap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
function getServiceClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://tuznlaqncbrsbokbbzhy.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY);
}
async function sitemap() {
    const baseUrl = "https://tol.ar";
    // IMPORTANTE: solo incluir URLs que tienen páginas reales en el código.
    // Agregar una URL aquí sin que exista la página genera errores 404 en los
    // rastreadores de Google y Bing, lo que daña el posicionamiento.
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1
        },
        {
            url: `${baseUrl}/plan-gratis`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9
        },
        {
            url: `${baseUrl}/plan-socio`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9
        },
        {
            url: `${baseUrl}/plan-a-medida`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8
        },
        {
            url: `${baseUrl}/plan-cositas`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8
        },
        {
            url: `${baseUrl}/plan-migrar`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8
        },
        {
            url: `${baseUrl}/diseno-ia`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9
        },
        {
            url: `${baseUrl}/pagos`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.75
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8
        },
        {
            url: `${baseUrl}/blog/como-crear-tienda-online-gratis-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.95
        },
        {
            url: `${baseUrl}/blog/cuanto-cuesta-tienda-online-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/mercadopago-tienda-online`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.75
        },
        {
            url: `${baseUrl}/blog/vender-sin-cuit-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/que-necesito-para-vender-online-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/vender-online-sin-comisiones-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/mejor-plataforma-tienda-online-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.95
        },
        {
            url: `${baseUrl}/blog/plataformas-ecommerce-argentina-2026`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.90
        },
        {
            url: `${baseUrl}/blog/como-empezar-a-vender-online-sin-tecnologia`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/tienda-online-vs-redes-sociales-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/como-vender-ropa-online-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.80
        },
        {
            url: `${baseUrl}/blog/como-vender-por-whatsapp-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.80
        },
        {
            url: `${baseUrl}/blog/envios-andreani-correo-argentino`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.75
        },
        {
            url: `${baseUrl}/blog/como-cobrar-por-internet-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/vender-online-monotributista-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/que-productos-vender-online-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/blog/errores-comunes-tienda-online-argentina`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.85
        },
        {
            url: `${baseUrl}/terminos`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3
        },
        {
            url: `${baseUrl}/privacidad`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3
        },
        {
            url: `${baseUrl}/sobre-nosotros`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6
        },
        {
            url: `${baseUrl}/testimonios`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7
        },
        {
            url: `${baseUrl}/migrar/sistema`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8
        },
        {
            url: `${baseUrl}/calculadora`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.75
        },
        {
            url: `${baseUrl}/tienda-online`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.95
        }
    ];
    let storePages = [];
    try {
        const supabase = getServiceClient();
        const { data: stores } = await supabase.from("stores").select("subdomain, updated_at").eq("is_active", true).limit(1000);
        if (stores) {
            storePages = stores.map((store)=>({
                    url: `${baseUrl}/tienda/${store.subdomain}`,
                    lastModified: new Date(store.updated_at || new Date()),
                    changeFrequency: "daily",
                    priority: 0.7
                }));
        }
    } catch (error) {
        console.error("Error fetching stores for sitemap:", error);
    }
    let geoPages = [];
    try {
        const supabase = getServiceClient();
        const { data: paginas } = await supabase.from("geo_paginas").select("slug, updated_at").eq("estado", "publicada");
        if (paginas) {
            geoPages = paginas.map((p)=>({
                    url: `${baseUrl}/${p.slug}`,
                    lastModified: new Date(p.updated_at || new Date()),
                    changeFrequency: "weekly",
                    priority: 0.8
                }));
        }
    } catch (error) {
        console.error("Error fetching geo_paginas for sitemap:", error);
    }
    const all = [
        ...staticPages,
        ...storePages,
        ...geoPages
    ];
    const seen = new Set();
    return all.filter((entry)=>{
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });
}
}),
"[project]/app/sitemap--route-entry.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/sitemap.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$metadata$2f$resolve$2d$route$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js [app-route] (ecmascript)");
;
;
;
const contentType = "application/xml";
const cacheControl = "public, max-age=0, must-revalidate";
const fileType = "sitemap";
if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"] !== 'function') {
    throw new Error('Default export is missing in "./sitemap.ts"');
}
async function GET() {
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$metadata$2f$resolve$2d$route$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveRouteData"])(data, fileType);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](content, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': cacheControl
        }
    });
}
;
}),
"[project]/app/sitemap--route-entry.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sitemap$2d2d$route$2d$entry$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["GET"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sitemap$2d2d$route$2d$entry$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/sitemap--route-entry.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/sitemap.ts [app-route] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3e1a2d20._.js.map