module.exports = [
"[project]/components/super-admin/youtube-agent.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "YoutubeAgent",
    ()=>YoutubeAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
"use client";
;
;
;
;
const CONFIG_DEFAULT = {
    perfil: "Dueños de negocio, emprendedores",
    edad_min: 25,
    edad_max: 60,
    vienen_de: "Tiendanube, Mercado Shops",
    competidor: "Tiendanube",
    dolor: "Pagan comisión por cada venta",
    cta: "Registrarse gratis en tol.ar",
    tono: "Directo y provocador",
    keyword: "vender sin comisión argentina",
    hashtags: "#emprendedoresargentinos #ecommercear #sincomisiones",
    categoria: "Negocios y emprendimiento",
    idioma: "Español (Argentina)",
    miniatura: "",
    horario_publicacion: "Al aprobar — inmediato",
    ads_activo: false,
    ads_presupuesto: "5",
    ads_edad_min: "25",
    ads_edad_max: "60",
    ads_pais: "Argentina",
    ads_genero: "Todos",
    ads_dispositivo: "Todos",
    ads_intereses: "",
    ads_excluir: "Ya visitaron tol.ar",
    ads_duracion: "7 días"
};
const TARGET_DEFAULT = {
    audiencia: "Vendedores online, 25-45 años",
    ubicacion: "Argentina",
    perfil: "Comerciantes que pagan comisión en Tiendanube o Mercado Shops",
    objetivo: "Que abran una tienda gratis en tol.ar"
};
function YoutubeAgent() {
    const [guiones, setGuiones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cargando, setCargando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [generando, setGenerando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(CONFIG_DEFAULT);
    const [guardandoConfig, setGuardandoConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [youtubeConnected, setYoutubeConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [guionesExtra, setGuionesExtra] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notas, setNotas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        "",
        ""
    ]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [apiKey, setApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [apiSecret, setApiSecret] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [generadores, setGeneradores] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [genActivo, setGenActivo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPopup, setShowPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nuevoGen, setNuevoGen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        nombre: "",
        api_key: "",
        endpoint: ""
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        cargar();
        cargarGeneradores();
        cargarConfig();
    }, []);
    const cargarConfig = async ()=>{
        try {
            const res = await fetch("/api/super-admin/marketing-youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "cargar-config",
                    datos: {}
                })
            });
            const data = await res.json();
            if (data.config) {
                setYoutubeConnected(data.config.youtube_connected || false);
                const clean = {};
                Object.keys(data.config).forEach((k)=>{
                    clean[k] = data.config[k] === null ? CONFIG_DEFAULT[k] ?? "" : data.config[k];
                });
                setConfig({
                    ...CONFIG_DEFAULT,
                    ...clean
                });
            }
        } catch  {}
    };
    const guardarConfig = async ()=>{
        setGuardandoConfig(true);
        try {
            await fetch("/api/super-admin/marketing-youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "guardar-config",
                    datos: config
                })
            });
        } catch  {}
        setGuardandoConfig(false);
    };
    const cargarGeneradores = async ()=>{
        try {
            const res = await fetch("/api/super-admin/marketing-youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "listar-generadores",
                    datos: {}
                })
            });
            const data = await res.json();
            if (data.generadores?.length) {
                setGeneradores(data.generadores);
                setGenActivo(data.generadores[0].nombre);
            }
        } catch  {}
    };
    const guardarNuevoGen = async ()=>{
        if (!nuevoGen.nombre) return;
        try {
            const res = await fetch("/api/super-admin/marketing-youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "agregar-generador",
                    datos: nuevoGen
                })
            });
            const data = await res.json();
            if (data.generador) {
                setGeneradores((prev)=>[
                        ...prev,
                        data.generador
                    ]);
                setGenActivo(data.generador.nombre);
                setNuevoGen({
                    nombre: "",
                    api_key: "",
                    endpoint: ""
                });
                setShowPopup(false);
            }
        } catch  {}
    };
    const guardarApi = async ()=>{
        if (!apiKey && !apiSecret) return;
        await fetch("/api/super-admin/marketing-youtube", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "guardar-api",
                datos: {
                    youtube_api_key: apiKey,
                    youtube_api_secret: apiSecret
                }
            })
        });
    };
    const cargar = async ()=>{
        setCargando(true);
        try {
            const res = await fetch("/api/super-admin/marketing-youtube");
            const data = await res.json();
            if (data.guiones?.length) {
                setGuiones(data.guiones);
                const g = data.guiones[0];
                setTarget({
                    audiencia: g.target_audiencia || TARGET_DEFAULT.audiencia,
                    ubicacion: g.target_ubicacion || TARGET_DEFAULT.ubicacion,
                    perfil: g.target_perfil || TARGET_DEFAULT.perfil,
                    objetivo: g.target_objetivo || TARGET_DEFAULT.objetivo
                });
                setNotas(data.guiones.map((g)=>g.notas || ""));
            }
        } catch  {}
        setCargando(false);
    };
    const generar = async ()=>{
        setGenerando(true);
        setError("");
        try {
            const res = await fetch("/api/super-admin/marketing-youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "generar",
                    datos: {
                        target_audiencia: target.audiencia,
                        target_ubicacion: target.ubicacion,
                        target_perfil: target.perfil,
                        target_objetivo: target.objetivo,
                        notas: notas[0]
                    }
                })
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
                return;
            }
            setGuiones(data.guiones || []);
            setNotas(data.guiones.map(()=>""));
        } catch  {
            setError("Error de conexion");
        }
        setGenerando(false);
    };
    const guardarCampo = async (id, campo, valor)=>{
        await fetch("/api/super-admin/marketing-youtube", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "actualizar",
                datos: {
                    id,
                    [campo]: valor
                }
            })
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border px-4 py-3 flex items-center gap-3 flex-wrap",
                style: {
                    background: "#fff7ed",
                    borderColor: "#fed7aa"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                        className: "w-4 h-4",
                        style: {
                            color: "#ea580c"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium",
                        style: {
                            color: "#ea580c"
                        },
                        children: "YouTube API"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "text-xs px-2 py-1.5 rounded border bg-white focus:outline-none",
                        style: {
                            borderColor: "#fed7aa",
                            minWidth: "220px",
                            flex: 1
                        },
                        placeholder: "API Key — youtube.googleapis.com",
                        value: apiKey,
                        onChange: (e)=>setApiKey(e.target.value),
                        onBlur: ()=>guardarApi()
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium",
                        style: {
                            color: "#ea580c"
                        },
                        children: "CLAVE"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "text-xs px-2 py-1.5 rounded border bg-white focus:outline-none",
                        style: {
                            borderColor: "#fed7aa",
                            minWidth: "180px",
                            flex: 1
                        },
                        placeholder: "OAuth Client Secret",
                        value: apiSecret,
                        onChange: (e)=>setApiSecret(e.target.value),
                        onBlur: ()=>guardarApi(),
                        type: "password"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs italic",
                        style: {
                            color: "#f97316"
                        },
                        children: "Se completa una vez — queda fija"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/api/auth/youtube",
                        className: "text-xs px-3 py-1.5 rounded font-medium text-white no-underline",
                        style: {
                            background: youtubeConnected ? "#22c55e" : "#f97316",
                            marginLeft: "auto"
                        },
                        children: youtubeConnected ? "YouTube conectado ✓" : "Conectar YouTube"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                lineNumber: 258,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        style: {
                            width: "260px",
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg p-3 space-y-2",
                                style: {
                                    background: "#f5f3ff",
                                    border: "0.5px solid #c4b5fd"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium uppercase tracking-wide",
                                        style: {
                                            color: "#6d28d9"
                                        },
                                        children: "Para el agente"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        {
                                            label: "Perfil de audiencia",
                                            key: "perfil"
                                        },
                                        {
                                            label: "Vienen de",
                                            key: "vienen_de"
                                        },
                                        {
                                            label: "Competidor",
                                            key: "competidor"
                                        },
                                        {
                                            label: "Dolor principal",
                                            key: "dolor"
                                        },
                                        {
                                            label: "Llamada a la acción",
                                            key: "cta"
                                        }
                                    ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs block mb-1",
                                                    style: {
                                                        color: "#6d28d9"
                                                    },
                                                    children: f.label
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                    style: {
                                                        border: "0.5px solid #c4b5fd",
                                                        background: "white",
                                                        color: "#4c1d95"
                                                    },
                                                    value: config[f.key],
                                                    onChange: (e)=>setConfig((prev)=>({
                                                                ...prev,
                                                                [f.key]: e.target.value
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, f.key, true, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs block mb-1",
                                                        style: {
                                                            color: "#6d28d9"
                                                        },
                                                        children: "Edad mín"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                        style: {
                                                            border: "0.5px solid #c4b5fd",
                                                            background: "white",
                                                            color: "#4c1d95"
                                                        },
                                                        value: config.edad_min,
                                                        onChange: (e)=>setConfig((prev)=>({
                                                                    ...prev,
                                                                    edad_min: parseInt(e.target.value) || 25
                                                                }))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs block mb-1",
                                                        style: {
                                                            color: "#6d28d9"
                                                        },
                                                        children: "Edad máx"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                        style: {
                                                            border: "0.5px solid #c4b5fd",
                                                            background: "white",
                                                            color: "#4c1d95"
                                                        },
                                                        value: config.edad_max,
                                                        onChange: (e)=>setConfig((prev)=>({
                                                                    ...prev,
                                                                    edad_max: parseInt(e.target.value) || 60
                                                                }))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 284,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs block mb-1",
                                                style: {
                                                    color: "#6d28d9"
                                                },
                                                children: "Tono del guión"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 291,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                style: {
                                                    border: "0.5px solid #c4b5fd",
                                                    background: "white",
                                                    color: "#4c1d95"
                                                },
                                                value: config.tono,
                                                onChange: (e)=>setConfig((prev)=>({
                                                            ...prev,
                                                            tono: e.target.value
                                                        })),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Directo y provocador"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Informativo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Gracioso"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Emocional"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 292,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg p-3 space-y-2",
                                style: {
                                    background: "#fef2f2",
                                    border: "0.5px solid #fca5a5"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium uppercase tracking-wide",
                                        style: {
                                            color: "#b91c1c"
                                        },
                                        children: "YouTube orgánico"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        {
                                            label: "Keyword principal",
                                            key: "keyword"
                                        },
                                        {
                                            label: "Hashtags fijos",
                                            key: "hashtags"
                                        },
                                        {
                                            label: "Descripción miniatura",
                                            key: "miniatura"
                                        }
                                    ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs block mb-1",
                                                    style: {
                                                        color: "#b91c1c"
                                                    },
                                                    children: f.label
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                    style: {
                                                        border: "0.5px solid #fca5a5",
                                                        background: "white",
                                                        color: "#991b1b"
                                                    },
                                                    value: config[f.key],
                                                    onChange: (e)=>setConfig((prev)=>({
                                                                ...prev,
                                                                [f.key]: e.target.value
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, f.key, true, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 309,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs block mb-1",
                                                style: {
                                                    color: "#b91c1c"
                                                },
                                                children: "Publicar automáticamente"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 317,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                style: {
                                                    border: "0.5px solid #fca5a5",
                                                    background: "white",
                                                    color: "#991b1b"
                                                },
                                                value: config.horario_publicacion,
                                                onChange: (e)=>setConfig((prev)=>({
                                                            ...prev,
                                                            horario_publicacion: e.target.value
                                                        })),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Al aprobar — inmediato"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Martes 18hs Argentina"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Jueves 18hs Argentina"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Sábado 10hs Argentina"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 318,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 316,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg",
                                style: {
                                    border: "0.5px solid #fed7aa"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between p-3 cursor-pointer",
                                        style: {
                                            background: "#fff7ed",
                                            borderRadius: "var(--border-radius-lg)"
                                        },
                                        onClick: ()=>setConfig((prev)=>({
                                                    ...prev,
                                                    ads_activo: !prev.ads_activo
                                                })),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-medium",
                                                        style: {
                                                            color: "#ea580c"
                                                        },
                                                        children: "YouTube Ads"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs",
                                                        style: {
                                                            color: "#b45309"
                                                        },
                                                        children: "Segmentación paga"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 331,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-full",
                                                style: {
                                                    width: 32,
                                                    height: 18,
                                                    background: config.ads_activo ? "#f97316" : "#e5e7eb",
                                                    border: "0.5px solid",
                                                    borderColor: config.ads_activo ? "#f97316" : "#d1d5db",
                                                    position: "relative",
                                                    transition: "background .2s"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: 14,
                                                        height: 14,
                                                        borderRadius: "50%",
                                                        background: "white",
                                                        position: "absolute",
                                                        top: 1,
                                                        left: config.ads_activo ? 15 : 1,
                                                        transition: "left .2s",
                                                        boxShadow: "0 1px 3px rgba(0,0,0,.2)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 335,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this),
                                    config.ads_activo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 space-y-2",
                                        style: {
                                            background: "#fff7ed"
                                        },
                                        children: [
                                            [
                                                {
                                                    label: "Presupuesto diario (USD)",
                                                    key: "ads_presupuesto",
                                                    type: "number"
                                                },
                                                {
                                                    label: "Intereses",
                                                    key: "ads_intereses",
                                                    type: "text"
                                                },
                                                {
                                                    label: "Excluir audiencias",
                                                    key: "ads_excluir",
                                                    type: "text"
                                                }
                                            ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs block mb-1",
                                                            style: {
                                                                color: "#92400e"
                                                            },
                                                            children: f.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                            lineNumber: 347,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: f.type,
                                                            className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                            style: {
                                                                border: "0.5px solid #fed7aa",
                                                                background: "white",
                                                                color: "#92400e"
                                                            },
                                                            value: config[f.key],
                                                            onChange: (e)=>setConfig((prev)=>({
                                                                        ...prev,
                                                                        [f.key]: e.target.value
                                                                    }))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, f.key, true, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 19
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs block mb-1",
                                                                style: {
                                                                    color: "#92400e"
                                                                },
                                                                children: "País"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                                style: {
                                                                    border: "0.5px solid #fed7aa",
                                                                    background: "white",
                                                                    color: "#92400e"
                                                                },
                                                                value: config.ads_pais,
                                                                onChange: (e)=>setConfig((prev)=>({
                                                                            ...prev,
                                                                            ads_pais: e.target.value
                                                                        })),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Argentina"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "México"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "España"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 72
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Colombia"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 95
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs block mb-1",
                                                                style: {
                                                                    color: "#92400e"
                                                                },
                                                                children: "Género"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: "w-full text-xs px-2 py-1 rounded focus:outline-none",
                                                                style: {
                                                                    border: "0.5px solid #fed7aa",
                                                                    background: "white",
                                                                    color: "#92400e"
                                                                },
                                                                value: config.ads_genero,
                                                                onChange: (e)=>setConfig((prev)=>({
                                                                            ...prev,
                                                                            ads_genero: e.target.value
                                                                        })),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Todos"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 365,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Solo mujeres"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 365,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Solo hombres"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                        lineNumber: 365,
                                                                        columnNumber: 74
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                                lineNumber: 363,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 353,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs italic",
                                                style: {
                                                    color: "#b45309"
                                                },
                                                children: "Requiere cuenta Google Ads conectada"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 369,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 340,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 328,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: guardarConfig,
                                disabled: guardandoConfig,
                                className: "w-full text-xs py-2 rounded font-medium text-white disabled:opacity-50",
                                style: {
                                    background: "#8b5cf6"
                                },
                                children: guardandoConfig ? "Guardando..." : "Guardar configuración"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: generar,
                                disabled: generando,
                                className: "w-full text-xs py-2.5 rounded font-medium text-white disabled:opacity-50",
                                style: {
                                    background: "#f97316"
                                },
                                children: generando ? "Generando..." : "VOLVER A GENERAR GUIÓN"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        style: {
                            flex: 1,
                            minWidth: 0
                        },
                        children: [
                            cargando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-muted-foreground animate-pulse p-4 text-center",
                                children: "Cargando guiones guardados..."
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 388,
                                columnNumber: 24
                            }, this),
                            !cargando && guiones.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border p-6 text-center text-xs text-muted-foreground",
                                children: [
                                    "Revisá el target y apretá ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "VOLVER A GENERAR GUIÓN"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 391,
                                        columnNumber: 41
                                    }, this),
                                    " para crear los guiones."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this),
                            guiones.map((g, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GuionCard, {
                                    guion: g,
                                    idx: idx,
                                    nota: notas[idx] || "",
                                    onNotaChange: (v)=>setNotas((prev)=>{
                                            const n = [
                                                ...prev
                                            ];
                                            n[idx] = v;
                                            return n;
                                        }),
                                    onGuardarNota: ()=>guardarCampo(g.id, "notas", notas[idx] || ""),
                                    genActivo: genActivo,
                                    generadores: generadores,
                                    onGenChange: setGenActivo,
                                    onAgregarGen: ()=>setShowPopup(true)
                                }, g.id, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 395,
                                    columnNumber: 13
                                }, this)),
                            guionesExtra.map((g, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GuionCard, {
                                    guion: g,
                                    idx: guiones.length + idx,
                                    nota: "",
                                    onNotaChange: ()=>{},
                                    onGuardarNota: ()=>{},
                                    genActivo: genActivo,
                                    generadores: generadores,
                                    onGenChange: setGenActivo,
                                    onAgregarGen: ()=>setShowPopup(true)
                                }, "extra-" + idx, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 409,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setGuionesExtra((prev)=>[
                                            ...prev,
                                            {
                                                id: "extra-" + Date.now(),
                                                guion_titulo: "Mi guión",
                                                guion_escenas: [
                                                    {
                                                        tiempo: "[0-3s]",
                                                        texto: ""
                                                    },
                                                    {
                                                        tiempo: "[4-10s]",
                                                        texto: ""
                                                    },
                                                    {
                                                        tiempo: "[11-20s]",
                                                        texto: ""
                                                    },
                                                    {
                                                        tiempo: "[21-27s]",
                                                        texto: ""
                                                    },
                                                    {
                                                        tiempo: "[28-30s]",
                                                        texto: ""
                                                    }
                                                ],
                                                guion_hashtags: ""
                                            }
                                        ]),
                                className: "w-full text-xs py-2.5 rounded border font-medium transition-colors",
                                style: {
                                    borderStyle: "dashed",
                                    borderColor: "var(--color-border-secondary)",
                                    color: "var(--color-text-secondary)"
                                },
                                children: "+ Guión propio — sin IA"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 387,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            showPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 50
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "var(--color-background-primary)",
                        borderRadius: "var(--border-radius-lg)",
                        padding: "1.5rem",
                        width: "400px",
                        border: "0.5px solid var(--color-border-secondary)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: "14px",
                                fontWeight: 500,
                                marginBottom: "1rem"
                            },
                            children: "Agregar generador de video"
                        }, void 0, false, {
                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                marginBottom: "1rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                fontSize: "11px",
                                                color: "var(--color-text-secondary)",
                                                display: "block",
                                                marginBottom: "3px"
                                            },
                                            children: "Nombre"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 448,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "w-full text-xs px-2 py-1.5 rounded border bg-background focus:outline-none",
                                            placeholder: "Ej: Pika Labs",
                                            value: nuevoGen.nombre,
                                            onChange: (e)=>setNuevoGen((p)=>({
                                                        ...p,
                                                        nombre: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                fontSize: "11px",
                                                color: "var(--color-text-secondary)",
                                                display: "block",
                                                marginBottom: "3px"
                                            },
                                            children: "API Key"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 452,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "w-full text-xs px-2 py-1.5 rounded border bg-background focus:outline-none",
                                            type: "password",
                                            placeholder: "sk-...",
                                            value: nuevoGen.api_key,
                                            onChange: (e)=>setNuevoGen((p)=>({
                                                        ...p,
                                                        api_key: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 453,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 451,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                fontSize: "11px",
                                                color: "var(--color-text-secondary)",
                                                display: "block",
                                                marginBottom: "3px"
                                            },
                                            children: "Endpoint"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 456,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "w-full text-xs px-2 py-1.5 rounded border bg-background focus:outline-none",
                                            placeholder: "https://api.ejemplo.com/v1/generate",
                                            value: nuevoGen.endpoint,
                                            onChange: (e)=>setNuevoGen((p)=>({
                                                        ...p,
                                                        endpoint: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 455,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                            lineNumber: 446,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: "8px",
                                justifyContent: "flex-end"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "text-xs px-3 py-1.5 rounded border",
                                    style: {
                                        borderColor: "var(--color-border-secondary)"
                                    },
                                    onClick: ()=>setShowPopup(false),
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 461,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "text-xs px-4 py-1.5 rounded font-medium text-white",
                                    style: {
                                        background: "#f97316"
                                    },
                                    onClick: guardarNuevoGen,
                                    children: "Guardar"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 462,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                            lineNumber: 460,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                    lineNumber: 444,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                lineNumber: 443,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/super-admin/youtube-agent.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
function GuionCard({ guion, idx, nota, onNotaChange, onGuardarNota, genActivo, generadores, onGenChange, onAgregarGen }) {
    const [videoListo, setVideoListo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [videoFile, setVideoFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [videoPreview, setVideoPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [dragOver, setDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [publicando, setPublicando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [publicado, setPublicado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const handleVideo = (file)=>{
        if (!file.type.startsWith("video/")) return;
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
        setVideoListo(true);
    };
    const publicar = async ()=>{
        if (!videoFile) return;
        setPublicando(true);
        try {
            const tokenRes = await fetch("/api/super-admin/youtube-token");
            const tokenData = await tokenRes.json();
            if (!tokenData.access_token) {
                alert("YouTube no conectado");
                setPublicando(false);
                return;
            }
            const titulo = (guion.guion_titulo || "Video tol.ar").slice(0, 97) + " #Shorts";
            const descripcion = (guion.guion_escenas || []).map((e)=>e.texto).join(" ") + "\n\n" + (guion.guion_hashtags || "") + " #Shorts";
            const metadata = {
                snippet: {
                    title: titulo,
                    description: descripcion.slice(0, 5000),
                    tags: (guion.guion_hashtags || "").split(" ").filter((t)=>t.startsWith("#")).map((t)=>t.slice(1)).slice(0, 10),
                    categoryId: "22"
                },
                status: {
                    privacyStatus: "public",
                    selfDeclaredMadeForKids: false
                }
            };
            const form = new FormData();
            form.append("metadata", new Blob([
                JSON.stringify(metadata)
            ], {
                type: "application/json"
            }));
            form.append("media", videoFile);
            const uploadRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + tokenData.access_token
                },
                body: form
            });
            const video = await uploadRes.json();
            if (video.error) {
                alert("Error YouTube: " + video.error.message);
                setPublicando(false);
                return;
            }
            setPublicado("https://youtube.com/shorts/" + video.id);
            await fetch("/api/super-admin/youtube-publish", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    guion_id: guion.id,
                    video_id: video.id
                })
            });
        } catch (e) {
            alert("Error: " + e.message);
        }
        setPublicando(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg border bg-card",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-2 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "secondary",
                                        className: "text-xs",
                                        children: [
                                            "YouTube Short ",
                                            idx + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 538,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 ml-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Generar con:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 540,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "text-xs px-2 py-1 rounded border bg-background focus:outline-none",
                                                style: {
                                                    borderColor: "#fed7aa",
                                                    color: "#ea580c",
                                                    fontWeight: 500
                                                },
                                                value: genActivo,
                                                onChange: (e)=>e.target.value === "__agregar__" ? onAgregarGen() : onGenChange(e.target.value),
                                                children: [
                                                    generadores.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: g.nombre,
                                                            children: g.nombre
                                                        }, g.id, false, {
                                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                            lineNumber: 547,
                                                            columnNumber: 39
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "__agregar__",
                                                        children: "+ Agregar nuevo..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 541,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 539,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 537,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium",
                                children: guion.guion_titulo
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                lineNumber: 552,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                        lineNumber: 536,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                    lineNumber: 535,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:col-span-2 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted rounded-md p-3 space-y-2",
                                    children: (guion.guion_escenas || []).map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground font-mono min-w-[42px] shrink-0",
                                                    children: e.tiempo
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 561,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-foreground",
                                                    children: e.texto
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 560,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 558,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground",
                                    children: guion.guion_hashtags
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 566,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs text-muted-foreground block mb-1",
                                            children: "Notas para el agente"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 568,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                className: "flex-1 text-xs px-2 py-1.5 rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none",
                                                rows: 2,
                                                placeholder: "Ej: quiero que sea más gracioso, mencioná que somos argentinos...",
                                                value: nota,
                                                onChange: (e)=>onNotaChange(e.target.value),
                                                onBlur: onGuardarNota
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 570,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 569,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 567,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                            lineNumber: 557,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                                    children: "Sugerencias"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 583,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-1",
                                    children: [
                                        "Emocional",
                                        "Racional",
                                        "Desafío"
                                    ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border rounded aspect-video flex items-end justify-center pb-1 bg-muted cursor-pointer hover:bg-muted/70 transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground",
                                                children: v.slice(0, 3)
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 587,
                                                columnNumber: 19
                                            }, this)
                                        }, v, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 586,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 584,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-1",
                                    children: [
                                        "Emocional",
                                        "Racional",
                                        "Desafío"
                                    ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "text-xs py-1 border rounded text-muted-foreground hover:bg-muted transition-colors",
                                            children: "Bajar"
                                        }, v, false, {
                                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                            lineNumber: 593,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 591,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-2 rounded-lg text-center cursor-pointer transition-colors mt-2 overflow-hidden",
                                    style: {
                                        borderStyle: "dashed",
                                        borderColor: dragOver ? "#f97316" : videoListo ? "#22c55e" : "var(--color-border-secondary)",
                                        background: dragOver ? "#fff7ed" : "transparent"
                                    },
                                    onClick: ()=>{
                                        const i = document.createElement("input");
                                        i.type = "file";
                                        i.accept = "video/*";
                                        i.onchange = (e)=>{
                                            if (e.target.files[0]) handleVideo(e.target.files[0]);
                                        };
                                        i.click();
                                    },
                                    onDragOver: (e)=>{
                                        e.preventDefault();
                                        setDragOver(true);
                                    },
                                    onDragLeave: ()=>setDragOver(false),
                                    onDrop: (e)=>{
                                        e.preventDefault();
                                        setDragOver(false);
                                        if (e.dataTransfer.files[0]) handleVideo(e.dataTransfer.files[0]);
                                    },
                                    children: videoListo && videoPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                src: videoPreview,
                                                className: "w-full rounded",
                                                style: {
                                                    maxHeight: "120px",
                                                    objectFit: "cover"
                                                },
                                                muted: true,
                                                playsInline: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 606,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-green-600 font-medium py-1 truncate px-1",
                                                children: videoFile?.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 607,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 605,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium text-muted-foreground",
                                                children: "FINAL"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 611,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Arrastrá o clickeá"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                                lineNumber: 612,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                        lineNumber: 610,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 596,
                                    columnNumber: 13
                                }, this),
                                publicado ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: publicado,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "w-full text-xs py-2 rounded font-medium text-center block text-white no-underline",
                                    style: {
                                        background: "#22c55e"
                                    },
                                    children: "Ver en YouTube ✓"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 617,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: !videoListo || publicando,
                                    onClick: publicar,
                                    className: "w-full text-xs py-2 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                    style: {
                                        background: videoListo ? "#f97316" : undefined,
                                        color: videoListo ? "white" : undefined,
                                        border: videoListo ? "none" : "0.5px solid var(--color-border-secondary)"
                                    },
                                    children: publicando ? "Publicando..." : videoListo ? "PUBLICAR" : "Publicar"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                                    lineNumber: 623,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/youtube-agent.tsx",
                            lineNumber: 582,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/super-admin/youtube-agent.tsx",
                    lineNumber: 556,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/super-admin/youtube-agent.tsx",
            lineNumber: 534,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/super-admin/youtube-agent.tsx",
        lineNumber: 533,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=components_super-admin_youtube-agent_tsx_6a17907a._.js.map