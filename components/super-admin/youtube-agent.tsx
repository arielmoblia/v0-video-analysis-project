"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw } from "lucide-react"

interface Escena { tiempo: string; texto: string }
interface Config {
  id?: string
  perfil: string
  edad_min: number
  edad_max: number
  vienen_de: string
  competidor: string
  dolor: string
  cta: string
  tono: string
  keyword: string
  hashtags: string
  categoria: string
  idioma: string
  miniatura: string
  horario_publicacion: string
  ads_activo: boolean
  ads_presupuesto: string
  ads_edad_min: string
  ads_edad_max: string
  ads_pais: string
  ads_genero: string
  ads_dispositivo: string
  ads_intereses: string
  ads_excluir: string
  ads_duracion: string
}

const CONFIG_DEFAULT: Config = {
  perfil: "Dueños de negocio, emprendedores",
  edad_min: 25, edad_max: 60,
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
  ads_edad_min: "25", ads_edad_max: "60",
  ads_pais: "Argentina",
  ads_genero: "Todos",
  ads_dispositivo: "Todos",
  ads_intereses: "",
  ads_excluir: "Ya visitaron tol.ar",
  ads_duracion: "7 días"
}

interface Guion {
  id: string
  guion_titulo: string
  guion_escenas: Escena[]
  guion_hashtags: string
  target_audiencia: string
  target_ubicacion: string
  target_perfil: string
  target_objetivo: string
  notas: string
  estado: string
}

const TARGET_DEFAULT = {
  audiencia: "Vendedores online, 25-45 años",
  ubicacion: "Argentina",
  perfil: "Comerciantes que pagan comisión en Tiendanube o Mercado Shops",
  objetivo: "Que abran una tienda gratis en tol.ar"
}

export function YoutubeAgent() {
  const [guiones, setGuiones] = useState<Guion[]>([])
  const [cargando, setCargando] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [config, setConfig] = useState<Config>(CONFIG_DEFAULT)
  const [guardandoConfig, setGuardandoConfig] = useState(false)
  const [youtubeConnected, setYoutubeConnected] = useState(false)
  const [guionesExtra, setGuionesExtra] = useState<any[]>([])
  const [notas, setNotas] = useState(["", ""])
  const [error, setError] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [generadores, setGeneradores] = useState<{id:string,nombre:string,api_key:string,endpoint:string}[]>([])
  const [genActivo, setGenActivo] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [nuevoGen, setNuevoGen] = useState({nombre:"",api_key:"",endpoint:""})
  const [vista, setVista] = useState<"crear"|"historial">("crear")

  useEffect(() => { cargar(); cargarGeneradores(); cargarConfig() }, [])

  const cargarConfig = async () => {
    try {
      const res = await fetch("/api/super-admin/marketing-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "cargar-config", datos: {} })
      })
      const data = await res.json()
      if (data.config) {
        setYoutubeConnected(data.config.youtube_connected || false)
        const clean: any = {}
        Object.keys(data.config).forEach(k => {
          clean[k] = data.config[k] === null ? (CONFIG_DEFAULT as any)[k] ?? "" : data.config[k]
        })
        setConfig({ ...CONFIG_DEFAULT, ...clean })
      }
    } catch {}
  }

  const guardarConfig = async () => {
    setGuardandoConfig(true)
    try {
      await fetch("/api/super-admin/marketing-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "guardar-config", datos: config })
      })
    } catch {}
    setGuardandoConfig(false)
  }

  const cargarGeneradores = async () => {
    try {
      const res = await fetch("/api/super-admin/marketing-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "listar-generadores", datos: {} })
      })
      const data = await res.json()
      if (data.generadores?.length) {
        setGeneradores(data.generadores)
        setGenActivo(data.generadores[0].nombre)
      }
    } catch {}
  }

  const guardarNuevoGen = async () => {
    if (!nuevoGen.nombre) return
    try {
      const res = await fetch("/api/super-admin/marketing-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "agregar-generador", datos: nuevoGen })
      })
      const data = await res.json()
      if (data.generador) {
        setGeneradores(prev => [...prev, data.generador])
        setGenActivo(data.generador.nombre)
        setNuevoGen({nombre:"",api_key:"",endpoint:""})
        setShowPopup(false)
      }
    } catch {}
  }

  const guardarApi = async () => {
    if (!apiKey && !apiSecret) return
    await fetch("/api/super-admin/marketing-youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "guardar-api", datos: { youtube_api_key: apiKey, youtube_api_secret: apiSecret } })
    })
  }

  const cargar = async () => {
    setCargando(true)
    try {
      const res = await fetch("/api/super-admin/marketing-youtube")
      const data = await res.json()
      if (data.guiones?.length) {
        setGuiones(data.guiones)
        const g = data.guiones[0]
        setTarget({
          audiencia: g.target_audiencia || TARGET_DEFAULT.audiencia,
          ubicacion: g.target_ubicacion || TARGET_DEFAULT.ubicacion,
          perfil: g.target_perfil || TARGET_DEFAULT.perfil,
          objetivo: g.target_objetivo || TARGET_DEFAULT.objetivo
        })
        setNotas(data.guiones.map((g: Guion) => g.notas || ""))
      }
    } catch {}
    setCargando(false)
  }

  const generar = async () => {
    setGenerando(true)
    setError("")
    try {
      const res = await fetch("/api/super-admin/marketing-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setGuiones(data.guiones || [])
      setNotas(data.guiones.map(() => ""))
    } catch { setError("Error de conexion") }
    setGenerando(false)
  }

  const guardarCampo = async (id: string, campo: string, valor: string) => {
    await fetch("/api/super-admin/marketing-youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "actualizar", datos: { id, [campo]: valor } })
    })
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border px-4 py-3 flex items-center gap-3 flex-wrap" style={{background:"#fff7ed",borderColor:"#fed7aa"}}>
        <Sparkles className="w-4 h-4" style={{color:"#ea580c"}} />
        <span className="text-xs font-medium" style={{color:"#ea580c"}}>YouTube API</span>
        <input
          className="text-xs px-2 py-1.5 rounded border bg-white focus:outline-none"
          style={{borderColor:"#fed7aa",minWidth:"220px",flex:1}}
          placeholder="API Key — youtube.googleapis.com"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          onBlur={() => guardarApi()}
        />
        <span className="text-xs font-medium" style={{color:"#ea580c"}}>CLAVE</span>
        <input
          className="text-xs px-2 py-1.5 rounded border bg-white focus:outline-none"
          style={{borderColor:"#fed7aa",minWidth:"180px",flex:1}}
          placeholder="OAuth Client Secret"
          value={apiSecret}
          onChange={e => setApiSecret(e.target.value)}
          onBlur={() => guardarApi()}
          type="password"
        />
        <span className="text-xs italic" style={{color:"#f97316"}}>Se completa una vez — queda fija</span>
        <a href="/api/auth/youtube"
          className="text-xs px-3 py-1.5 rounded font-medium text-white no-underline"
          style={{background:youtubeConnected?"#22c55e":"#f97316",marginLeft:"auto"}}>
          {youtubeConnected ? "YouTube conectado ✓" : "Conectar YouTube"}
        </a>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>}

      <div className="flex gap-2">
        <button
          onClick={() => setVista("crear")}
          className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
          style={vista==="crear"
            ? {background:"#f97316",color:"white",border:"1px solid #f97316"}
            : {background:"transparent",color:"var(--color-text-secondary)",border:"1px solid var(--color-border-secondary)"}}
        >
          Crear videos
        </button>
        <button
          onClick={() => setVista("historial")}
          className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
          style={vista==="historial"
            ? {background:"#f97316",color:"white",border:"1px solid #f97316"}
            : {background:"transparent",color:"var(--color-text-secondary)",border:"1px solid var(--color-border-secondary)"}}
        >
          Historial de videos
        </button>
      </div>

      {vista === "historial" && <HistorialVideos />}

      {vista === "crear" && <div className="flex gap-4 items-start">
        <div className="space-y-3" style={{width:"260px",flexShrink:0}}>
          <div className="rounded-lg p-3 space-y-2" style={{background:"#f5f3ff",border:"0.5px solid #c4b5fd"}}>
            <p className="text-xs font-medium uppercase tracking-wide" style={{color:"#6d28d9"}}>Para el agente</p>
            {[
              {label:"Perfil de audiencia",key:"perfil"},
              {label:"Vienen de",key:"vienen_de"},
              {label:"Competidor",key:"competidor"},
              {label:"Dolor principal",key:"dolor"},
              {label:"Llamada a la acción",key:"cta"}
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs block mb-1" style={{color:"#6d28d9"}}>{f.label}</label>
                <input className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #c4b5fd",background:"white",color:"#4c1d95"}}
                  value={config[f.key as keyof Config] as string}
                  onChange={e => setConfig(prev => ({...prev,[f.key]:e.target.value}))} />
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs block mb-1" style={{color:"#6d28d9"}}>Edad mín</label>
                <input type="number" className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #c4b5fd",background:"white",color:"#4c1d95"}}
                  value={config.edad_min} onChange={e => setConfig(prev => ({...prev,edad_min:parseInt(e.target.value)||25}))} />
              </div>
              <div className="flex-1">
                <label className="text-xs block mb-1" style={{color:"#6d28d9"}}>Edad máx</label>
                <input type="number" className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #c4b5fd",background:"white",color:"#4c1d95"}}
                  value={config.edad_max} onChange={e => setConfig(prev => ({...prev,edad_max:parseInt(e.target.value)||60}))} />
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{color:"#6d28d9"}}>Tono del guión</label>
              <select className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #c4b5fd",background:"white",color:"#4c1d95"}}
                value={config.tono} onChange={e => setConfig(prev => ({...prev,tono:e.target.value}))}>
                <option>Directo y provocador</option>
                <option>Informativo</option>
                <option>Gracioso</option>
                <option>Emocional</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg p-3 space-y-2" style={{background:"#fef2f2",border:"0.5px solid #fca5a5"}}>
            <p className="text-xs font-medium uppercase tracking-wide" style={{color:"#b91c1c"}}>YouTube orgánico</p>
            {[
              {label:"Keyword principal",key:"keyword"},
              {label:"Hashtags fijos",key:"hashtags"},
              {label:"Descripción miniatura",key:"miniatura"}
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs block mb-1" style={{color:"#b91c1c"}}>{f.label}</label>
                <input className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #fca5a5",background:"white",color:"#991b1b"}}
                  value={config[f.key as keyof Config] as string}
                  onChange={e => setConfig(prev => ({...prev,[f.key]:e.target.value}))} />
              </div>
            ))}
            <div>
              <label className="text-xs block mb-1" style={{color:"#b91c1c"}}>Publicar automáticamente</label>
              <select className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #fca5a5",background:"white",color:"#991b1b"}}
                value={config.horario_publicacion} onChange={e => setConfig(prev => ({...prev,horario_publicacion:e.target.value}))}>
                <option>Al aprobar — inmediato</option>
                <option>Martes 18hs Argentina</option>
                <option>Jueves 18hs Argentina</option>
                <option>Sábado 10hs Argentina</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg" style={{border:"0.5px solid #fed7aa"}}>
            <div className="flex items-center justify-between p-3 cursor-pointer" style={{background:"#fff7ed",borderRadius:"var(--border-radius-lg)"}}
              onClick={() => setConfig(prev => ({...prev,ads_activo:!prev.ads_activo}))}>
              <div>
                <p className="text-xs font-medium" style={{color:"#ea580c"}}>YouTube Ads</p>
                <p className="text-xs" style={{color:"#b45309"}}>Segmentación paga</p>
              </div>
              <div className="rounded-full" style={{width:32,height:18,background:config.ads_activo?"#f97316":"#e5e7eb",border:"0.5px solid",borderColor:config.ads_activo?"#f97316":"#d1d5db",position:"relative",transition:"background .2s"}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:"white",position:"absolute",top:1,left:config.ads_activo?15:1,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}></div>
              </div>
            </div>
            {config.ads_activo && (
              <div className="p-3 space-y-2" style={{background:"#fff7ed"}}>
                {[
                  {label:"Presupuesto diario (USD)",key:"ads_presupuesto",type:"number"},
                  {label:"Intereses",key:"ads_intereses",type:"text"},
                  {label:"Excluir audiencias",key:"ads_excluir",type:"text"}
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs block mb-1" style={{color:"#92400e"}}>{f.label}</label>
                    <input type={f.type} className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #fed7aa",background:"white",color:"#92400e"}}
                      value={config[f.key as keyof Config] as string}
                      onChange={e => setConfig(prev => ({...prev,[f.key]:e.target.value}))} />
                  </div>
                ))}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs block mb-1" style={{color:"#92400e"}}>País</label>
                    <select className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #fed7aa",background:"white",color:"#92400e"}}
                      value={config.ads_pais} onChange={e => setConfig(prev => ({...prev,ads_pais:e.target.value}))}>
                      <option>Argentina</option><option>México</option><option>España</option><option>Colombia</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs block mb-1" style={{color:"#92400e"}}>Género</label>
                    <select className="w-full text-xs px-2 py-1 rounded focus:outline-none" style={{border:"0.5px solid #fed7aa",background:"white",color:"#92400e"}}
                      value={config.ads_genero} onChange={e => setConfig(prev => ({...prev,ads_genero:e.target.value}))}>
                      <option>Todos</option><option>Solo mujeres</option><option>Solo hombres</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs italic" style={{color:"#b45309"}}>Requiere cuenta Google Ads conectada</p>
              </div>
            )}
          </div>

          <button onClick={guardarConfig} disabled={guardandoConfig}
            className="w-full text-xs py-2 rounded font-medium text-white disabled:opacity-50"
            style={{background:"#8b5cf6"}}>
            {guardandoConfig ? "Guardando..." : "Guardar configuración"}
          </button>

          <button onClick={generar} disabled={generando}
            className="w-full text-xs py-2.5 rounded font-medium text-white disabled:opacity-50"
            style={{background:"#f97316"}}>
            {generando ? "Generando..." : "VOLVER A GENERAR GUIÓN"}
          </button>
        </div>

        <div className="space-y-4" style={{flex:1,minWidth:0}}>
          {cargando && <div className="text-xs text-muted-foreground animate-pulse p-4 text-center">Cargando guiones guardados...</div>}
          {!cargando && guiones.length === 0 && (
            <div className="rounded-lg border p-6 text-center text-xs text-muted-foreground">
              Revisá el target y apretá <strong>VOLVER A GENERAR GUIÓN</strong> para crear los guiones.
            </div>
          )}
          {guiones.map((g, idx) => (
            <GuionCard
              key={g.id}
              guion={g}
              idx={idx}
              nota={notas[idx] || ""}
              onNotaChange={(v) => setNotas(prev => { const n=[...prev]; n[idx]=v; return n })}
              onGuardarNota={() => guardarCampo(g.id, "notas", notas[idx]||"")}
              genActivo={genActivo}
              generadores={generadores}
              onGenChange={setGenActivo}
              onAgregarGen={() => setShowPopup(true)}
            />
          ))}
          {guionesExtra.map((g, idx) => (
            <GuionCard
              key={"extra-"+idx}
              guion={g}
              idx={guiones.length+idx}
              nota=""
              onNotaChange={()=>{}}
              onGuardarNota={()=>{}}
              genActivo={genActivo}
              generadores={generadores}
              onGenChange={setGenActivo}
              onAgregarGen={() => setShowPopup(true)}
            />
          ))}
          <button
            onClick={() => setGuionesExtra(prev => [...prev, {
              id: "extra-"+Date.now(),
              guion_titulo: "Mi guión",
              guion_escenas: [
                {tiempo:"[0-3s]",texto:""},
                {tiempo:"[4-10s]",texto:""},
                {tiempo:"[11-20s]",texto:""},
                {tiempo:"[21-27s]",texto:""},
                {tiempo:"[28-30s]",texto:""}
              ],
              guion_hashtags: ""
            }])}
            className="w-full text-xs py-2.5 rounded border font-medium transition-colors"
            style={{borderStyle:"dashed",borderColor:"var(--color-border-secondary)",color:"var(--color-text-secondary)"}}
          >
            + Guión propio — sin IA
          </button>
        </div>
      </div>}
      {showPopup && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-lg)",padding:"1.5rem",width:"400px",border:"0.5px solid var(--color-border-secondary)"}}>
            <p style={{fontSize:"14px",fontWeight:500,marginBottom:"1rem"}}>Agregar generador de video</p>
            <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"1rem"}}>
              <div>
                <label style={{fontSize:"11px",color:"var(--color-text-secondary)",display:"block",marginBottom:"3px"}}>Nombre</label>
                <input className="w-full text-xs px-2 py-1.5 rounded border bg-background focus:outline-none" placeholder="Ej: Pika Labs" value={nuevoGen.nombre} onChange={e=>setNuevoGen(p=>({...p,nombre:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:"11px",color:"var(--color-text-secondary)",display:"block",marginBottom:"3px"}}>API Key</label>
                <input className="w-full text-xs px-2 py-1.5 rounded border bg-background focus:outline-none" type="password" placeholder="sk-..." value={nuevoGen.api_key} onChange={e=>setNuevoGen(p=>({...p,api_key:e.target.value}))} />
              </div>
              <div>
                <label style={{fontSize:"11px",color:"var(--color-text-secondary)",display:"block",marginBottom:"3px"}}>Endpoint</label>
                <input className="w-full text-xs px-2 py-1.5 rounded border bg-background focus:outline-none" placeholder="https://api.ejemplo.com/v1/generate" value={nuevoGen.endpoint} onChange={e=>setNuevoGen(p=>({...p,endpoint:e.target.value}))} />
              </div>
            </div>
            <div style={{display:"flex",gap:"8px",justifyContent:"flex-end"}}>
              <button className="text-xs px-3 py-1.5 rounded border" style={{borderColor:"var(--color-border-secondary)"}} onClick={()=>setShowPopup(false)}>Cancelar</button>
              <button className="text-xs px-4 py-1.5 rounded font-medium text-white" style={{background:"#f97316"}} onClick={guardarNuevoGen}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GuionCard({ guion, idx, nota, onNotaChange, onGuardarNota, genActivo, generadores, onGenChange, onAgregarGen }: {
  guion: Guion; idx: number; nota: string;
  onNotaChange: (v: string) => void; onGuardarNota: () => void
  genActivo: string; generadores: {id:string,nombre:string}[]
  onGenChange: (v: string) => void; onAgregarGen: () => void
}) {
  const [videoListo, setVideoListo] = useState(false)
  const [videoFile, setVideoFile] = useState<File|null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const [dragOver, setDragOver] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [publicado, setPublicado] = useState("")

  const handleVideo = (file: File) => {
    if (!file.type.startsWith("video/")) return
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setVideoListo(true)
  }

  const publicar = async () => {
    if (!videoFile) return
    setPublicando(true)
    try {
      const tokenRes = await fetch("/api/super-admin/youtube-token")
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) { alert("YouTube no conectado"); setPublicando(false); return }

      const titulo = (guion.guion_titulo || "Video tol.ar").slice(0, 97) + " #Shorts"
      const descripcion = (guion.guion_escenas||[]).map((e:any)=>e.texto).join(" ") + "\n\n" + (guion.guion_hashtags||"") + " #Shorts"
      const metadata = {
        snippet: {
          title: titulo,
          description: descripcion.slice(0, 5000),
          tags: (guion.guion_hashtags||"").split(" ").filter((t:string)=>t.startsWith("#")).map((t:string)=>t.slice(1)).slice(0,10),
          categoryId: "22"
        },
        status: { privacyStatus: "public", selfDeclaredMadeForKids: false }
      }

      const form = new FormData()
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
      form.append("media", videoFile)

      const uploadRes = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
        { method: "POST", headers: { Authorization: "Bearer " + tokenData.access_token }, body: form }
      )
      const video = await uploadRes.json()
      if (video.error) { alert("Error YouTube: " + video.error.message); setPublicando(false); return }
      setPublicado("https://youtube.com/shorts/" + video.id)

      await fetch("/api/super-admin/youtube-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guion_id: guion.id, video_id: video.id })
      })
    } catch(e:any) { alert("Error: " + e.message) }
    setPublicando(false)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">YouTube Short {idx + 1}</Badge>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs text-muted-foreground">Generar con:</span>
              <select
                className="text-xs px-2 py-1 rounded border bg-background focus:outline-none"
                style={{borderColor:"#fed7aa",color:"#ea580c",fontWeight:500}}
                value={genActivo}
                onChange={e => e.target.value === "__agregar__" ? onAgregarGen() : onGenChange(e.target.value)}
              >
                {generadores.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
                <option value="__agregar__">+ Agregar nuevo...</option>
              </select>
            </div>
          </div>
            <p className="text-sm font-medium">{guion.guion_titulo}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-3">
            <div className="bg-muted rounded-md p-3 space-y-2">
              {(guion.guion_escenas || []).map((e, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-muted-foreground font-mono min-w-[42px] shrink-0">{e.tiempo}</span>
                  <span className="text-foreground">{e.texto}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">{guion.guion_hashtags}</div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Notas para el agente</label>
              <div className="flex gap-2">
                <textarea
                  className="flex-1 text-xs px-2 py-1.5 rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  rows={2}
                  placeholder="Ej: quiero que sea más gracioso, mencioná que somos argentinos..."
                  value={nota}
                  onChange={e => onNotaChange(e.target.value)}
                  onBlur={onGuardarNota}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sugerencias</p>
            <div className="grid grid-cols-3 gap-1">
              {["Emocional","Racional","Desafío"].map(v => (
                <div key={v} className="border rounded aspect-video flex items-end justify-center pb-1 bg-muted cursor-pointer hover:bg-muted/70 transition-colors">
                  <span className="text-xs text-muted-foreground">{v.slice(0,3)}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {["Emocional","Racional","Desafío"].map(v => (
                <button key={v} className="text-xs py-1 border rounded text-muted-foreground hover:bg-muted transition-colors">Bajar</button>
              ))}
            </div>
            <div
              className="border-2 rounded-lg text-center cursor-pointer transition-colors mt-2 overflow-hidden"
              style={{borderStyle:"dashed",borderColor:dragOver?"#f97316":videoListo?"#22c55e":"var(--color-border-secondary)",background:dragOver?"#fff7ed":"transparent"}}
              onClick={() => { const i=document.createElement("input");i.type="file";i.accept="video/*";i.onchange=(e:any)=>{if(e.target.files[0])handleVideo(e.target.files[0])};i.click() }}
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files[0])handleVideo(e.dataTransfer.files[0])}}
            >
              {videoListo && videoPreview ? (
                <div>
                  <video src={videoPreview} className="w-full rounded" style={{maxHeight:"120px",objectFit:"cover"}} muted playsInline />
                  <p className="text-xs text-green-600 font-medium py-1 truncate px-1">{videoFile?.name}</p>
                </div>
              ) : (
                <div className="p-3">
                  <p className="text-xs font-medium text-muted-foreground">FINAL</p>
                  <p className="text-xs text-muted-foreground">Arrastrá o clickeá</p>
                </div>
              )}
            </div>
            {publicado ? (
              <a href={publicado} target="_blank" rel="noopener noreferrer"
                className="w-full text-xs py-2 rounded font-medium text-center block text-white no-underline"
                style={{background:"#22c55e"}}>
                Ver en YouTube ✓
              </a>
            ) : (
              <button
                disabled={!videoListo || publicando}
                onClick={publicar}
                className="w-full text-xs py-2 rounded font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: videoListo ? "#f97316" : undefined, color: videoListo ? "white" : undefined, border: videoListo ? "none" : "0.5px solid var(--color-border-secondary)" }}
              >
                {publicando ? "Publicando..." : videoListo ? "PUBLICAR" : "Publicar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface VideoHistorial {
  id: string
  titulo: string
  miniatura: string
  fecha: string
  url: string
}

function HistorialVideos() {
  const [videos, setVideos] = useState<VideoHistorial[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => { cargarHistorial() }, [])

  const cargarHistorial = async () => {
    setCargando(true)
    setError("")
    try {
      const tokenRes = await fetch("/api/super-admin/youtube-token")
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) { setError("YouTube no conectado"); setCargando(false); return }
      const auth = { Authorization: "Bearer " + tokenData.access_token }

      const chRes = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
        { headers: auth }
      )
      const chData = await chRes.json()
      const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
      if (!uploadsId) { setError("No se encontró el canal de YouTube"); setCargando(false); return }

      const itemsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsId}`,
        { headers: auth }
      )
      const itemsData = await itemsRes.json()
      if (itemsData.error) { setError("Error YouTube: " + itemsData.error.message); setCargando(false); return }

      const lista: VideoHistorial[] = (itemsData.items || []).map((it: any) => ({
        id: it.snippet.resourceId.videoId,
        titulo: it.snippet.title,
        miniatura: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url || "",
        fecha: it.snippet.publishedAt,
        url: "https://youtube.com/watch?v=" + it.snippet.resourceId.videoId
      }))
      setVideos(lista)
    } catch (e: any) {
      setError("Error de conexión: " + e.message)
    }
    setCargando(false)
  }

  if (cargando) return <div className="text-xs text-muted-foreground animate-pulse p-4 text-center">Cargando historial de YouTube...</div>
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>
  if (videos.length === 0) return <div className="rounded-lg border p-6 text-center text-xs text-muted-foreground">Todavía no hay videos subidos a este canal.</div>

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{videos.length} video{videos.length !== 1 ? "s" : ""} publicado{videos.length !== 1 ? "s" : ""} en el canal</p>
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))"}}>
        {videos.map(v => (
          <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
            className="rounded-lg border overflow-hidden no-underline hover:shadow-md transition-shadow"
            style={{color:"inherit"}}>
            {v.miniatura && <img src={v.miniatura} alt={v.titulo} className="w-full" style={{aspectRatio:"16/9",objectFit:"cover"}} />}
            <div className="p-2">
              <p className="text-xs font-medium line-clamp-2">{v.titulo}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(v.fecha).toLocaleDateString("es-AR")}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
