(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/super-admin/whatsapp-tab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WhatsappTab",
    ()=>WhatsappTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function WhatsappTab() {
    _s();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("conexion");
    const [waStatus, setWaStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: "disconnected",
        phoneNumber: null,
        qr: null
    });
    const [contacts, setContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [merchants, setMerchants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mensaje, setMensaje] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [intervaloMin, setIntervaloMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3);
    const [intervaloMax, setIntervaloMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(15);
    const [tandaMin, setTandaMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(8);
    const [tandaMax, setTandaMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(15);
    const [pausaMin, setPausaMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(90);
    const [pausaMax, setPausaMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(180);
    const [limiteDiario2, setLimiteDiario2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(20);
    const [seleccionados, setSeleccionados] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [enviando, setEnviando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [resultado, setResultado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [segmento, setSegmento] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("merchants");
    const [fuenteTab, setFuenteTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("tolar");
    const [textoPegar, setTextoPegar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [csvContactos, setCsvContactos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [contactosManuales, setContactosManuales] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [grupos, setGrupos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cargandoGrupos, setCargandoGrupos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [limiteDiario, setLimiteDiario] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(50);
    const [grupoOffset, setGrupoOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [grupoTotal, setGrupoTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [grupoAdmins, setGrupoAdmins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [campanas, setCampanas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mostrarOcultos, setMostrarOcultos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [popupGrupo, setPopupGrupo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [popupTab, setPopupTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pegar");
    const [popupTexto, setPopupTexto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [popupContactos, setPopupContactos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [gruposNumerosMap, setGruposNumerosMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [incluirAdmins, setIncluirAdmins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [mediaFile, setMediaFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mediaPreview, setMediaPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mediaType, setMediaType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const mediaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [nuevoNombre, setNuevoNombre] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [nuevoNumero, setNuevoNumero] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WhatsappTab.useEffect": ()=>{
            cargarStatus();
            cargarMerchants();
            cargarMensajes();
            cargarCampanas();
            intervalRef.current = setInterval(cargarStatus, 5000);
            return ({
                "WhatsappTab.useEffect": ()=>{
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            })["WhatsappTab.useEffect"];
        }
    }["WhatsappTab.useEffect"], []);
    const cargarStatus = async ()=>{
        try {
            const res = await fetch("/api/super-admin/whatsapp?accion=status");
            const data = await res.json();
            setWaStatus(data);
        } catch  {}
    };
    const cargarMerchants = async ()=>{
        try {
            const res = await fetch("/api/super-admin/whatsapp?accion=merchants");
            const data = await res.json();
            setMerchants(data.merchants || []);
            const ids = new Set((data.merchants || []).map((m)=>m.id));
            setSeleccionados(ids);
        } catch  {}
    };
    const cargarMensajes = async ()=>{
        try {
            const res = await fetch("/api/super-admin/whatsapp?accion=messages");
            const data = await res.json();
            setMessages(data.messages || []);
        } catch  {}
    };
    const enviarBroadcast = async ()=>{
        if (!mensaje.trim()) return;
        const lista = getListaFinal();
        if (lista.length === 0) return;
        setEnviando(true);
        setResultado(null);
        try {
            let imageUrl = null;
            if (mediaFile && (mediaType === "image" || mediaType === "video")) {
                const formData = new FormData();
                formData.append("file", mediaFile);
                const uploadRes = await fetch("/api/super-admin/whatsapp-upload", {
                    method: "POST",
                    body: formData
                });
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }
            // Si es de grupos, guardar campaña en Supabase
            if (fuenteTab === "grupos" && grupoSeleccionado) {
                const grupo = grupos.find((g)=>g.id === grupoSeleccionado);
                await fetch("/api/super-admin/whatsapp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accion: "guardar-campana",
                        datos: {
                            grupo_id: grupoSeleccionado,
                            grupo_nombre: grupo?.nombre || grupoSeleccionado,
                            total_miembros: grupoTotal,
                            offset_actual: grupoOffset + lista.length,
                            limite_diario: limiteDiario,
                            mensaje,
                            imagen_url: imageUrl
                        }
                    })
                });
            }
            const res = await fetch("/api/super-admin/whatsapp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "broadcast",
                    datos: {
                        numbers: lista,
                        message: mensaje,
                        imageUrl,
                        intervalMin,
                        intervalMax,
                        tandaMin,
                        tandaMax,
                        pausaMin,
                        pausaMax,
                        limiteDiario: limiteDiario2
                    }
                })
            });
            const data = await res.json();
            setResultado({
                sent: data.sent || 0,
                failed: data.failed || 0
            });
            cargarMensajes();
            cargarCampanas();
        } catch  {}
        setEnviando(false);
    };
    const handleMedia = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        if (!isVideo && !isImage) return;
        setMediaFile(file);
        setMediaType(isVideo ? "video" : "image");
        setMediaPreview(URL.createObjectURL(file));
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WhatsappTab.useEffect": ()=>{
            if (grupoSeleccionado) importarGrupo(grupoSeleccionado, grupoOffset, incluirAdmins);
        }
    }["WhatsappTab.useEffect"], [
        incluirAdmins
    ]);
    const parsearPopup = (texto)=>{
        const lineas = texto.split(/[\n,;]+/).map((l)=>l.trim()).filter((l)=>l.length > 6);
        const contactos = lineas.map((l)=>{
            const partes = l.split(/[\t|]+/);
            const numero = partes[0]?.replace(/[^0-9]/g, '') || "";
            const nombre = partes[1]?.trim() || numero;
            return {
                nombre,
                numero
            };
        }).filter((c)=>c.numero.length >= 7);
        setPopupContactos(contactos);
    };
    const handlePopupCSV = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev)=>parsearPopup(ev.target?.result);
        reader.readAsText(file);
    };
    const confirmarNumerosGrupo = ()=>{
        if (!popupGrupo || popupContactos.length === 0) return;
        setContactosManuales(popupContactos);
        setGrupoSeleccionado(popupGrupo.id);
        setGrupoTotal(popupContactos.length);
        setGrupoAdmins(0);
        setGrupoOffset(0);
        setGruposNumerosMap((prev)=>({
                ...prev,
                [popupGrupo.id]: popupContactos.length
            }));
        setPopupGrupo(null);
        setPopupTexto("");
        setPopupContactos([]);
    };
    const cargarCampanas = async ()=>{
        try {
            const res = await fetch("/api/super-admin/whatsapp?accion=campanas-activas");
            const data = await res.json();
            setCampanas(data.campanas || []);
        } catch  {}
    };
    const ocultarGrupo = async (grupoId)=>{
        await fetch("/api/super-admin/whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "ocultar-grupo",
                datos: {
                    grupo_id: grupoId
                }
            })
        });
        setGrupos((prev)=>prev.map((g)=>g.id === grupoId ? {
                    ...g,
                    oculto: true
                } : g));
    };
    const mostrarGrupo = async (grupoId)=>{
        await fetch("/api/super-admin/whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "mostrar-grupo",
                datos: {
                    grupo_id: grupoId
                }
            })
        });
        setGrupos((prev)=>prev.map((g)=>g.id === grupoId ? {
                    ...g,
                    oculto: false
                } : g));
    };
    const pausarCampana = async (id)=>{
        await fetch("/api/super-admin/whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "pausar-campana",
                datos: {
                    id
                }
            })
        });
        setCampanas((prev)=>prev.map((c)=>c.id === id ? {
                    ...c,
                    estado: "pausada"
                } : c));
    };
    const cancelarCampana = async (id)=>{
        await fetch("/api/super-admin/whatsapp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "cancelar-campana",
                datos: {
                    id
                }
            })
        });
        setCampanas((prev)=>prev.filter((c)=>c.id !== id));
    };
    const cargarGrupos = async ()=>{
        setCargandoGrupos(true);
        try {
            const res = await fetch("/api/super-admin/whatsapp?accion=grupos");
            const data = await res.json();
            setGrupos(data.grupos || []);
        } catch  {}
        setCargandoGrupos(false);
    };
    const importarGrupo = async (groupId, offset = 0, forzarAdmins)=>{
        const admins = forzarAdmins !== undefined ? forzarAdmins : incluirAdmins;
        try {
            const res = await fetch(`/api/super-admin/whatsapp?accion=grupo-miembros&id=${groupId}&limite=${limiteDiario}&offset=${offset}&incluir_admins=${admins}`);
            const data = await res.json();
            setContactosManuales(data.miembros || []);
            setGrupoSeleccionado(groupId);
            setGrupoTotal(data.total || 0);
            setGrupoAdmins(data.admins || 0);
            setGrupoOffset(offset);
        } catch  {}
    };
    const parsearNumeros = (texto)=>{
        const lineas = texto.split(/[\n,;]+/).map((l)=>l.trim()).filter((l)=>l.length > 6);
        const contactos = lineas.map((l)=>{
            const partes = l.split(/[\t|]+/);
            const numero = partes[0]?.replace(/[^0-9]/g, '') || "";
            const nombre = partes[1]?.trim() || numero;
            return {
                nombre,
                numero
            };
        }).filter((c)=>c.numero.length >= 7);
        setCsvContactos(contactos);
        setContactosManuales(contactos);
    };
    const handleCSV = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev)=>{
            const texto = ev.target?.result;
            parsearNumeros(texto);
        };
        reader.readAsText(file);
    };
    const getListaFinal = ()=>{
        if (fuenteTab === "tolar") {
            return merchants.filter((m)=>seleccionados.has(m.id)).map((m)=>m.social_whatsapp);
        }
        return contactosManuales.map((c)=>c.numero);
    };
    const toggleSeleccionado = (id)=>{
        setSeleccionados((prev)=>{
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };
    const toggleTodos = ()=>{
        const lista = segmento === "merchants" ? merchants.map((m)=>m.id) : contacts.map((c)=>c.id);
        if (seleccionados.size === lista.length) setSeleccionados(new Set());
        else setSeleccionados(new Set(lista));
    };
    const statusColor = waStatus.status === "connected" ? "#25d366" : waStatus.status === "qr" ? "#f59e0b" : "#e24b4a";
    const statusText = waStatus.status === "connected" ? "Conectado" : waStatus.status === "qr" ? "Esperando QR" : waStatus.status === "offline" ? "Servicio offline" : "Desconectado";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-semibold",
                                children: "WhatsApp tol.ar"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-500",
                                children: "Mensajes masivos y bandeja de entrada"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 325,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 px-3 py-2 rounded-lg border",
                        style: {
                            borderColor: statusColor + "40",
                            background: statusColor + "10"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full",
                                style: {
                                    background: statusColor
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium",
                                style: {
                                    color: statusColor
                                },
                                children: statusText
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this),
                            waStatus.phoneNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-slate-500",
                                children: waStatus.phoneNumber
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 332,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b",
                style: {
                    borderBottom: "2px solid #075e54"
                },
                children: [
                    [
                        "conexion",
                        "Conexión"
                    ],
                    [
                        "envio",
                        "Envío masivo"
                    ],
                    [
                        "historial",
                        "Historial"
                    ]
                ].map(([id, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(id),
                        className: "px-5 py-3 text-sm font-medium transition-colors",
                        style: {
                            borderBottom: tab === id ? "3px solid #25d366" : "3px solid transparent",
                            color: tab === id ? "#075e54" : "#6b7280",
                            marginBottom: "-2px"
                        },
                        children: label
                    }, id, false, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            tab === "conexion" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border p-5",
                        style: {
                            borderColor: "#25d36640",
                            background: "#f0fdf4"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold",
                                        style: {
                                            background: "#075e54"
                                        },
                                        children: "WA"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 354,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-lg",
                                                children: waStatus.phoneNumber || "Sin número conectado"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 356,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-slate-500",
                                                children: [
                                                    statusText,
                                                    " · tol.ar WhatsApp"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 357,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this),
                                    waStatus.status !== "connected" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: cargarStatus,
                                        variant: "outline",
                                        size: "sm",
                                        children: "Reconectar"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this),
                            waStatus.qrImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 p-4 bg-white rounded-lg border text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium text-slate-700 mb-3",
                                        children: "Escaneá este QR con WhatsApp"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 365,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: waStatus.qrImage,
                                        alt: "QR WhatsApp",
                                        className: "mx-auto",
                                        style: {
                                            width: 200,
                                            height: 200
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 366,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-400 mt-2",
                                        children: "WhatsApp → Dispositivos vinculados → Vincular dispositivo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 367,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 364,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 352,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border p-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-slate-500 uppercase tracking-wide mb-4",
                                children: "Estado del servicio"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-slate-50 rounded-lg p-4 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-semibold",
                                                children: merchants.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 376,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 mt-1",
                                                children: "Merchants con WA"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 377,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-slate-50 rounded-lg p-4 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-semibold",
                                                children: messages.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 380,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 mt-1",
                                                children: "Campañas enviadas"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 381,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-slate-50 rounded-lg p-4 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-semibold",
                                                style: {
                                                    color: "#25d366"
                                                },
                                                children: messages.reduce((a, m)=>a + (m.enviados || 0), 0)
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 384,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 mt-1",
                                                children: "Mensajes enviados"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 387,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 383,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 374,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                lineNumber: 351,
                columnNumber: 9
            }, this),
            tab === "envio" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium mb-3",
                                        children: "Mensaje"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "w-full text-sm px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none",
                                        rows: 5,
                                        placeholder: "Hola {nombre}! 👋 Te cuento que en tol.ar podés tener tu tienda online gratis...",
                                        value: mensaje,
                                        onChange: (e)=>setMensaje(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 399,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mt-2 flex-wrap items-center",
                                        children: [
                                            [
                                                "{nombre}",
                                                "{tienda}",
                                                "{link}"
                                            ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setMensaje((m)=>m + v),
                                                    className: "text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
                                                    children: v
                                                }, v, false, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 19
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                ref: mediaRef,
                                                type: "file",
                                                accept: "image/*,video/*",
                                                className: "hidden",
                                                onChange: handleMedia
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 413,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>mediaRef.current?.click(),
                                                className: "text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1",
                                                children: "📷 Imagen"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 414,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>mediaRef.current?.click(),
                                                className: "text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1",
                                                children: "🎥 Video"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 418,
                                                columnNumber: 17
                                            }, this),
                                            mediaFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setMediaFile(null);
                                                    setMediaPreview(null);
                                                    setMediaType(null);
                                                },
                                                className: "text-xs px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
                                                children: "✕ Sacar"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 423,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 406,
                                        columnNumber: 15
                                    }, this),
                                    mediaPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 rounded-lg overflow-hidden border",
                                        style: {
                                            maxWidth: 200
                                        },
                                        children: [
                                            mediaType === "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: mediaPreview,
                                                alt: "preview",
                                                className: "w-full"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 432,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                src: mediaPreview,
                                                className: "w-full",
                                                controls: true,
                                                muted: true,
                                                style: {
                                                    maxHeight: 120
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 433,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 p-1 truncate",
                                                children: mediaFile?.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 435,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 430,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 397,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium",
                                        children: "Configuración"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between p-3 rounded-lg",
                                        style: {
                                            background: "var(--color-background-secondary)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full",
                                                        style: {
                                                            background: waStatus.status === "connected" ? "#25d366" : "#e24b4a"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-medium",
                                                                children: waStatus.phoneNumber || "Sin número"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 446,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs",
                                                                style: {
                                                                    color: waStatus.status === "connected" ? "#0F6E56" : "#A32D2D"
                                                                },
                                                                children: waStatus.status === "connected" ? "Conectado" : "Desconectado"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 447,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 445,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 443,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setTab("conexion"),
                                                className: "text-xs px-3 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50",
                                                children: "Cambiar número"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 450,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 442,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium text-slate-500 uppercase tracking-wide mb-2",
                                                children: "Intervalo entre mensajes"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 454,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Mínimo (seg)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 456,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 60,
                                                                value: intervaloMin,
                                                                onChange: (e)=>setIntervaloMin(Number(e.target.value)),
                                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 457,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Máximo (seg)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 60,
                                                                value: intervaloMax,
                                                                onChange: (e)=>setIntervaloMax(Number(e.target.value)),
                                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 460,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 459,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 455,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 453,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium text-slate-500 uppercase tracking-wide mb-2",
                                                children: "Tamaño de tanda"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 466,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Mínimo (msgs)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 50,
                                                                value: tandaMin,
                                                                onChange: (e)=>setTandaMin(Number(e.target.value)),
                                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 469,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Máximo (msgs)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 50,
                                                                value: tandaMax,
                                                                onChange: (e)=>setTandaMax(Number(e.target.value)),
                                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 472,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 471,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 467,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium text-slate-500 uppercase tracking-wide mb-2",
                                                children: "Pausa entre tandas"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 478,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Mínimo (min)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 480,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 1440,
                                                                value: pausaMin,
                                                                onChange: (e)=>setPausaMin(Number(e.target.value)),
                                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 481,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 480,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Máximo (min)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 483,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: 1,
                                                                max: 1440,
                                                                value: pausaMax,
                                                                onChange: (e)=>setPausaMax(Number(e.target.value)),
                                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 484,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 479,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 477,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium text-slate-500 uppercase tracking-wide mb-2",
                                                children: "Límite diario total"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 490,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "w-full text-xs px-2 py-1.5 rounded border bg-background",
                                                value: limiteDiario2,
                                                onChange: (e)=>setLimiteDiario2(Number(e.target.value)),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 10,
                                                        children: "10 / día (muy seguro)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 493,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 20,
                                                        children: "20 / día (seguro)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 30,
                                                        children: "30 / día (moderado)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 491,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 flex items-center gap-2 p-2 rounded-lg text-xs font-medium",
                                                style: {
                                                    background: limiteDiario2 <= 20 ? "#E1F5EE" : limiteDiario2 <= 35 ? "#FAEEDA" : "#FCEBEB",
                                                    color: limiteDiario2 <= 20 ? "#085041" : limiteDiario2 <= 35 ? "#633806" : "#791F1F"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: limiteDiario2 <= 20 ? "🟢" : limiteDiario2 <= 35 ? "🟡" : "🔴"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 500,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: limiteDiario2 <= 20 ? "Riesgo bajo — seguro" : limiteDiario2 <= 35 ? "Precaución — usá con cuidado" : "Riesgo de baneo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 501,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 497,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 489,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-400",
                                        children: "Cada mensaje espera un tiempo aleatorio entre min y max — nunca la misma secuencia."
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this),
                            resultado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border p-4",
                                style: {
                                    background: "#f0fdf4",
                                    borderColor: "#25d36640"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium",
                                        style: {
                                            color: "#075e54"
                                        },
                                        children: "Envío completado"
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 509,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-600 mt-1",
                                        children: [
                                            "✓ ",
                                            resultado.sent,
                                            " enviados · ✗ ",
                                            resultado.failed,
                                            " fallidos"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 510,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 508,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 396,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium mb-3",
                                children: "Destinatarios"
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1 mb-4 border-b",
                                children: [
                                    [
                                        "tolar",
                                        "tol.ar"
                                    ],
                                    [
                                        "pegar",
                                        "Copiar/Pegar"
                                    ],
                                    [
                                        "csv",
                                        "CSV"
                                    ],
                                    [
                                        "grupos",
                                        "Grupos"
                                    ]
                                ].map(([id, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setFuenteTab(id);
                                            setContactosManuales([]);
                                        },
                                        className: "text-xs px-4 py-2 font-medium transition-colors",
                                        style: {
                                            borderBottom: fuenteTab === id ? "2px solid #25d366" : "2px solid transparent",
                                            color: fuenteTab === id ? "#075e54" : "#6b7280",
                                            marginBottom: "-1px"
                                        },
                                        children: label
                                    }, id, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 519,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 517,
                                columnNumber: 13
                            }, this),
                            fuenteTab === "tolar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-500",
                                                children: "Merchants con WhatsApp"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 534,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: toggleTodos,
                                                className: "text-xs text-slate-500 hover:text-slate-700 underline",
                                                children: seleccionados.size === merchants.length ? "Deseleccionar todos" : "Seleccionar todos"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 535,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 533,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 max-h-56 overflow-y-auto",
                                        children: merchants.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: ()=>toggleSeleccionado(m.id),
                                                className: `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${seleccionados.has(m.id) ? "bg-green-50" : "hover:bg-slate-50"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: seleccionados.has(m.id),
                                                        onChange: ()=>{},
                                                        className: "pointer-events-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 543,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-slate-200 text-slate-600 flex-shrink-0",
                                                        children: m.site_title?.slice(0, 2).toUpperCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 544,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-medium truncate",
                                                                children: m.site_title
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 548,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-slate-400",
                                                                children: m.social_whatsapp
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 549,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 547,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, m.id, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 541,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 539,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            fuenteTab === "pegar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500",
                                        children: [
                                            "Pegá números separados por enter, coma o punto y coma. Podés agregar nombre con tab: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "nombre<tab>número"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 559,
                                                columnNumber: 140
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 559,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "w-full text-xs px-3 py-2 rounded-lg border bg-background focus:outline-none resize-none font-mono",
                                        rows: 6,
                                        placeholder: "Un número por línea: 541112345678",
                                        value: textoPegar,
                                        onChange: (e)=>{
                                            setTextoPegar(e.target.value);
                                            parsearNumeros(e.target.value);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 560,
                                        columnNumber: 17
                                    }, this),
                                    contactosManuales.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-green-600 font-medium",
                                        children: [
                                            contactosManuales.length,
                                            " números detectados"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 568,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 558,
                                columnNumber: 15
                            }, this),
                            fuenteTab === "csv" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500",
                                        children: "Subí un archivo CSV o TXT con números. Primera columna: número. Segunda columna (opcional): nombre."
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 575,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-slate-500",
                                                children: "Clickeá para subir CSV o TXT"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 577,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400 mt-1",
                                                children: "541112345678, Juan"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 578,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: ".csv,.txt",
                                                className: "hidden",
                                                onChange: handleCSV
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 579,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 576,
                                        columnNumber: 17
                                    }, this),
                                    contactosManuales.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-green-600 font-medium mb-2",
                                                children: [
                                                    contactosManuales.length,
                                                    " contactos importados"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 583,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "max-h-40 overflow-y-auto space-y-1",
                                                children: [
                                                    contactosManuales.slice(0, 5).map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-xs text-slate-600 p-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: c.nombre
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-400",
                                                                    children: c.numero
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                    lineNumber: 588,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 25
                                                        }, this)),
                                                    contactosManuales.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-400",
                                                        children: [
                                                            "... y ",
                                                            contactosManuales.length - 5,
                                                            " más"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 56
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 584,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 582,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 574,
                                columnNumber: 15
                            }, this),
                            fuenteTab === "grupos" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-500",
                                                        children: "Límite diario:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 602,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: "text-xs border rounded px-2 py-1 bg-background",
                                                        value: limiteDiario,
                                                        onChange: (e)=>setLimiteDiario(Number(e.target.value)),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 25,
                                                                children: "25/día (muy seguro)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 605,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 50,
                                                                children: "50/día (seguro)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 606,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 100,
                                                                children: "100/día (moderado)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 607,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 603,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 601,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: cargarGrupos,
                                                disabled: cargandoGrupos,
                                                className: "text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50",
                                                children: cargandoGrupos ? "Cargando..." : "Ver mis grupos"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 610,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 600,
                                        columnNumber: 17
                                    }, this),
                                    grupos.length === 0 && !cargandoGrupos && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-6 text-xs text-slate-400 border border-dashed rounded-lg",
                                        children: 'Apretá "Ver mis grupos" para cargar la lista'
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 616,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-slate-500",
                                                    children: "Admins:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 622,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "text-xs border rounded px-2 py-1 bg-background",
                                                    value: incluirAdmins ? "incluir" : "excluir",
                                                    onChange: (e)=>setIncluirAdmins(e.target.value === "incluir"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "incluir",
                                                            children: "Incluir"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 626,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "excluir",
                                                            children: "Excluir"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 627,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 623,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 621,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 620,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-400",
                                                children: [
                                                    grupos.filter((g)=>!g.oculto).length,
                                                    " grupos visibles"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 632,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setMostrarOcultos((p)=>!p),
                                                className: "text-xs text-slate-400 hover:text-slate-600 underline",
                                                children: mostrarOcultos ? "Ocultar archivados" : "Ver archivados"
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 633,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 631,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 max-h-48 overflow-y-auto",
                                        children: grupos.filter((g)=>mostrarOcultos ? g.oculto : !g.oculto).map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex items-center gap-2 p-2 rounded-lg border transition-colors ${grupoSeleccionado === g.id ? "bg-green-50 border-green-200" : "border-transparent hover:bg-slate-50"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>!g.oculto && importarGrupo(g.id),
                                                        className: "flex items-center gap-2 flex-1 min-w-0 cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                                                                style: {
                                                                    background: g.oculto ? "#888" : "#075e54",
                                                                    color: "white"
                                                                },
                                                                children: "G"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 643,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: `text-xs font-medium truncate ${g.oculto ? "text-slate-400" : ""}`,
                                                                        children: g.nombre
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                        lineNumber: 646,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-slate-400",
                                                                        children: [
                                                                            g.participantes,
                                                                            " participantes"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                        lineNumber: 647,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 645,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 641,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            setPopupGrupo({
                                                                id: g.id,
                                                                nombre: g.nombre
                                                            });
                                                            setPopupTab("pegar");
                                                            setPopupTexto("");
                                                            setPopupContactos([]);
                                                        },
                                                        className: "text-xs px-2 py-1 rounded shrink-0 font-medium",
                                                        style: {
                                                            background: "#e6f1fb",
                                                            color: "#185fa5"
                                                        },
                                                        children: [
                                                            "📋 ",
                                                            gruposNumerosMap[g.id] ? gruposNumerosMap[g.id] + "n" : "Números"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 650,
                                                        columnNumber: 23
                                                    }, this),
                                                    grupoSeleccionado === g.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-green-600 font-medium shrink-0",
                                                        children: "✓"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 54
                                                    }, this),
                                                    !g.oculto ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            ocultarGrupo(g.id);
                                                        },
                                                        className: "text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors",
                                                        style: {
                                                            background: "#fee2e2",
                                                            color: "#dc2626"
                                                        },
                                                        title: "Archivar",
                                                        children: "✕"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 657,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            mostrarGrupo(g.id);
                                                        },
                                                        className: "text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors",
                                                        style: {
                                                            background: "#dcfce7",
                                                            color: "#16a34a"
                                                        },
                                                        title: "Restaurar",
                                                        children: "↩"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 661,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, g.id, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 639,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 637,
                                        columnNumber: 17
                                    }, this),
                                    popupGrupo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fixed inset-0 z-50 flex items-center justify-center",
                                        style: {
                                            background: "rgba(0,0,0,0.5)"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white rounded-xl border shadow-lg p-5 w-full max-w-md mx-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-medium",
                                                                    children: popupGrupo.nombre
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                    lineNumber: 674,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-slate-500",
                                                                    children: "Cargá los números de este grupo"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                    lineNumber: 675,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 673,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setPopupGrupo(null),
                                                            className: "text-slate-400 hover:text-slate-600 text-lg",
                                                            children: "✕"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 677,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 672,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1 border-b mb-4",
                                                    children: [
                                                        [
                                                            "pegar",
                                                            "Copiar/Pegar"
                                                        ],
                                                        [
                                                            "csv",
                                                            "CSV"
                                                        ]
                                                    ].map(([id, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setPopupTab(id),
                                                            className: "text-xs px-4 py-2 font-medium",
                                                            style: {
                                                                borderBottom: popupTab === id ? "2px solid #25d366" : "2px solid transparent",
                                                                color: popupTab === id ? "#075e54" : "#6b7280",
                                                                marginBottom: "-1px"
                                                            },
                                                            children: label
                                                        }, id, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 681,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 19
                                                }, this),
                                                popupTab === "pegar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-slate-500",
                                                            children: "Un número por línea"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 690,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            className: "w-full text-xs px-3 py-2 rounded-lg border bg-background resize-none font-mono focus:outline-none",
                                                            rows: 6,
                                                            placeholder: "541112345678",
                                                            value: popupTexto,
                                                            onChange: (e)=>{
                                                                setPopupTexto(e.target.value);
                                                                parsearPopup(e.target.value);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 691,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 21
                                                }, this),
                                                popupTab === "csv" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-slate-500",
                                                            children: "CSV o TXT con números"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 698,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-slate-500",
                                                                    children: "Clickeá para subir"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                    lineNumber: 700,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "file",
                                                                    accept: ".csv,.txt",
                                                                    className: "hidden",
                                                                    onChange: handlePopupCSV
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                    lineNumber: 701,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 699,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 697,
                                                    columnNumber: 21
                                                }, this),
                                                popupContactos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-green-600 font-medium mt-2",
                                                    children: [
                                                        popupContactos.length,
                                                        " números detectados"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 706,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 mt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setPopupGrupo(null),
                                                            className: "flex-1 text-sm py-2 rounded-lg border border-slate-200 text-slate-600",
                                                            children: "Cancelar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 709,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: confirmarNumerosGrupo,
                                                            disabled: popupContactos.length === 0,
                                                            className: "flex-1 text-sm py-2 rounded-lg text-white font-medium",
                                                            style: {
                                                                background: popupContactos.length > 0 ? "#25d366" : "#d1d5db"
                                                            },
                                                            children: [
                                                                "Usar ",
                                                                popupContactos.length,
                                                                " números"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                            lineNumber: 710,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 708,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 671,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 670,
                                        columnNumber: 15
                                    }, this),
                                    grupoTotal > 0 && grupoSeleccionado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-green-600 font-medium",
                                                    children: [
                                                        contactosManuales.length,
                                                        " miembros listos",
                                                        incluirAdmins ? "" : ` · ${grupoAdmins} admins excluidos`,
                                                        " · ",
                                                        grupoTotal,
                                                        " total"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                    lineNumber: 723,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 722,
                                                columnNumber: 21
                                            }, this),
                                            grupoTotal > limiteDiario && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-amber-50 border border-amber-200 rounded-lg p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-amber-700 font-medium",
                                                        children: [
                                                            "Enviando ",
                                                            grupoOffset + 1,
                                                            "–",
                                                            Math.min(grupoOffset + limiteDiario, grupoTotal),
                                                            " de ",
                                                            grupoTotal,
                                                            " miembros"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 729,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-amber-600 mt-1",
                                                        children: [
                                                            "Días restantes: ",
                                                            Math.ceil((grupoTotal - grupoOffset) / limiteDiario)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 732,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-2",
                                                        children: [
                                                            grupoOffset > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>importarGrupo(grupoSeleccionado, grupoOffset - limiteDiario),
                                                                className: "text-xs px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-100",
                                                                children: "← Tanda anterior"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 737,
                                                                columnNumber: 29
                                                            }, this),
                                                            grupoOffset + limiteDiario < grupoTotal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>importarGrupo(grupoSeleccionado, grupoOffset + limiteDiario),
                                                                className: "text-xs px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-100",
                                                                children: "Próxima tanda →"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                                lineNumber: 743,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                        lineNumber: 735,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 728,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 721,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 599,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 pt-3 border-t",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: enviarBroadcast,
                                    disabled: enviando || !mensaje.trim() || (fuenteTab === "tolar" ? seleccionados.size === 0 : contactosManuales.length === 0),
                                    className: "w-full",
                                    style: {
                                        background: "#25d366",
                                        border: "none"
                                    },
                                    children: enviando ? "Enviando..." : `Enviar a ${fuenteTab === "tolar" ? seleccionados.size : contactosManuales.length} contactos`
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                    lineNumber: 757,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 756,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                        lineNumber: 515,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                lineNumber: 395,
                columnNumber: 9
            }, this),
            tab === "historial" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm border-collapse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            style: {
                                background: "#075e54"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    "Fecha",
                                    "Mensaje",
                                    "Destinatarios",
                                    "Enviados",
                                    "Fallidos",
                                    "Estado"
                                ].map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "text-left py-3 px-4 text-xs font-medium text-white",
                                        children: h
                                    }, h, false, {
                                        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                        lineNumber: 772,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 770,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                            lineNumber: 769,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 6,
                                    className: "text-center py-8 text-slate-400 text-sm",
                                    children: "Sin campañas todavía"
                                }, void 0, false, {
                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                    lineNumber: 778,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                lineNumber: 778,
                                columnNumber: 17
                            }, this) : messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b hover:bg-slate-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 px-4 text-slate-500 whitespace-nowrap",
                                            children: new Date(m.created_at).toLocaleDateString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit"
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 781,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 px-4 max-w-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate",
                                                children: m.mensaje
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 785,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 784,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 px-4 text-center",
                                            children: m.destinatarios
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 787,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 px-4 text-center font-medium",
                                            style: {
                                                color: "#25d366"
                                            },
                                            children: m.enviados
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 788,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 px-4 text-center text-red-500",
                                            children: m.fallidos
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 789,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 px-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-xs px-2 py-1 rounded-full font-medium ${m.estado === "enviado" ? "bg-green-100 text-green-700" : m.estado === "enviando" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`,
                                                children: m.estado
                                            }, void 0, false, {
                                                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                                lineNumber: 791,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                            lineNumber: 790,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, m.id, true, {
                                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                                    lineNumber: 780,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                            lineNumber: 776,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                    lineNumber: 768,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
                lineNumber: 767,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/super-admin/whatsapp-tab.tsx",
        lineNumber: 323,
        columnNumber: 5
    }, this);
}
_s(WhatsappTab, "E9KKu/QKeCItp4Q50Byy6+IdSPY=");
_c = WhatsappTab;
var _c;
__turbopack_context__.k.register(_c, "WhatsappTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_super-admin_whatsapp-tab_tsx_aa54160e._.js.map