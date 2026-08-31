"use client"
import { useState, useRef, useEffect, useCallback } from "react"

interface Mensaje {
  role: "claudio" | "ariel"
  texto: string
  hora: string
  imagen?: string
}

interface ClaudioPopupProps {
  contexto?: string
  titulo?: string
}

export function ClaudioPopup({ contexto = "Sos Claudio, el asistente operativo de tol.ar. Tenés acceso a datos reales de Supabase. NUNCA ejecutes nada sin aprobación escrita de Ariel.", titulo = "Claudio" }: ClaudioPopupProps) {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [input, setInput] = useState("")
  const [cargando, setCargando] = useState(false)
  const [escuchando, setEscuchando] = useState(false)
  const [archivoAdj, setArchivoAdj] = useState<{ nombre: string; size: string; tipo: string; base64?: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [arrastrando, setArrastrando] = useState(false)
  const arrastandoRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })
  const popupRef = useRef<HTMLDivElement>(null)
  const mensajesRef = useRef<HTMLDivElement>(null)
  const reconocimientoRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iniciado = useRef(false)

  const hora = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

  useEffect(() => {
    if (abierto && !iniciado.current) {
      iniciado.current = true
      setMensajes([{
        role: "claudio",
        texto: "Hola Ariel. Estoy listo. Apretá el micrófono para hablar, o escribime. ¿En qué arrancamos?",
        hora: hora()
      }])
    }
  }, [abierto])

  useEffect(() => {
    if (mensajesRef.current) mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight
  }, [mensajes, cargando])

  const iniciarVoz = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = "es-AR"
    r.continuous = true
    r.interimResults = false
    r.onstart = () => setEscuchando(true)
    r.onend = () => { setEscuchando(false) }
    r.onerror = () => setEscuchando(false)
    r.onresult = (e: any) => {
      const txt = e.results[e.results.length - 1][0].transcript.trim()
      if (txt) enviar(txt)
    }
    reconocimientoRef.current = r
    try { r.start() } catch(e) {}
  }, [abierto])

  const toggleVoz = () => {
    if (!reconocimientoRef.current) { iniciarVoz(); return }
    if (escuchando) { reconocimientoRef.current.stop(); setEscuchando(false) }
    else { try { reconocimientoRef.current.start() } catch(e) {} }
  }

  const hablar = (texto: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(texto.replace(/[*_`#]/g, "").substring(0, 300))
    u.lang = "es-AR"
    u.rate = 1.05
    window.speechSynthesis.speak(u)
  }

  const limpiarParaVoz = (texto: string): string => {
    let t = texto
    t = t.replace(/\|[^|\n]*/g, '')
    t = t.replace(/[-]{2,}/g, '.')
    t = t.replace(/[*_`#|]/g, '')
    t = t.replace(/\[.*?\]/g, '')
    t = t.replace(/https?:\/\/\S+/g, '')
    t = t.replace(/[\uD800-\uDFFF].|[\u2600-\u27FF]/g, '')
    t = t.replace(/\s+/g, ' ').trim()
    return t
  }

  const hablarMejor = (texto: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const limpio = limpiarParaVoz(texto)
    if (!limpio) return
    const oraciones = limpio.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [limpio]
    const grupos: string[] = []
    let grupo = ''
    for (const o of oraciones) {
      if ((grupo + o).length < 200) { grupo += o }
      else { if (grupo) grupos.push(grupo.trim()); grupo = o }
    }
    if (grupo) grupos.push(grupo.trim())
    let idx = 0
    const leerSiguiente = (i: number) => {
      if (i >= grupos.length) return
      const u = new SpeechSynthesisUtterance(grupos[i])
      u.lang = 'es-AR'
      u.rate = 1.0
      u.onend = () => setTimeout(() => leerSiguiente(i + 1), 80)
      window.speechSynthesis.speak(u)
    }
    leerSiguiente(0)
  }

  const enviar = async (texto?: string) => {
    const msg = texto || input.trim()
    if (!msg && !archivoAdj) return
    setInput("")
    const msgAriel: Mensaje = { role: "ariel", texto: msg || "📎 archivo adjunto", hora: hora(), imagen: archivoAdj?.base64 }
    setMensajes(prev => [...prev, msgAriel])
    const adjActual = archivoAdj
    setArchivoAdj(null)
    setCargando(true)

    const contextoCompleto = contexto + "\n\nHistorial previo resumido: el usuario acaba de abrir el panel."

    try {
      let respFinal = ""

      if (adjActual?.base64) {
        setMensajes(prev => [...prev.filter(m => !m.imagen), { role: "claudio", texto: "Analizando la imagen...", hora: hora() }])
        const res = await fetch("/api/agente/imagen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mensaje: msg || "Analizá esta imagen.",
            imagen: adjActual.base64,
            imagenTipo: adjActual.tipo
          })
        })
        const data = await res.json()
        respFinal = data.texto || data.error || "No pude analizar la imagen."
        setMensajes(prev => prev.filter(m => m.texto !== "Analizando la imagen..."))
      } else {
        const res = await fetch("/api/agente/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mensaje: contextoCompleto + "\n\nAriel dice: " + msg
          })
        })
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "))
          for (const line of lines) {
            try {
              const data = JSON.parse(line.replace("data: ", ""))
              if (data.tipo === "final" && data.texto) respFinal = data.texto
            } catch(e) {}
          }
        }
      }

      if (respFinal) {
        setMensajes(prev => [...prev, { role: "claudio", texto: respFinal, hora: hora() }])
        hablarMejor(respFinal)
      }
    } catch(e: any) {
      setMensajes(prev => [...prev, { role: "claudio", texto: "Error de conexión con el agente.", hora: hora() }])
    }
    setCargando(false)
  }

  const procesarArchivo = (file: File) => {
    const esImagen = file.type.startsWith("image/")
    if (file.type.startsWith("video/")) {
      setMensajes(prev => [...prev, { role: "claudio", texto: "Los videos no se pueden analizar. Sacale una captura y mandamela como imagen.", hora: hora() }])
      return
    }
    if (esImagen) {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX = 400
        let w = img.width, h = img.height
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX }
          else { w = Math.round(w * MAX / h); h = MAX }
        }
        canvas.width = w; canvas.height = h
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h)
        const base64 = canvas.toDataURL("image/jpeg", 0.4).split(",")[1]
        URL.revokeObjectURL(url)
        setArchivoAdj({ nombre: file.name, size: (base64.length / 1024).toFixed(0) + " KB", tipo: "image/jpeg", base64 })
      }
      img.src = url
    } else {
      setArchivoAdj({ nombre: file.name, size: (file.size / 1024).toFixed(0) + " KB", tipo: file.type, base64: undefined })
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) procesarArchivo(f)
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (!popupRef.current) return
    arrastandoRef.current = true
    setArrastrando(true)
    const rect = popupRef.current.getBoundingClientRect()
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!arrastandoRef.current) return
      setPos({ x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y })
    }
    const onUp = () => { arrastandoRef.current = false; setArrastrando(false) }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
  }, [])

  const cerrar = () => {
    setAbierto(false)
    iniciado.current = false
    if (reconocimientoRef.current) { try { reconocimientoRef.current.stop() } catch(e) {} }
    window.speechSynthesis?.cancel()
    setMensajes([])
    setEscuchando(false)
  }

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-sm"
      >
        💬 Hablar con Claudio
      </button>

      {abierto && (
        <div
          ref={popupRef}
          style={{
            position: "fixed",
            left: pos.x || "calc(100vw - 380px)",
            top: pos.y || "80px",
            width: 340,
            zIndex: 9999,
            cursor: arrastrando ? "grabbing" : "default"
          }}
          className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white flex flex-col"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-3 cursor-grab select-none"
            style={{ background: "#0f172a" }}
            onMouseDown={onMouseDown}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: escuchando ? "pulse 1.5s infinite" : "none" }} />
              <div>
                <div className="text-sm font-medium text-slate-100">{titulo}</div>
                <div className="text-xs text-slate-400">{escuchando ? "Escuchando..." : cargando ? "Pensando..." : "En pausa"}</div>
              </div>
            </div>
            <button onClick={cerrar} className="text-slate-400 hover:text-slate-200 text-lg leading-none bg-transparent border-none cursor-pointer">✕</button>
          </div>

          {/* Barra de escucha */}
          {escuchando && (
            <div className="flex items-center gap-2 px-3 py-1 text-xs" style={{ background: "#fef3c7", color: "#92400e" }}>
              <div className="flex items-center gap-0.5">
                {[6,12,8,14,6].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: "#f59e0b", borderRadius: 2, animation: `wave 0.8s ${i*0.1}s infinite` }} />
                ))}
              </div>
              <span>Escuchando...</span>
            </div>
          )}

          {/* Mensajes */}
          <div ref={mensajesRef} className="flex flex-col gap-2 p-3 overflow-y-auto" style={{ height: 220, background: "white" }}>
            {mensajes.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === "ariel" ? "items-end" : "items-start"}`}>
                {m.imagen && (
                  <img src={`data:image/jpeg;base64,${m.imagen}`} alt="" className="rounded-lg mb-1" style={{ maxWidth: 160, maxHeight: 120, objectFit: "cover" }} />
                )}
                <div
                  className="px-3 py-2 rounded-xl text-sm leading-relaxed"
                  style={{
                    maxWidth: "85%",
                    background: m.role === "ariel" ? "#0f172a" : "#f1f5f9",
                    color: m.role === "ariel" ? "#f1f5f9" : "#0f172a",
                    borderBottomRightRadius: m.role === "ariel" ? 3 : 12,
                    borderBottomLeftRadius: m.role === "claudio" ? 3 : 12,
                  }}
                >
                  {m.texto}
                </div>
                <div className="text-xs mt-0.5 px-1" style={{ color: "#94a3b8" }}>{m.hora}</div>
              </div>
            ))}
            {cargando && (
              <div className="flex items-start">
                <div className="px-3 py-2 rounded-xl flex gap-1 items-center" style={{ background: "#f1f5f9", borderBottomLeftRadius: 3 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8", animation: `bounce 1.2s ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t px-3 py-2 flex items-center gap-2" style={{ borderColor: "#e2e8f0" }}>
            <button
              onClick={toggleVoz}
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: 36, height: 36, border: "none", cursor: "pointer",
                background: escuchando ? "#ef4444" : "#e2e8f0",
                animation: escuchando ? "micPulse 1.5s infinite" : "none"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={escuchando ? "white" : "#64748b"} strokeWidth="2">
                <rect x="9" y="2" width="6" height="13" rx="3"/>
                <path d="M5 10a7 7 0 0014 0"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
            </button>
            <input
              className="flex-1 text-sm rounded-full px-3 py-1.5 outline-none"
              style={{ border: "0.5px solid #e2e8f0", background: "#f8fafc", color: "#0f172a" }}
              placeholder="o escribí algo..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && enviar()}
            />
            <button
              onClick={() => enviar()}
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 32, height: 32, background: "#0f172a", border: "none", cursor: "pointer" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Archivo adjunto preview */}
          {archivoAdj && (
            <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#f1f5f9", border: "0.5px solid #e2e8f0" }}>
              <span style={{ fontSize: 18 }}>{archivoAdj.tipo.startsWith("video") ? "🎬" : archivoAdj.tipo === "application/pdf" ? "📄" : "🖼"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: "#0f172a" }}>{archivoAdj.nombre}</div>
                <div className="text-xs" style={{ color: "#64748b" }}>{archivoAdj.size}</div>
              </div>
              <button onClick={() => setArchivoAdj(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14 }}>✕</button>
            </div>
          )}

          {/* Drop zone */}
          <div
            className="mx-3 mb-3 flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer"
            style={{
              border: `1.5px dashed ${dragOver ? "#3b82f6" : "#cbd5e1"}`,
              background: dragOver ? "#eff6ff" : "#f8fafc",
              transition: "all 0.2s"
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <span style={{ fontSize: 16 }}>📎</span>
            <div>
              <div className="text-xs" style={{ color: "#475569" }}><strong>Arrastrá</strong> o clickeá para adjuntar</div>
              <div className="text-xs" style={{ color: "#94a3b8" }}>Imágenes · Videos · PDF</div>
            </div>
          </div>
          <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*,video/*,.pdf" onChange={e => e.target.files?.[0] && procesarArchivo(e.target.files[0])} />
        </div>
      )}

      <style>{`
        @keyframes wave { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(1)} }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }
      `}</style>
    </>
  )
}
