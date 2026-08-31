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
"[project]/lib/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Rate limiting utility para prevenir abuso de APIs
__turbopack_context__.s([
    "rateLimit",
    ()=>rateLimit,
    "resetRateLimit",
    ()=>resetRateLimit
]);
const rateLimitMap = new Map();
function rateLimit(key, options = {
    interval: 60000,
    maxRequests: 10
}) {
    const now = Date.now();
    const entry = rateLimitMap.get(key);
    // Si no hay entrada o ya pasó el tiempo de reset
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + options.interval
        });
        return {
            success: true,
            remaining: options.maxRequests - 1,
            resetIn: options.interval
        };
    }
    // Si hay entrada y no ha pasado el tiempo
    if (entry.count >= options.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetIn: entry.resetTime - now
        };
    }
    // Incrementar contador
    entry.count++;
    rateLimitMap.set(key, entry);
    return {
        success: true,
        remaining: options.maxRequests - entry.count,
        resetIn: entry.resetTime - now
    };
}
function resetRateLimit(key) {
    rateLimitMap.delete(key);
}
// Limpiar entradas viejas cada 5 minutos
if (typeof setInterval !== "undefined") {
    setInterval(()=>{
        const now = Date.now();
        for (const [key, entry] of rateLimitMap.entries()){
            if (now > entry.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}
}),
"[project]/app/api/super-admin/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rate-limit.ts [app-route] (ecmascript)");
;
;
;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "tolar2024admin";
async function POST(request) {
    try {
        // Rate limiting más estricto para super admin
        const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
        const rateLimitKey = `superadmin_${ip}`;
        const { success, resetIn } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rateLimit"])(rateLimitKey);
        if (!success) {
            const minutesLeft = Math.ceil(resetIn / 60000);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minutos.`
            }, {
                status: 429,
                headers: {
                    "Cache-Control": "no-store"
                }
            });
        }
        const { password } = await request.json();
        if (password !== SUPER_ADMIN_PASSWORD) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Contraseña incorrecta"
            }, {
                status: 401,
                headers: {
                    "Cache-Control": "no-store"
                }
            });
        }
        // Login exitoso - resetear rate limit
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetRateLimit"])(rateLimitKey);
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("super_admin", "true", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        }, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate"
            }
        });
    } catch (error) {
        console.error("Super admin login error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error al iniciar sesión"
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

//# sourceMappingURL=%5Broot-of-the-server%5D__cb3288eb._.js.map