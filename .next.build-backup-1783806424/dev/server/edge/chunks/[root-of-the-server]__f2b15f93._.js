(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// ── Cache de noindex en memoria (TTL 5 min) ──────────────────────────────────
const noindexCache = {};
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
;
async function isNoindex(pathname) {
    const now = Date.now();
    const cached = noindexCache[pathname];
    if (cached && now - cached.ts < CACHE_TTL) return cached.value;
    try {
        const url = `${("TURBOPACK compile-time value", "https://tuznlaqncbrsbokbbzhy.supabase.co")}/rest/v1/seo_pages?url=eq.${encodeURIComponent(pathname)}&select=noindex&limit=1`;
        const res = await fetch(url, {
            headers: {
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            next: {
                revalidate: 0
            }
        });
        if (!res.ok) return false;
        const data = await res.json();
        const value = data?.[0]?.noindex === true;
        noindexCache[pathname] = {
            value,
            ts: now
        };
        return value;
    } catch  {
        return false;
    }
}
// Dominios raíz que NO son subdominios de tienda
const ROOT_DOMAINS = [
    'tol.ar',
    'www.tol.ar',
    'localhost',
    '157.173.212.229',
    '3003.tol.ar'
];
async function middleware(request) {
    const hostname = request.headers.get('host') || '';
    const { pathname } = request.nextUrl;
    // Extraer el subdominio
    // Ej: "mitienda.tol.ar" → "mitienda"
    // Ej: "localhost:3000" → null
    const hostWithoutPort = hostname.split(':')[0];
    const parts = hostWithoutPort.split('.');
    // Si es un dominio raíz o localhost, dejar pasar sin tocar
    if (ROOT_DOMAINS.includes(hostWithoutPort)) {
        // Verificar noindex para páginas del dominio raíz
        if (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.includes('.')) {
            const noindex = await isNoindex(pathname);
            if (noindex) {
                const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
                response.headers.set('X-Robots-Tag', 'noindex, nofollow');
                return response;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Si tiene más de 2 partes (subdominio.dominio.tld) extraer el subdominio
    // También funciona con subdominio.localhost
    let subdomain = null;
    if (parts.length >= 2) {
        const candidate = parts[0];
        // Ignorar "www" como subdominio de tienda
        if (candidate !== 'www') {
            subdomain = candidate;
        }
    }
    // Si no hay subdominio válido, dejar pasar
    if (!subdomain) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Evitar bucles de rewrite: si ya estamos en /tienda/... no tocar
    if (pathname.startsWith('/tienda')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Evitar tocar rutas de Next.js internas y archivos estáticos
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon') || pathname.startsWith('/public') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Rewrite: /admin → /tienda/[subdomain]/admin
    if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/admin2' || pathname.startsWith('/admin2/')) {
        const newPath = pathname.replace(/^\/admin2/, `/tienda/${subdomain}/admin2`).replace(/^\/admin/, `/tienda/${subdomain}/admin`);
        const url = request.nextUrl.clone();
        url.pathname = newPath;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
    }
    // Rewrite: / → /tienda/[subdomain]
    if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = `/tienda/${subdomain}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
    }
    // Cualquier otra ruta: rewrite al subdominio
    // Ej: /categoria/ropa → /tienda/[subdomain]/categoria/ropa
    const url = request.nextUrl.clone();
    url.pathname = `/tienda/${subdomain}${pathname}`;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
}
const config = {
    matcher: [
        /*
     * Aplica a todas las rutas EXCEPTO:
     * - _next/static
     * - _next/image
     * - favicon.ico
     */ '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map