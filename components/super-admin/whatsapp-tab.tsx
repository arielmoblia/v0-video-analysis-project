"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface WaStatus {
  status: "connected" | "disconnected" | "qr" | "offline"
  phoneNumber: string | null
  qr: string | null
  qrImage: string | null
}

interface Contact {
  id: string
  nombre: string
  numero: string
  etiqueta: string
  activo: boolean
}

interface WaMessage {
  id: string
  tipo: string
  mensaje: string
  destinatarios: number
  enviados: number
  fallidos: number
  estado: string
  created_at: string
}

export function WhatsappTab() {
  const [tab, setTab] = useState("conexion")
  const [waStatus, setWaStatus] = useState<WaStatus>({ status: "disconnected", phoneNumber: null, qr: null })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [merchants, setMerchants] = useState<any[]>([])
  const [messages, setMessages] = useState<WaMessage[]>([])
  const [mensaje, setMensaje] = useState("")
  const [intervaloMin, setIntervaloMin] = useState(3)
  const [intervaloMax, setIntervaloMax] = useState(15)
  const [tandaMin, setTandaMin] = useState(8)
  const [tandaMax, setTandaMax] = useState(15)
  const [pausaMin, setPausaMin] = useState(90)
  const [pausaMax, setPausaMax] = useState(180)
  const [limiteDiario2, setLimiteDiario2] = useState(20)
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{sent:number,failed:number}|null>(null)
  const [segmento, setSegmento] = useState("merchants")
  const [fuenteTab, setFuenteTab] = useState("tolar")
  const [textoPegar, setTextoPegar] = useState("")
  const [csvContactos, setCsvContactos] = useState<{nombre:string,numero:string}[]>([])
  const [contactosManuales, setContactosManuales] = useState<{nombre:string,numero:string}[]>([])
  const [grupos, setGrupos] = useState<{id:string,nombre:string,participantes:number}[]>([])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string|null>(null)
  const [cargandoGrupos, setCargandoGrupos] = useState(false)
  const [limiteDiario, setLimiteDiario] = useState(50)
  const [grupoOffset, setGrupoOffset] = useState(0)
  const [grupoTotal, setGrupoTotal] = useState(0)
  const [grupoAdmins, setGrupoAdmins] = useState(0)
  const [campanas, setCampanas] = useState<any[]>([])
  const [mostrarOcultos, setMostrarOcultos] = useState(false)
  const [popupGrupo, setPopupGrupo] = useState<{id:string,nombre:string}|null>(null)
  const [popupTab, setPopupTab] = useState("pegar")
  const [popupTexto, setPopupTexto] = useState("")
  const [popupContactos, setPopupContactos] = useState<{nombre:string,numero:string}[]>([])
  const [gruposNumerosMap, setGruposNumerosMap] = useState<Record<string,number>>({})
  const [incluirAdmins, setIncluirAdmins] = useState(true)
  const [mediaFile, setMediaFile] = useState<File|null>(null)
  const [mediaPreview, setMediaPreview] = useState<string|null>(null)
  const [mediaType, setMediaType] = useState<"image"|"video"|null>(null)
  const mediaRef = useRef<HTMLInputElement>(null)
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevoNumero, setNuevoNumero] = useState("")
  const intervalRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(() => {
    cargarStatus()
    cargarMerchants()
    cargarMensajes()
    cargarCampanas()
    intervalRef.current = setInterval(cargarStatus, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const cargarStatus = async () => {
    try {
      const res = await fetch("/api/super-admin/whatsapp?accion=status")
      const data = await res.json()
      setWaStatus(data)
    } catch {}
  }

  const cargarMerchants = async () => {
    try {
      const res = await fetch("/api/super-admin/whatsapp?accion=merchants")
      const data = await res.json()
      setMerchants(data.merchants || [])
      const ids = new Set<string>((data.merchants || []).map((m: any) => m.id))
      setSeleccionados(ids)
    } catch {}
  }

  const cargarMensajes = async () => {
    try {
      const res = await fetch("/api/super-admin/whatsapp?accion=messages")
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {}
  }

  const enviarBroadcast = async () => {
    if (!mensaje.trim()) return
    const lista = getListaFinal()
    if (lista.length === 0) return
    setEnviando(true)
    setResultado(null)
    try {
      let imageUrl = null
      if (mediaFile && (mediaType === "image" || mediaType === "video")) {
        const formData = new FormData()
        formData.append("file", mediaFile)
        const uploadRes = await fetch("/api/super-admin/whatsapp-upload", { method: "POST", body: formData })
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      // Si es de grupos, guardar campaña en Supabase
      if (fuenteTab === "grupos" && grupoSeleccionado) {
        const grupo = grupos.find(g => g.id === grupoSeleccionado)
        await fetch("/api/super-admin/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        })
      }

      const res = await fetch("/api/super-admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "broadcast",
          datos: { numbers: lista, message: mensaje, imageUrl, intervalMin, intervalMax, tandaMin, tandaMax, pausaMin, pausaMax, limiteDiario: limiteDiario2 }
        })
      })
      const data = await res.json()
      setResultado({ sent: data.sent || 0, failed: data.failed || 0 })
      cargarMensajes()
      cargarCampanas()
    } catch {}
    setEnviando(false)
  }

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isVideo = file.type.startsWith("video/")
    const isImage = file.type.startsWith("image/")
    if (!isVideo && !isImage) return
    setMediaFile(file)
    setMediaType(isVideo ? "video" : "image")
    setMediaPreview(URL.createObjectURL(file))
  }

  useEffect(() => {
    if (grupoSeleccionado) importarGrupo(grupoSeleccionado, grupoOffset, incluirAdmins)
  }, [incluirAdmins])

  const parsearPopup = (texto: string) => {
    const lineas = texto.split(/[\n,;]+/).map(l => l.trim()).filter(l => l.length > 6)
    const contactos = lineas.map(l => {
      const partes = l.split(/[\t|]+/)
      const numero = partes[0]?.replace(/[^0-9]/g, '') || ""
      const nombre = partes[1]?.trim() || numero
      return { nombre, numero }
    }).filter(c => c.numero.length >= 7)
    setPopupContactos(contactos)
  }

  const handlePopupCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => parsearPopup(ev.target?.result as string)
    reader.readAsText(file)
  }

  const confirmarNumerosGrupo = () => {
    if (!popupGrupo || popupContactos.length === 0) return
    setContactosManuales(popupContactos)
    setGrupoSeleccionado(popupGrupo.id)
    setGrupoTotal(popupContactos.length)
    setGrupoAdmins(0)
    setGrupoOffset(0)
    setGruposNumerosMap(prev => ({...prev, [popupGrupo.id]: popupContactos.length}))
    setPopupGrupo(null)
    setPopupTexto("")
    setPopupContactos([])
  }

  const cargarCampanas = async () => {
    try {
      const res = await fetch("/api/super-admin/whatsapp?accion=campanas-activas")
      const data = await res.json()
      setCampanas(data.campanas || [])
    } catch {}
  }

  const ocultarGrupo = async (grupoId: string) => {
    await fetch("/api/super-admin/whatsapp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "ocultar-grupo", datos: { grupo_id: grupoId } })
    })
    setGrupos(prev => prev.map(g => g.id === grupoId ? {...g, oculto: true} : g))
  }

  const mostrarGrupo = async (grupoId: string) => {
    await fetch("/api/super-admin/whatsapp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "mostrar-grupo", datos: { grupo_id: grupoId } })
    })
    setGrupos(prev => prev.map(g => g.id === grupoId ? {...g, oculto: false} : g))
  }

  const pausarCampana = async (id: string) => {
    await fetch("/api/super-admin/whatsapp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "pausar-campana", datos: { id } })
    })
    setCampanas(prev => prev.map(c => c.id === id ? {...c, estado: "pausada"} : c))
  }

  const cancelarCampana = async (id: string) => {
    await fetch("/api/super-admin/whatsapp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "cancelar-campana", datos: { id } })
    })
    setCampanas(prev => prev.filter(c => c.id !== id))
  }

  const cargarGrupos = async () => {
    setCargandoGrupos(true)
    try {
      const res = await fetch("/api/super-admin/whatsapp?accion=grupos")
      const data = await res.json()
      setGrupos(data.grupos || [])
    } catch {}
    setCargandoGrupos(false)
  }

  const importarGrupo = async (groupId: string, offset = 0, forzarAdmins?: boolean) => {
    const admins = forzarAdmins !== undefined ? forzarAdmins : incluirAdmins
    try {
      const res = await fetch(`/api/super-admin/whatsapp?accion=grupo-miembros&id=${groupId}&limite=${limiteDiario}&offset=${offset}&incluir_admins=${admins}`)
      const data = await res.json()
      setContactosManuales(data.miembros || [])
      setGrupoSeleccionado(groupId)
      setGrupoTotal(data.total || 0)
      setGrupoAdmins(data.admins || 0)
      setGrupoOffset(offset)
    } catch {}
  }

  const parsearNumeros = (texto: string) => {
    const lineas = texto.split(/[\n,;]+/).map(l => l.trim()).filter(l => l.length > 6)
    const contactos = lineas.map(l => {
      const partes = l.split(/[\t|]+/)
      const numero = partes[0]?.replace(/[^0-9]/g, '') || ""
      const nombre = partes[1]?.trim() || numero
      return { nombre, numero }
    }).filter(c => c.numero.length >= 7)
    setCsvContactos(contactos)
    setContactosManuales(contactos)
  }

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const texto = ev.target?.result as string
      parsearNumeros(texto)
    }
    reader.readAsText(file)
  }

  const getListaFinal = () => {
    if (fuenteTab === "tolar") {
      return merchants.filter(m => seleccionados.has(m.id)).map(m => m.social_whatsapp)
    }
    return contactosManuales.map(c => c.numero)
  }

  const toggleSeleccionado = (id: string) => {
    setSeleccionados(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const toggleTodos = () => {
    const lista = segmento === "merchants" ? merchants.map(m => m.id) : contacts.map(c => c.id)
    if (seleccionados.size === lista.length) setSeleccionados(new Set())
    else setSeleccionados(new Set(lista))
  }

  const statusColor = waStatus.status === "connected" ? "#25d366" : waStatus.status === "qr" ? "#f59e0b" : "#e24b4a"
  const statusText = waStatus.status === "connected" ? "Conectado" : waStatus.status === "qr" ? "Esperando QR" : waStatus.status === "offline" ? "Servicio offline" : "Desconectado"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">WhatsApp tol.ar</h2>
          <p className="text-slate-500">Mensajes masivos y bandeja de entrada</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{borderColor: statusColor + "40", background: statusColor + "10"}}>
          <div className="w-2 h-2 rounded-full" style={{background: statusColor}}></div>
          <span className="text-sm font-medium" style={{color: statusColor}}>{statusText}</span>
          {waStatus.phoneNumber && <span className="text-xs text-slate-500">{waStatus.phoneNumber}</span>}
        </div>
      </div>

      <div className="flex border-b" style={{borderBottom:"2px solid #075e54"}}>
        {[["conexion","Conexión"],["envio","Envío masivo"],["historial","Historial"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-5 py-3 text-sm font-medium transition-colors"
            style={{
              borderBottom: tab === id ? "3px solid #25d366" : "3px solid transparent",
              color: tab === id ? "#075e54" : "#6b7280",
              marginBottom: "-2px"
            }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "conexion" && (
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{borderColor:"#25d36640",background:"#f0fdf4"}}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{background:"#075e54"}}>WA</div>
              <div className="flex-1">
                <p className="font-medium text-lg">{waStatus.phoneNumber || "Sin número conectado"}</p>
                <p className="text-sm text-slate-500">{statusText} · tol.ar WhatsApp</p>
              </div>
              {waStatus.status !== "connected" && (
                <Button onClick={cargarStatus} variant="outline" size="sm">Reconectar</Button>
              )}
            </div>
    {waStatus.qrImage && (
              <div className="mt-4 p-4 bg-white rounded-lg border text-center">
                <p className="text-sm font-medium text-slate-700 mb-3">Escaneá este QR con WhatsApp</p>
                <img src={waStatus.qrImage} alt="QR WhatsApp" className="mx-auto" style={{width:200,height:200}} />
                <p className="text-xs text-slate-400 mt-2">WhatsApp → Dispositivos vinculados → Vincular dispositivo</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Estado del servicio</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold">{merchants.length}</p>
                <p className="text-xs text-slate-500 mt-1">Merchants con WA</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold">{messages.length}</p>
                <p className="text-xs text-slate-500 mt-1">Campañas enviadas</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold" style={{color:"#25d366"}}>
                  {messages.reduce((a,m) => a + (m.enviados||0), 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Mensajes enviados</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "envio" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium mb-3">Mensaje</p>
              <textarea
                className="w-full text-sm px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={5}
                placeholder="Hola {nombre}! 👋 Te cuento que en tol.ar podés tener tu tienda online gratis..."
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
              />
              <div className="flex gap-2 mt-2 flex-wrap items-center">
                {["{nombre}","{tienda}","{link}"].map(v => (
                  <button key={v} onClick={() => setMensaje(m => m + v)}
                    className="text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {v}
                  </button>
                ))}
                <input ref={mediaRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMedia}/>
                <button onClick={() => mediaRef.current?.click()}
                  className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                  📷 Imagen
                </button>
                <button onClick={() => mediaRef.current?.click()}
                  className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                  🎥 Video
                </button>
                {mediaFile && (
                  <button onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null) }}
                    className="text-xs px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                    ✕ Sacar
                  </button>
                )}
              </div>
              {mediaPreview && (
                <div className="mt-2 rounded-lg overflow-hidden border" style={{maxWidth:200}}>
                  {mediaType === "image"
                    ? <img src={mediaPreview} alt="preview" className="w-full"/>
                    : <video src={mediaPreview} className="w-full" controls muted style={{maxHeight:120}}/>
                  }
                  <p className="text-xs text-slate-500 p-1 truncate">{mediaFile?.name}</p>
                </div>
              )}
            </div>
            <div className="rounded-xl border p-4 space-y-4">
              <p className="text-sm font-medium">Configuración</p>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{background:"var(--color-background-secondary)"}}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{background: waStatus.status === "connected" ? "#25d366" : "#e24b4a"}}></div>
                  <div>
                    <p className="text-xs font-medium">{waStatus.phoneNumber || "Sin número"}</p>
                    <p className="text-xs" style={{color: waStatus.status === "connected" ? "#0F6E56" : "#A32D2D"}}>{waStatus.status === "connected" ? "Conectado" : "Desconectado"}</p>
                  </div>
                </div>
                <button onClick={() => setTab("conexion")} className="text-xs px-3 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">Cambiar número</button>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Intervalo entre mensajes</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-slate-400 block mb-1">Mínimo (seg)</label>
                    <input type="number" min={1} max={60} value={intervaloMin} onChange={e => setIntervaloMin(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border bg-background"/></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Máximo (seg)</label>
                    <input type="number" min={1} max={60} value={intervaloMax} onChange={e => setIntervaloMax(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border bg-background"/></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Tamaño de tanda</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-slate-400 block mb-1">Mínimo (msgs)</label>
                    <input type="number" min={1} max={50} value={tandaMin} onChange={e => setTandaMin(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border bg-background"/></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Máximo (msgs)</label>
                    <input type="number" min={1} max={50} value={tandaMax} onChange={e => setTandaMax(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border bg-background"/></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Pausa entre tandas</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-slate-400 block mb-1">Mínimo (min)</label>
                    <input type="number" min={1} max={1440} value={pausaMin} onChange={e => setPausaMin(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border bg-background"/></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Máximo (min)</label>
                    <input type="number" min={1} max={1440} value={pausaMax} onChange={e => setPausaMax(Number(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border bg-background"/></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Límite diario total</p>
                <select className="w-full text-xs px-2 py-1.5 rounded border bg-background"
                  value={limiteDiario2} onChange={e => setLimiteDiario2(Number(e.target.value))}>
                  <option value={10}>10 / día (muy seguro)</option>
                  <option value={20}>20 / día (seguro)</option>
                  <option value={30}>30 / día (moderado)</option>
                </select>
                <div className="mt-2 flex items-center gap-2 p-2 rounded-lg text-xs font-medium"
                  style={{background: limiteDiario2 <= 20 ? "#E1F5EE" : limiteDiario2 <= 35 ? "#FAEEDA" : "#FCEBEB",
                          color: limiteDiario2 <= 20 ? "#085041" : limiteDiario2 <= 35 ? "#633806" : "#791F1F"}}>
                  <span>{limiteDiario2 <= 20 ? "🟢" : limiteDiario2 <= 35 ? "🟡" : "🔴"}</span>
                  <span>{limiteDiario2 <= 20 ? "Riesgo bajo — seguro" : limiteDiario2 <= 35 ? "Precaución — usá con cuidado" : "Riesgo de baneo"}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">Cada mensaje espera un tiempo aleatorio entre min y max — nunca la misma secuencia.</p>
            </div>
            {resultado && (
              <div className="rounded-xl border p-4" style={{background:"#f0fdf4",borderColor:"#25d36640"}}>
                <p className="text-sm font-medium" style={{color:"#075e54"}}>Envío completado</p>
                <p className="text-sm text-slate-600 mt-1">✓ {resultado.sent} enviados · ✗ {resultado.failed} fallidos</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium mb-3">Destinatarios</p>
            <div className="flex gap-1 mb-4 border-b">
              {[["tolar","tol.ar"],["pegar","Copiar/Pegar"],["csv","CSV"],["grupos","Grupos"]].map(([id,label]) => (
                <button key={id} onClick={() => { setFuenteTab(id); setContactosManuales([]) }}
                  className="text-xs px-4 py-2 font-medium transition-colors"
                  style={{
                    borderBottom: fuenteTab === id ? "2px solid #25d366" : "2px solid transparent",
                    color: fuenteTab === id ? "#075e54" : "#6b7280",
                    marginBottom: "-1px"
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {fuenteTab === "tolar" && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500">Merchants con WhatsApp</span>
                  <button onClick={toggleTodos} className="text-xs text-slate-500 hover:text-slate-700 underline">
                    {seleccionados.size === merchants.length ? "Deseleccionar todos" : "Seleccionar todos"}
                  </button>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {merchants.map(m => (
                    <div key={m.id} onClick={() => toggleSeleccionado(m.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${seleccionados.has(m.id) ? "bg-green-50" : "hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={seleccionados.has(m.id)} onChange={() => {}} className="pointer-events-none"/>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-slate-200 text-slate-600 flex-shrink-0">
                        {m.site_title?.slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{m.site_title}</p>
                        <p className="text-xs text-slate-400">{m.social_whatsapp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {fuenteTab === "pegar" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Pegá números separados por enter, coma o punto y coma. Podés agregar nombre con tab: <code>nombre&lt;tab&gt;número</code></p>
                <textarea
                  className="w-full text-xs px-3 py-2 rounded-lg border bg-background focus:outline-none resize-none font-mono"
                  rows={6}
                  placeholder="Un número por línea: 541112345678"
                  value={textoPegar}
                  onChange={e => { setTextoPegar(e.target.value); parsearNumeros(e.target.value) }}
                />
                {contactosManuales.length > 0 && (
                  <p className="text-xs text-green-600 font-medium">{contactosManuales.length} números detectados</p>
                )}
              </div>
            )}

            {fuenteTab === "csv" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Subí un archivo CSV o TXT con números. Primera columna: número. Segunda columna (opcional): nombre.</p>
                <label className="block border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50">
                  <p className="text-sm text-slate-500">Clickeá para subir CSV o TXT</p>
                  <p className="text-xs text-slate-400 mt-1">541112345678, Juan</p>
                  <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV}/>
                </label>
                {contactosManuales.length > 0 && (
                  <div>
                    <p className="text-xs text-green-600 font-medium mb-2">{contactosManuales.length} contactos importados</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {contactosManuales.slice(0,5).map((c,i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600 p-1">
                          <span className="font-medium">{c.nombre}</span>
                          <span className="text-slate-400">{c.numero}</span>
                        </div>
                      ))}
                      {contactosManuales.length > 5 && <p className="text-xs text-slate-400">... y {contactosManuales.length - 5} más</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {fuenteTab === "grupos" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Límite diario:</span>
                    <select className="text-xs border rounded px-2 py-1 bg-background"
                      value={limiteDiario} onChange={e => setLimiteDiario(Number(e.target.value))}>
                      <option value={25}>25/día (muy seguro)</option>
                      <option value={50}>50/día (seguro)</option>
                      <option value={100}>100/día (moderado)</option>
                    </select>
                  </div>
                  <button onClick={cargarGrupos} disabled={cargandoGrupos}
                    className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50">
                    {cargandoGrupos ? "Cargando..." : "Ver mis grupos"}
                  </button>
                </div>
                {grupos.length === 0 && !cargandoGrupos && (
                  <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-lg">
                    Apretá "Ver mis grupos" para cargar la lista
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Admins:</span>
                    <select className="text-xs border rounded px-2 py-1 bg-background"
                      value={incluirAdmins ? "incluir" : "excluir"}
                      onChange={e => setIncluirAdmins(e.target.value === "incluir")}>
                      <option value="incluir">Incluir</option>
                      <option value="excluir">Excluir</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{grupos.filter(g => !g.oculto).length} grupos visibles</span>
                  <button onClick={() => setMostrarOcultos(p => !p)} className="text-xs text-slate-400 hover:text-slate-600 underline">
                    {mostrarOcultos ? "Ocultar archivados" : "Ver archivados"}
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {grupos.filter(g => mostrarOcultos ? g.oculto : !g.oculto).map(g => (
                    <div key={g.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${grupoSeleccionado === g.id ? "bg-green-50 border-green-200" : "border-transparent hover:bg-slate-50"}`}>
                      <div onClick={() => !g.oculto && importarGrupo(g.id)}
                        className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                          style={{background: g.oculto ? "#888" : "#075e54",color:"white"}}>G</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${g.oculto ? "text-slate-400" : ""}`}>{g.nombre}</p>
                          <p className="text-xs text-slate-400">{g.participantes} participantes</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setPopupGrupo({id:g.id,nombre:g.nombre}); setPopupTab("pegar"); setPopupTexto(""); setPopupContactos([]) }}
                        className="text-xs px-2 py-1 rounded shrink-0 font-medium"
                        style={{background:"#e6f1fb",color:"#185fa5"}}>
                        📋 {gruposNumerosMap[g.id] ? gruposNumerosMap[g.id]+"n" : "Números"}
                      </button>
                      {grupoSeleccionado === g.id && <span className="text-xs text-green-600 font-medium shrink-0">✓</span>}
                      {!g.oculto
                        ? <button onClick={(e) => { e.stopPropagation(); ocultarGrupo(g.id) }}
                            className="text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors"
                            style={{background:"#fee2e2",color:"#dc2626"}}
                            title="Archivar">✕</button>
                        : <button onClick={(e) => { e.stopPropagation(); mostrarGrupo(g.id) }}
                            className="text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors"
                            style={{background:"#dcfce7",color:"#16a34a"}}
                            title="Restaurar">↩</button>
                      }
                    </div>
                  ))}
                </div>
                {popupGrupo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.5)"}}>
                <div className="bg-white rounded-xl border shadow-lg p-5 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{popupGrupo.nombre}</p>
                      <p className="text-xs text-slate-500">Cargá los números de este grupo</p>
                    </div>
                    <button onClick={() => setPopupGrupo(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
                  </div>
                  <div className="flex gap-1 border-b mb-4">
                    {[["pegar","Copiar/Pegar"],["csv","CSV"]].map(([id,label]) => (
                      <button key={id} onClick={() => setPopupTab(id)}
                        className="text-xs px-4 py-2 font-medium"
                        style={{borderBottom: popupTab===id ? "2px solid #25d366" : "2px solid transparent", color: popupTab===id ? "#075e54" : "#6b7280", marginBottom:"-1px"}}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {popupTab === "pegar" && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500">Un número por línea</p>
                      <textarea className="w-full text-xs px-3 py-2 rounded-lg border bg-background resize-none font-mono focus:outline-none"
                        rows={6} placeholder="541112345678" value={popupTexto}
                        onChange={e => { setPopupTexto(e.target.value); parsearPopup(e.target.value) }}/>
                    </div>
                  )}
                  {popupTab === "csv" && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500">CSV o TXT con números</p>
                      <label className="block border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50">
                        <p className="text-sm text-slate-500">Clickeá para subir</p>
                        <input type="file" accept=".csv,.txt" className="hidden" onChange={handlePopupCSV}/>
                      </label>
                    </div>
                  )}
                  {popupContactos.length > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-2">{popupContactos.length} números detectados</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setPopupGrupo(null)} className="flex-1 text-sm py-2 rounded-lg border border-slate-200 text-slate-600">Cancelar</button>
                    <button onClick={confirmarNumerosGrupo} disabled={popupContactos.length === 0}
                      className="flex-1 text-sm py-2 rounded-lg text-white font-medium"
                      style={{background: popupContactos.length > 0 ? "#25d366" : "#d1d5db"}}>
                      Usar {popupContactos.length} números
                    </button>
                  </div>
                </div>
              </div>
            )}

            {grupoTotal > 0 && grupoSeleccionado && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-green-600 font-medium">
                        {contactosManuales.length} miembros listos{incluirAdmins ? "" : ` · ${grupoAdmins} admins excluidos`} · {grupoTotal} total
                      </p>
                    </div>
                    {grupoTotal > limiteDiario && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-700 font-medium">
                          Enviando {grupoOffset + 1}–{Math.min(grupoOffset + limiteDiario, grupoTotal)} de {grupoTotal} miembros
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          Días restantes: {Math.ceil((grupoTotal - grupoOffset) / limiteDiario)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {grupoOffset > 0 && (
                            <button onClick={() => importarGrupo(grupoSeleccionado!, grupoOffset - limiteDiario)}
                              className="text-xs px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-100">
                              ← Tanda anterior
                            </button>
                          )}
                          {grupoOffset + limiteDiario < grupoTotal && (
                            <button onClick={() => importarGrupo(grupoSeleccionado!, grupoOffset + limiteDiario)}
                              className="text-xs px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-100">
                              Próxima tanda →
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-3 border-t">
              <Button onClick={enviarBroadcast} disabled={enviando || !mensaje.trim() || (fuenteTab === "tolar" ? seleccionados.size === 0 : contactosManuales.length === 0)}
                className="w-full" style={{background:"#25d366",border:"none"}}>
                {enviando ? "Enviando..." : `Enviar a ${fuenteTab === "tolar" ? seleccionados.size : contactosManuales.length} contactos`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === "historial" && (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead style={{background:"#075e54"}}>
              <tr>
                {["Fecha","Mensaje","Destinatarios","Enviados","Fallidos","Estado"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">Sin campañas todavía</td></tr>
              ) : messages.map(m => (
                <tr key={m.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"2-digit"})}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate">{m.mensaje}</p>
                  </td>
                  <td className="py-3 px-4 text-center">{m.destinatarios}</td>
                  <td className="py-3 px-4 text-center font-medium" style={{color:"#25d366"}}>{m.enviados}</td>
                  <td className="py-3 px-4 text-center text-red-500">{m.fallidos}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      m.estado === "enviado" ? "bg-green-100 text-green-700" :
                      m.estado === "enviando" ? "bg-yellow-100 text-yellow-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>{m.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
