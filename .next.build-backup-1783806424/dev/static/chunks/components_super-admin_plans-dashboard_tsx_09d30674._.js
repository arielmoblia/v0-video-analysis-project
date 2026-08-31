(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/super-admin/plans-dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlansDashboard",
    ()=>PlansDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://tuznlaqncbrsbokbbzhy.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjc4NDIsImV4cCI6MjA4OTYwMzg0Mn0.bWF8DNO6_HISbJnEIA9qufKN9qwMAyIZM2cjhWUrkQI"));
function PlansDashboard({ stores }) {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("gratis");
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("subdomain");
    const [sortDir, setSortDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const [cositasSubTab, setCositasSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("estadisticas");
    const [catalogChanges, setCatalogChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [savingCatalog, setSavingCatalog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [featureTrialDays, setFeatureTrialDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [catalogFeatures, setCatalogFeatures] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sociosSubTab, setSociosSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("estadisticas");
    const [pageContent, setPageContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [savingKey, setSavingKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savedKey, setSavedKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [storesWithProducts, setStoresWithProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [productCount, setProductCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [storeViews, setStoreViews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [orderCount, setOrderCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [orderPaid, setOrderPaid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [viewsDays, setViewsDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(7);
    const [storesWithMP, setStoresWithMP] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [cositasPorTienda, setCositasPorTienda] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const freeStores = stores.filter((s)=>!s.plan || s.plan === "free" || s.plan === "gratis");
    const cositas = stores.filter((s)=>s.plan === "cositas");
    const socios = stores.filter((s)=>s.plan === "socios");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlansDashboard.useEffect": ()=>{
            async function fetchExtra() {
                setLoading(true);
                // Tiendas con productos
                const { data: products } = await supabase.from("products").select("store_id").limit(500000);
                if (products) {
                    setStoresWithProducts(new Set(products.map({
                        "PlansDashboard.useEffect.fetchExtra": (p)=>p.store_id
                    }["PlansDashboard.useEffect.fetchExtra"])));
                    const counts = {};
                    products.forEach({
                        "PlansDashboard.useEffect.fetchExtra": (p)=>{
                            counts[p.store_id] = (counts[p.store_id] || 0) + 1;
                        }
                    }["PlansDashboard.useEffect.fetchExtra"]);
                    setProductCount(counts);
                }
                // Tiendas con MercadoPago
                const { data: payments } = await supabase.from("payment_methods").select("store_id, provider").eq("provider", "mercadopago");
                if (payments) {
                    setStoresWithMP(new Set(payments.map({
                        "PlansDashboard.useEffect.fetchExtra": (p)=>p.store_id
                    }["PlansDashboard.useEffect.fetchExtra"])));
                }
                // Cositas por tienda
                const { data: cositas } = await supabase.from('store_purchased_features').select('store_id, feature_code, is_active, is_gifted');
                if (cositas) {
                    const grouped = {};
                    cositas.forEach({
                        "PlansDashboard.useEffect.fetchExtra": (c)=>{
                            if (!grouped[c.store_id]) grouped[c.store_id] = [];
                            grouped[c.store_id].push(c);
                        }
                    }["PlansDashboard.useEffect.fetchExtra"]);
                    setCositasPorTienda(grouped);
                }
                // Pedidos por tienda
                const { data: orders } = await supabase.from("orders").select("store_id, status").limit(500000);
                if (orders) {
                    const oc = {};
                    const op = {};
                    orders.forEach({
                        "PlansDashboard.useEffect.fetchExtra": (o)=>{
                            oc[o.store_id] = (oc[o.store_id] || 0) + 1;
                            if (o.status === "pagado") op[o.store_id] = (op[o.store_id] || 0) + 1;
                        }
                    }["PlansDashboard.useEffect.fetchExtra"]);
                    setOrderCount(oc);
                    setOrderPaid(op);
                }
                // Visitas por tienda via API (excluye IP del dueño, últimos 7 días)
                const viewsRes = await fetch('/api/super-admin/stores-activity');
                if (viewsRes.ok) {
                    const viewsData = await viewsRes.json();
                    setStoreViews(viewsData);
                }
                // Contenido de la pagina publica
                const { data: pageData } = await supabase.from('page_content').select('key, value').eq('page', 'plan-cositas');
                if (pageData) {
                    const map = {};
                    pageData.forEach({
                        "PlansDashboard.useEffect.fetchExtra": (r)=>{
                            map[r.key] = r.value;
                        }
                    }["PlansDashboard.useEffect.fetchExtra"]);
                    setPageContent(map);
                }
                // Features desde Supabase (fuente de verdad)
                const { data: featuresData } = await supabase.from('store_features').select('*').order('is_active', {
                    ascending: false
                }).order('created_at', {
                    ascending: true
                });
                if (featuresData) {
                    const trialMap = {};
                    featuresData.forEach({
                        "PlansDashboard.useEffect.fetchExtra": (f)=>{
                            trialMap[f.code] = f.trial_days || 0;
                        }
                    }["PlansDashboard.useEffect.fetchExtra"]);
                    setFeatureTrialDays(trialMap);
                    setCatalogFeatures(featuresData);
                }
                setLoading(false);
            }
            fetchExtra();
        }
    }["PlansDashboard.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlansDashboard.useEffect": ()=>{
            fetch(`/api/super-admin/stores-activity?days=${viewsDays}`).then({
                "PlansDashboard.useEffect": (r)=>r.json()
            }["PlansDashboard.useEffect"]).then({
                "PlansDashboard.useEffect": (data)=>setStoreViews(data)
            }["PlansDashboard.useEffect"]);
        }
    }["PlansDashboard.useEffect"], [
        viewsDays
    ]);
    const activeFreestores = freeStores.filter((s)=>s.last_login && new Date(s.last_login) > thirtyDaysAgo);
    const dormidas = freeStores.filter((s)=>!s.last_login || new Date(s.last_login) <= thirtyDaysAgo);
    const conProductos = freeStores.filter((s)=>storesWithProducts.has(s.id));
    const conMP = freeStores.filter((s)=>storesWithMP.has(s.id));
    const candidatas = freeStores.filter((s)=>storesWithProducts.has(s.id) && storesWithMP.has(s.id));
    const allCositas = Object.values(cositasPorTienda).flat();
    const totalCositasVendidas = allCositas.filter((c)=>!c.is_gifted).length;
    const totalCositasActivas = allCositas.filter((c)=>c.is_active).length;
    const totalCositasRegaladas = allCositas.filter((c)=>c.is_gifted).length;
    const tabs = [
        {
            id: "gratis",
            label: `PLAN GRATIS (${freeStores.length})`
        },
        {
            id: "cositas",
            label: `PLAN COSITAS (${cositas.length})`
        },
        {
            id: "socios",
            label: `PLAN SOCIOS (${socios.length})`
        },
        {
            id: "mayorista",
            label: "PLAN MAYORISTA"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center border-b border-slate-200",
                children: [
                    tabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab(tab.id),
                            className: `px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"} ${tab.id === "mayorista" ? "text-slate-400 cursor-default" : ""}`,
                            children: tab.label
                        }, tab.id, false, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto pb-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>window.open('https://claude.ai/chat/ff4fd46a-f313-41ea-83a0-681484cd18d1', '_blank'),
                            className: "inline-flex items-center gap-2 px-3 h-7 rounded-md text-xs font-medium text-white cursor-pointer border-0",
                            style: {
                                backgroundColor: '#1a7f5a'
                            },
                            children: "💬 Hablar con Claudio"
                        }, void 0, false, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            activeTab === "gratis" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12 text-slate-400",
                    children: "Cargando estadísticas..."
                }, void 0, false, {
                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                    lineNumber: 190,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 195,
                                        columnNumber: 33
                                    }, void 0),
                                    label: "Total gratis",
                                    value: freeStores.length,
                                    color: "slate"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 195,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 196,
                                        columnNumber: 33
                                    }, void 0),
                                    label: "Activas (30d)",
                                    value: activeFreestores.length,
                                    color: "green"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 197,
                                        columnNumber: 33
                                    }, void 0),
                                    label: "Con productos",
                                    value: conProductos.length,
                                    color: "blue"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 197,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 198,
                                        columnNumber: 33
                                    }, void 0),
                                    label: "Con MercadoPago",
                                    value: conMP.length,
                                    color: "indigo"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 198,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 199,
                                        columnNumber: 33
                                    }, void 0),
                                    label: "Dormidas",
                                    value: dormidas.length,
                                    color: "red"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 200,
                                        columnNumber: 33
                                    }, void 0),
                                    label: "Candidatas",
                                    value: candidatas.length,
                                    color: "orange"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 200,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 194,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-slate-200 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-b border-slate-100 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "w-4 h-4 text-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 206,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-slate-800",
                                            children: "Candidatas a convertir"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 207,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full ml-2",
                                            children: "Tienen productos + MercadoPago configurado"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 208,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 205,
                                    columnNumber: 17
                                }, this),
                                candidatas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "py-8 text-center text-slate-400",
                                    children: "No hay candidatas por ahora"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 213,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "bg-slate-50 text-left text-slate-500 text-xs uppercase",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Tienda"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Creada"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 220,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Último ingreso"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 217,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 216,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "divide-y divide-slate-100",
                                            children: candidatas.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "hover:bg-orange-50 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3 text-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold bg-slate-100 text-slate-600",
                                                                children: storeViews[s.id] || 0
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3 font-medium text-slate-800",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: `https://${s.subdomain}.tol.ar`,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "hover:text-blue-600 hover:underline flex items-center gap-1",
                                                                children: [
                                                                    s.subdomain,
                                                                    ".tol.ar",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-slate-300 text-xs",
                                                                        children: "↗"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                        lineNumber: 235,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 233,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 232,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3 text-slate-500",
                                                            children: s.email
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3 text-slate-400",
                                                            children: new Date(s.created_at).toLocaleDateString("es-AR")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3 text-slate-400",
                                                            children: s.last_login ? new Date(s.last_login).toLocaleDateString("es-AR") : "Nunca"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 240,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, s.id, true, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 224,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 215,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 204,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-slate-200 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-slate-800",
                                            children: "Todas las tiendas en Plan Gratis"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 251,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1",
                                            children: [
                                                {
                                                    d: 7,
                                                    l: "7D"
                                                },
                                                {
                                                    d: 30,
                                                    l: "1M"
                                                },
                                                {
                                                    d: 180,
                                                    l: "6M"
                                                },
                                                {
                                                    d: 365,
                                                    l: "1A"
                                                }
                                            ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setViewsDays(p.d),
                                                    className: `px-3 py-1 text-xs rounded-md font-medium transition-colors ${viewsDays === p.d ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`,
                                                    children: p.l
                                                }, p.d, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 252,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 250,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-auto max-h-[600px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "sticky top-0 z-10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "bg-slate-50 text-left text-slate-500 text-xs uppercase",
                                                        children: [
                                                            [
                                                                {
                                                                    key: "ranking",
                                                                    label: "Ranking"
                                                                },
                                                                {
                                                                    key: "subdomain",
                                                                    label: "Tienda"
                                                                },
                                                                {
                                                                    key: "email",
                                                                    label: "Email"
                                                                },
                                                                {
                                                                    key: "productos",
                                                                    label: "Prod."
                                                                },
                                                                {
                                                                    key: "mp",
                                                                    label: "MP"
                                                                },
                                                                {
                                                                    key: "last_login",
                                                                    label: "Última entrada"
                                                                }
                                                            ].map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-2 py-2 cursor-pointer select-none hover:text-slate-800 hover:bg-slate-100 transition-colors",
                                                                    onClick: ()=>{
                                                                        if (sortField === col.key) {
                                                                            setSortDir(sortDir === "asc" ? "desc" : "asc");
                                                                        } else {
                                                                            setSortField(col.key);
                                                                            setSortDir("asc");
                                                                        }
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            col.label,
                                                                            sortField === col.key ? sortDir === "asc" ? " ↑" : " ↓" : " ↕"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                        lineNumber: 274,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, col.key, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 273,
                                                                    columnNumber: 25
                                                                }, this)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                colSpan: 3,
                                                                className: "px-2 py-2 text-center border-l border-slate-200",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-500 uppercase",
                                                                    children: "Ventas"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 281,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 280,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "bg-slate-50 text-slate-400 text-xs uppercase border-t border-slate-100",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                colSpan: 6
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 23
                                                            }, this),
                                                            [
                                                                {
                                                                    key: "ventas_pend",
                                                                    label: "Pendiente"
                                                                },
                                                                {
                                                                    key: "ventas_pag",
                                                                    label: "Pagado"
                                                                },
                                                                {
                                                                    key: "ventas",
                                                                    label: "Total"
                                                                }
                                                            ].map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-2 py-1 text-center cursor-pointer hover:text-slate-800 hover:bg-slate-100 border-l border-slate-200 first:border-l-0",
                                                                    onClick: ()=>{
                                                                        if (sortField === col.key) {
                                                                            setSortDir(sortDir === "asc" ? "desc" : "asc");
                                                                        } else {
                                                                            setSortField(col.key);
                                                                            setSortDir("asc");
                                                                        }
                                                                    },
                                                                    children: [
                                                                        col.label,
                                                                        sortField === col.key ? sortDir === "asc" ? " ↑" : " ↓" : ""
                                                                    ]
                                                                }, col.key, true, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 287,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 284,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 263,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-slate-100",
                                                children: [
                                                    ...freeStores
                                                ].sort((a, b)=>{
                                                    let va, vb;
                                                    if (sortField === "subdomain") {
                                                        va = a.subdomain || "";
                                                        vb = b.subdomain || "";
                                                    } else if (sortField === "email") {
                                                        va = a.email || "";
                                                        vb = b.email || "";
                                                    } else if (sortField === "ranking") {
                                                        va = storeViews[a.id] || 0;
                                                        vb = storeViews[b.id] || 0;
                                                    } else if (sortField === "productos") {
                                                        va = storesWithProducts.has(a.id) ? 1 : 0;
                                                        vb = storesWithProducts.has(b.id) ? 1 : 0;
                                                    } else if (sortField === "ventas") {
                                                        va = orderCount[a.id] || 0;
                                                        vb = orderCount[b.id] || 0;
                                                    } else if (sortField === "ventas_pag") {
                                                        va = orderPaid[a.id] || 0;
                                                        vb = orderPaid[b.id] || 0;
                                                    } else if (sortField === "ventas_pend") {
                                                        va = (orderCount[a.id] || 0) - (orderPaid[a.id] || 0);
                                                        vb = (orderCount[b.id] || 0) - (orderPaid[b.id] || 0);
                                                    } else if (sortField === "mp") {
                                                        va = storesWithMP.has(a.id) ? 1 : 0;
                                                        vb = storesWithMP.has(b.id) ? 1 : 0;
                                                    } else if (sortField === "last_login") {
                                                        va = a.last_login ? new Date(a.last_login).getTime() : 0;
                                                        vb = b.last_login ? new Date(b.last_login).getTime() : 0;
                                                    }
                                                    if (va < vb) return sortDir === "asc" ? -1 : 1;
                                                    if (va > vb) return sortDir === "asc" ? 1 : -1;
                                                    return 0;
                                                }).map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-slate-50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold bg-slate-100 text-slate-600",
                                                                    children: storeViews[s.id] || 0
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 311,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 font-medium text-slate-800",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: `https://${s.subdomain}.tol.ar`,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "hover:text-blue-600 hover:underline flex items-center gap-1",
                                                                    children: [
                                                                        s.subdomain,
                                                                        ".tol.ar ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-slate-300 text-xs",
                                                                            children: "↗"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                            lineNumber: 317,
                                                                            columnNumber: 50
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 316,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 315,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-slate-500 text-xs",
                                                                children: s.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 320,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-center",
                                                                children: productCount[s.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-600 font-medium text-xs",
                                                                    children: productCount[s.id]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 323,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-300",
                                                                    children: "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 324,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-center",
                                                                children: storesWithMP.has(s.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-blue-600 font-medium text-xs",
                                                                    children: "✓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 328,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-300",
                                                                    children: "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 329,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 326,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-slate-400 text-xs text-center",
                                                                children: s.last_login ? new Date(s.last_login).toLocaleDateString("es-AR") : "Nunca"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 331,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-center border-l border-slate-100",
                                                                children: (orderCount[s.id] || 0) - (orderPaid[s.id] || 0) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-orange-500 font-medium text-xs",
                                                                    children: (orderCount[s.id] || 0) - (orderPaid[s.id] || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-300",
                                                                    children: "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 337,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 334,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-center",
                                                                children: orderPaid[s.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-green-600 font-medium text-xs",
                                                                    children: orderPaid[s.id]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 341,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-300",
                                                                    children: "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 342,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 339,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-2 text-center",
                                                                children: orderCount[s.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-purple-600 font-medium text-xs",
                                                                    children: orderCount[s.id]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-300",
                                                                    children: "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 344,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, s.id, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 293,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 262,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 261,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 249,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 188,
                columnNumber: 9
            }, this),
            activeTab === "cositas" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-b border-slate-200",
                        children: [
                            [
                                {
                                    id: "estadisticas",
                                    label: "ESTADÍSTICAS"
                                },
                                {
                                    id: "cositas",
                                    label: "LISTADO DE COSITAS"
                                }
                            ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCositasSubTab(t.id),
                                    className: `px-6 py-3 text-sm font-medium border-b-2 transition-colors ${cositasSubTab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"}`,
                                    children: t.label
                                }, t.id, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/plan-cositas",
                                className: "ml-auto mr-2 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm",
                                children: "🌐 Página Pública"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12 text-slate-400",
                        children: "Cargando estadísticas..."
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 384,
                        columnNumber: 13
                    }, this) : cositasSubTab === "estadisticas" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 388,
                                            columnNumber: 33
                                        }, void 0),
                                        label: "Tiendas en Cositas",
                                        value: cositas.length,
                                        color: "orange"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 388,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 389,
                                            columnNumber: 33
                                        }, void 0),
                                        label: "Cositas vendidas",
                                        value: totalCositasVendidas,
                                        color: "blue"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 390,
                                            columnNumber: 33
                                        }, void 0),
                                        label: "Cositas activas",
                                        value: totalCositasActivas,
                                        color: "green"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 390,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 391,
                                            columnNumber: 33
                                        }, void 0),
                                        label: "Cositas regaladas",
                                        value: totalCositasRegaladas,
                                        color: "indigo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 391,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 387,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white border border-slate-200 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 border-b border-slate-100 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                className: "w-4 h-4 text-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 395,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-slate-800",
                                                children: "Tiendas en Plan Cositas"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 396,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 394,
                                        columnNumber: 17
                                    }, this),
                                    cositas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-12 text-center text-slate-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                className: "w-10 h-10 mx-auto mb-3 opacity-30"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 400,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Aún no hay tiendas en Plan Cositas"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 401,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 399,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "bg-slate-50 text-left text-slate-500 text-xs uppercase",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3",
                                                            children: "Tienda"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3",
                                                            children: "Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3",
                                                            children: "Cositas activas"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3",
                                                            children: "Regaladas"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 410,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-3",
                                                            children: "Desde"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 405,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-slate-100",
                                                children: cositas.map((s)=>{
                                                    const sCositas = cositasPorTienda[s.id] || [];
                                                    const activas = sCositas.filter((c)=>c.is_active).length;
                                                    const regaladas = sCositas.filter((c)=>c.is_gifted).length;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-orange-50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-3 font-medium text-slate-800",
                                                                children: [
                                                                    s.subdomain,
                                                                    ".tol.ar"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-3 text-slate-500",
                                                                children: s.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full",
                                                                    children: [
                                                                        activas,
                                                                        " cositas"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 424,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 423,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-3",
                                                                children: regaladas > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-indigo-500 text-xs",
                                                                    children: [
                                                                        "gift ",
                                                                        regaladas
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 48
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-300",
                                                                    children: "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 116
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-3 text-slate-400",
                                                                children: new Date(s.created_at).toLocaleDateString("es-AR")
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, s.id, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 414,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 404,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 393,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : cositasSubTab === "cositas" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-slate-200 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-slate-800",
                                                    children: "Catálogo de Cositas"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mt-1",
                                                    children: "Las cositas disponibles se pueden comprar. Las próximamente están griseadas."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 444,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 442,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                setSavingCatalog(true);
                                                for (const [code, changes] of Object.entries(catalogChanges)){
                                                    const updates = {};
                                                    if (changes.precio !== undefined) updates.price = changes.precio;
                                                    if (changes.trial_days !== undefined) updates.trial_days = changes.trial_days;
                                                    if (Object.keys(updates).length > 0) {
                                                        await fetch("/api/super-admin/cositas", {
                                                            method: "PATCH",
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            },
                                                            body: JSON.stringify({
                                                                code,
                                                                ...updates
                                                            })
                                                        });
                                                    }
                                                }
                                                setCatalogChanges({});
                                                setSavingCatalog(false);
                                                alert("Guardado!");
                                            },
                                            disabled: savingCatalog || Object.keys(catalogChanges).length === 0,
                                            className: "text-sm font-semibold px-4 py-2 rounded-lg border border-orange-400 text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed",
                                            children: savingCatalog ? "Guardando..." : "GUARDAR"
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 446,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 441,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "bg-slate-50 text-left text-slate-500 text-xs uppercase",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Cosita"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Código"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Precio"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Tiendas activas"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 477,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Trial (días)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-6 py-3",
                                                        children: "Estado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 479,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 473,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 472,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "divide-y divide-slate-100",
                                            children: catalogFeatures.map((c)=>{
                                                const activas = Object.values(cositasPorTienda).flat().filter((f)=>f.feature_code === c.code && f.is_active).length;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: c.is_active ? "hover:bg-orange-50" : "opacity-50 bg-slate-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium text-slate-800",
                                                                    children: c.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 488,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-slate-400",
                                                                    children: c.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 489,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3 text-xs font-mono text-slate-400",
                                                            children: c.code
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 491,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-slate-400 text-xs",
                                                                        children: "USD"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                        lineNumber: 492,
                                                                        columnNumber: 94
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        defaultValue: c.precio,
                                                                        step: "0.5",
                                                                        min: "0.5",
                                                                        onChange: (e)=>setCatalogChanges((prev)=>({
                                                                                    ...prev,
                                                                                    [c.code]: {
                                                                                        ...prev[c.code] || {},
                                                                                        precio: parseFloat(e.target.value)
                                                                                    }
                                                                                })),
                                                                        className: "w-16 text-sm border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:border-orange-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                        lineNumber: 492,
                                                                        columnNumber: 145
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-slate-400 text-xs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                        lineNumber: 492,
                                                                        columnNumber: 468
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 492,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 492,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3",
                                                            children: activas > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full",
                                                                children: [
                                                                    activas,
                                                                    " tiendas"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 495,
                                                                columnNumber: 33
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-300 text-xs",
                                                                children: "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 496,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 493,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                defaultValue: featureTrialDays[c.code] ?? c.trial_days ?? 0,
                                                                min: "0",
                                                                max: "90",
                                                                onChange: (e)=>setCatalogChanges((prev)=>({
                                                                            ...prev,
                                                                            [c.code]: {
                                                                                ...prev[c.code] || {},
                                                                                trial_days: parseInt(e.target.value)
                                                                            }
                                                                        })),
                                                                className: "w-16 text-sm border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:border-orange-400"
                                                            }, `trial-${c.code}-${featureTrialDays[c.code]}`, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 499,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 498,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-6 py-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: async ()=>{
                                                                    const newVal = !c.is_active;
                                                                    const { createClient } = await __turbopack_context__.A("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript, async loader)");
                                                                    const sb = createClient(("TURBOPACK compile-time value", "https://tuznlaqncbrsbokbbzhy.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1em5sYXFuY2Jyc2Jva2Jiemh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjc4NDIsImV4cCI6MjA4OTYwMzg0Mn0.bWF8DNO6_HISbJnEIA9qufKN9qwMAyIZM2cjhWUrkQI"));
                                                                    await sb.from("store_features").update({
                                                                        is_active: newVal
                                                                    }).eq("code", c.code);
                                                                    setCatalogFeatures((prev)=>prev.map((x)=>x.code === c.code ? {
                                                                                ...x,
                                                                                is_active: newVal
                                                                            } : x));
                                                                },
                                                                className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${c.is_active ? "bg-orange-500" : "bg-slate-300"}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${c.is_active ? "translate-x-6" : "translate-x-1"}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                    lineNumber: 512,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 502,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, c.code, true, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 482,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 471,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 440,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 439,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-slate-200 rounded-lg p-8 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-4xl mb-4",
                                    children: "✏️"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 525,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-slate-700 mb-2",
                                    children: "Edición visual directa"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 526,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-500 mb-6",
                                    children: "La página tiene modo edición integrado. Entrá directamente y editá los textos pasando el mouse sobre ellos."
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 527,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/plan-cositas",
                                    target: "_blank",
                                    className: "inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm",
                                    children: "Ir a tol.ar/plan-cositas →"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 528,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 524,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 523,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 362,
                columnNumber: 9
            }, this),
            activeTab === "socios" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center border-b border-slate-200",
                        children: [
                            [
                                {
                                    id: "estadisticas",
                                    label: "ESTADÍSTICAS"
                                },
                                {
                                    id: "socios",
                                    label: "SOCIOS"
                                }
                            ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSociosSubTab(t.id),
                                    className: `px-6 py-3 text-sm font-medium border-b-2 transition-colors ${sociosSubTab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`,
                                    children: t.label
                                }, t.id, false, {
                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                    lineNumber: 548,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/plan-socio",
                                className: "ml-auto mr-2 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm",
                                children: "🌐 Página Pública"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 560,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 543,
                        columnNumber: 11
                    }, this),
                    sociosSubTab === "estadisticas" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-blue-50 border border-blue-100 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-blue-400 font-semibold uppercase mb-1",
                                        children: "Socios activos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 570,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-blue-600",
                                        children: socios.filter((s)=>s.plan === "socios").length
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 571,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 569,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 border border-green-100 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-green-400 font-semibold uppercase mb-1",
                                        children: "Solicitudes pendientes"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-green-600",
                                        children: "0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 575,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 573,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-amber-50 border border-amber-100 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-amber-400 font-semibold uppercase mb-1",
                                        children: "Ventas del mes"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 578,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-amber-600",
                                        children: "$0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 579,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 577,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-purple-50 border border-purple-100 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-purple-400 font-semibold uppercase mb-1",
                                        children: "Comisiones del mes"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 582,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-3xl font-bold text-purple-600",
                                        children: "$0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 583,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 581,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 568,
                        columnNumber: 13
                    }, this),
                    sociosSubTab === "socios" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-slate-200 rounded-xl overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6 py-4 border-b border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-slate-700",
                                        children: "Tiendas en Plan Socio"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 592,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-400 mt-1",
                                        children: "Tiendas con comisión sobre ventas. El % es editable por socio."
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 593,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 591,
                                columnNumber: 15
                            }, this),
                            socios.filter((s)=>s.plan === "socios").length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-16 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "w-10 h-10 text-slate-300 mx-auto mb-3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 597,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-400 text-sm",
                                        children: "Aún no hay socios activos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 598,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 596,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-slate-50 text-xs text-slate-500 uppercase",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left",
                                                    children: "Tienda"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left",
                                                    children: "Email"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 605,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left",
                                                    children: "Teléfono"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 606,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left",
                                                    children: "Agente"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-right",
                                                    children: "Ventas/mes"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-center",
                                                    children: "%"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-right",
                                                    children: "Comisión"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-center",
                                                    children: "Estado"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 611,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left",
                                                    children: "Desde"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                            lineNumber: 603,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 602,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-slate-100",
                                        children: socios.filter((s)=>s.plan === "socios").map((s)=>{
                                            const ventas = s.ventas_mes || 0;
                                            const pct = s.comision_pct ?? 10;
                                            const comision = ventas * pct / 100;
                                            const estado = s.estado_socio || "pendiente";
                                            const estadoColor = estado === "activo" ? "bg-green-100 text-green-700" : estado === "suspendido" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-slate-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 font-medium text-blue-600",
                                                        children: [
                                                            s.subdomain,
                                                            ".tol.ar"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 624,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-slate-500 text-xs",
                                                        children: s.email || "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 625,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-slate-500 text-xs",
                                                        children: s.whatsapp_number || "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 626,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-slate-500 text-xs",
                                                        children: s.agente || "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 627,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-right",
                                                        children: [
                                                            "$",
                                                            ventas.toLocaleString("es-AR")
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 628,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                defaultValue: pct,
                                                                min: 1,
                                                                max: 50,
                                                                onBlur: async (e)=>{
                                                                    const val = parseFloat(e.target.value);
                                                                    if (!isNaN(val) && val !== pct) {
                                                                        await supabase.from("stores").update({
                                                                            comision_pct: val
                                                                        }).eq("id", s.id);
                                                                    }
                                                                },
                                                                className: "w-14 text-center border border-purple-200 rounded-lg px-1 py-1 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 630,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-purple-700 font-bold ml-1",
                                                                children: "%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                                lineNumber: 643,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 629,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-right font-semibold text-purple-600",
                                                        children: [
                                                            "$",
                                                            comision.toLocaleString("es-AR")
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 645,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-xs font-semibold px-2 py-1 rounded-full ${estadoColor}`,
                                                            children: estado
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                            lineNumber: 647,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 646,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-slate-400 text-xs",
                                                        children: new Date(s.created_at).toLocaleDateString("es-AR")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, s.id, true, {
                                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                                lineNumber: 623,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                        lineNumber: 615,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                                lineNumber: 601,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 590,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 541,
                columnNumber: 9
            }, this),
            activeTab === "mayorista" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-50 border border-slate-200 rounded-lg p-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            className: "w-8 h-8 text-slate-400"
                        }, void 0, false, {
                            fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                            lineNumber: 668,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 667,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold text-slate-400 mb-2",
                        children: "Plan Mayorista"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 670,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-block bg-slate-200 text-slate-500 text-sm px-4 py-1 rounded-full",
                        children: "Próximamente"
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 671,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 666,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_s(PlansDashboard, "vDRYM/lQ/T4j+P6A+SGwgvY5tdk=");
_c = PlansDashboard;
function StatCard({ icon, label, value, color }) {
    const colors = {
        slate: "bg-slate-50 border-slate-200 text-slate-700",
        green: "bg-green-50 border-green-200 text-green-700",
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
        red: "bg-red-50 border-red-200 text-red-700",
        orange: "bg-orange-50 border-orange-200 text-orange-700"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `border rounded-lg p-4 ${colors[color]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-1 opacity-70",
                children: [
                    icon,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                        lineNumber: 689,
                        columnNumber: 70
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 689,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-3xl font-bold",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/super-admin/plans-dashboard.tsx",
                lineNumber: 690,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/super-admin/plans-dashboard.tsx",
        lineNumber: 688,
        columnNumber: 5
    }, this);
}
_c1 = StatCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "PlansDashboard");
__turbopack_context__.k.register(_c1, "StatCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_super-admin_plans-dashboard_tsx_09d30674._.js.map