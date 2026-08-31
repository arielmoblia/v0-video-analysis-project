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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/app/api/super-admin/geo-publicar/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://tuznlaqncbrsbokbbzhy.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY);
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get("tipo");
        const { data } = await supabase.from("geo_paginas").select("slug, nombre_link, ubicacion").eq("estado", "publicada");
        if (tipo === "footer" || tipo === "menu") {
            const paginas = (data || []).filter((p)=>p.ubicacion && p.ubicacion.includes(tipo)).map((p)=>({
                    slug: p.slug,
                    nombreLink: p.nombre_link || p.slug
                }));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                paginas
            }, {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate"
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data
        }, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate"
            }
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error"
        }, {
            status: 500,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    }
}
async function POST(request) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        if (cookieStore.get("super_admin")?.value !== "true") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No autorizado"
            }, {
                status: 401,
                headers: {
                    "Cache-Control": "no-store"
                }
            });
        }
        const { slug, ubicacion, nombreLink } = await request.json();
        if (!slug) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Falta slug"
        }, {
            status: 400,
            headers: {
                "Cache-Control": "no-store"
            }
        });
        const { data } = await supabase.from("geo_paginas").select("contenido").eq("slug", slug).single();
        if (!data) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Página no encontrada"
        }, {
            status: 404,
            headers: {
                "Cache-Control": "no-store"
            }
        });
        const contenido = data.contenido;
        const pageContent = `"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

const CONTENT = ${JSON.stringify(contenido, null, 2)}

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header fullMenu={true} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            {CONTENT.badge || "Sin comisiones"}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-amber-600">
            {CONTENT.titulo || "${slug.replace(/-/g, ' ')}"}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {CONTENT.subtitulo}
          </p>
          <a href="https://tol.ar" className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium">
            {CONTENT.cta_boton || "Crear mi tienda gratis"}
          </a>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">{CONTENT.como_funciona_titulo || "¿Cómo funciona?"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(n => (
              <div key={n} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold mb-4">{n}</div>
                <h3 className="font-semibold mb-2">{CONTENT[\`paso\${n}_titulo\`] || \`Paso \${n}\`}</h3>
                <p className="text-sm text-slate-600">{CONTENT[\`paso\${n}_desc\`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[1,2,3,4].map(n => CONTENT[\`faq\${n}_pregunta\`] ? (
              <div key={n} className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">{CONTENT[\`faq\${n}_pregunta\`]}</h3>
                <p className="text-sm text-slate-600">{CONTENT[\`faq\${n}_respuesta\`]}</p>
              </div>
            ) : null)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}`;
        const dir = `/var/www/tol.ar-dev/app/${slug}`;
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(dir, {
            recursive: true
        });
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])(`${dir}/page.tsx`, pageContent);
        const updateData = {
            estado: "publicada",
            updated_at: new Date().toISOString()
        };
        if (nombreLink) updateData.nombre_link = nombreLink;
        if (ubicacion) updateData.ubicacion = ubicacion;
        await supabase.from("geo_paginas").update(updateData).eq("slug", slug);
        try {
            const { GoogleAuth } = await __turbopack_context__.A("[project]/node_modules/google-auth-library/build/src/index.js [app-route] (ecmascript, async loader)");
            const auth = new GoogleAuth({
                keyFile: "/root/tolar-seo-credentials.json",
                scopes: [
                    "https://www.googleapis.com/auth/indexing"
                ]
            });
            const client = await auth.getClient();
            const token = await client.getAccessToken();
            await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({
                    url: `https://tol.ar/${slug}`,
                    type: "URL_UPDATED"
                })
            });
        } catch  {}
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            url: `/${slug}`
        }, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate"
            }
        });
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al publicar"
        }, {
            status: 500,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7cf59e22._.js.map